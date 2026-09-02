import { mySchema } from '../src/database/schema';
import { migrations } from '../src/database/migrations';
import { database, Conversation, Message, EncryptionKey, Resource, UserProfile } from '../src/database';
import * as Models from '../src/database/models';
import { userIdentityService } from '../src/services/UserIdentityService';
import { generateKeyPair, encryptMessage, decryptMessage } from '../src/modules/messaging/utils/crypto';

describe('Stage 1: Local Data Layer, Migrations & Device Identity Verification', () => {
  beforeEach(async () => {
    await userIdentityService.resetIdentity();
  });

  describe('1. WatermelonDB Schema & Migration Definitions', () => {
    it('should have schema version 2 or higher', () => {
      expect(mySchema.version).toBeGreaterThanOrEqual(2);
    });

    it('should include all 5 required tables in schema', () => {
      const tableNames = Object.keys(mySchema.tables);
      expect(tableNames).toContain('conversations');
      expect(tableNames).toContain('messages');
      expect(tableNames).toContain('encryption_keys');
      expect(tableNames).toContain('resources');
      expect(tableNames).toContain('user_profiles');
    });

    it('should define version 1 -> 2+ migration without modifying existing tables', () => {
      expect(migrations).toBeDefined();
      expect(migrations.validated).toBe(true);
      expect(migrations.minVersion).toBe(1);
      expect(migrations.maxVersion).toBeGreaterThanOrEqual(2);
    });

    it('should define all required columns for resources table', () => {
      const resourceTable = mySchema.tables.resources;
      expect(resourceTable).toBeDefined();
      const columnNames = Object.keys(resourceTable.columns);
      expect(columnNames).toContain('name');
      expect(columnNames).toContain('title');
      expect(columnNames).toContain('category');
      expect(columnNames).toContain('description');
      expect(columnNames).toContain('latitude');
      expect(columnNames).toContain('longitude');
      expect(columnNames).toContain('capacity');
      expect(columnNames).toContain('available_capacity');
      expect(columnNames).toContain('status');
      expect(columnNames).toContain('amenities');
      expect(columnNames).toContain('contact_info');
      expect(columnNames).toContain('verified_at');
      expect(columnNames).toContain('last_synced_at');
      expect(columnNames).toContain('created_at');
      expect(columnNames).toContain('updated_at');
    });

    it('should define all required columns for user_profiles table without storing password', () => {
      const userProfileTable = mySchema.tables.user_profiles;
      expect(userProfileTable).toBeDefined();
      const columnNames = Object.keys(userProfileTable.columns);
      expect(columnNames).toContain('device_id');
      expect(columnNames).toContain('name');
      expect(columnNames).toContain('email');
      expect(columnNames).toContain('role');
      expect(columnNames).toContain('public_key');
      expect(columnNames).toContain('created_at');
      expect(columnNames).toContain('updated_at');
      expect(columnNames).not.toContain('password');
    });
  });

  describe('2. Model Registration & Export Integrity', () => {
    it('should register all 5 models in database collections', () => {
      expect(database.collections.get<Conversation>('conversations').modelClass).toBe(Conversation);
      expect(database.collections.get<Message>('messages').modelClass).toBe(Message);
      expect(database.collections.get<EncryptionKey>('encryption_keys').modelClass).toBe(EncryptionKey);
      expect(database.collections.get<Resource>('resources').modelClass).toBe(Resource);
      expect(database.collections.get<UserProfile>('user_profiles').modelClass).toBe(UserProfile);
    });

    it('should export concrete model classes from database/models', () => {
      expect(Models.Conversation).toBe(Conversation);
      expect(Models.Message).toBe(Message);
      expect(Models.EncryptionKey).toBe(EncryptionKey);
      expect(Models.Resource).toBe(Resource);
      expect(Models.UserProfile).toBe(UserProfile);
    });
  });

  describe('3. Cryptographic Key Reuse & Module 3 Compatibility', () => {
    it('should generate valid Curve25519 keypairs using existing crypto utility', () => {
      const keypair = generateKeyPair();
      expect(typeof keypair.publicKey).toBe('string');
      expect(typeof keypair.privateKey).toBe('string');
      expect(keypair.publicKey.length).toBeGreaterThan(20);
      expect(keypair.privateKey.length).toBeGreaterThan(20);
    });

    it('should encrypt and decrypt messages correctly using existing Module 3 crypto functions', () => {
      const alice = generateKeyPair();
      const bob = generateKeyPair();
      const secretMessage = 'Emergency evacuation route active via sector 4';

      const encrypted = encryptMessage(secretMessage, alice.privateKey, bob.publicKey);
      expect(typeof encrypted).toBe('string');
      expect(encrypted).not.toBe(secretMessage);

      const decrypted = decryptMessage(encrypted, bob.privateKey, alice.publicKey);
      expect(decrypted).toBe(secretMessage);
    });
  });

  describe('4. UserIdentityService & Device ID Validation', () => {
    it('should generate device IDs strictly adhering to /^RM-[A-Z0-9]{4}$/', () => {
      for (let i = 0; i < 50; i++) {
        const id = userIdentityService.generateDeviceId();
        expect(id).toMatch(/^RM-[A-Z0-9]{4}$/);
        expect(id.length).toBe(7);
      }
    });

    it('should create an identity and persist it in WatermelonDB', async () => {
      const profile = await userIdentityService.getOrCreateIdentity('Alpha Responder', 'volunteer', 'alpha@mesh.local');
      expect(profile).toBeDefined();
      expect(profile.deviceId).toMatch(/^RM-[A-Z0-9]{4}$/);
      expect(profile.name).toBe('Alpha Responder');
      expect(profile.role).toBe('volunteer');
      expect(profile.email).toBe('alpha@mesh.local');
      expect(profile.publicKey).toBeDefined();

      // Verify EncryptionKey was stored
      const keys = await database.collections.get<EncryptionKey>('encryption_keys').query().fetch();
      expect(keys.length).toBe(1);
      expect(keys[0].nodeId).toBe(profile.deviceId);
      expect(keys[0].publicKey).toBe(profile.publicKey);
      expect(keys[0].privateKey).toBeDefined();
    });

    it('should be idempotent: multiple getOrCreateIdentity calls return the same identity without duplicates', async () => {
      const first = await userIdentityService.getOrCreateIdentity('Node 1', 'citizen');
      const second = await userIdentityService.getOrCreateIdentity('Node 2', 'volunteer');

      expect(second.id).toBe(first.id);
      expect(second.deviceId).toBe(first.deviceId);
      expect(second.role).toBe('citizen'); // Original role preserved

      const profiles = await database.collections.get<UserProfile>('user_profiles').query().fetch();
      expect(profiles.length).toBe(1);

      const keys = await database.collections.get<EncryptionKey>('encryption_keys').query().fetch();
      expect(keys.length).toBe(1);
    });

    it('should support updating roles and profiles', async () => {
      await userIdentityService.getOrCreateIdentity('Initial Name', 'citizen');
      
      const updatedRole = await userIdentityService.setRole('volunteer');
      expect(updatedRole.role).toBe('volunteer');

      const updatedProfile = await userIdentityService.updateProfile({
        name: 'Rescue Volunteer',
        email: 'rescuer@mesh.local',
      });
      expect(updatedProfile.name).toBe('Rescue Volunteer');
      expect(updatedProfile.email).toBe('rescuer@mesh.local');
      expect(updatedProfile.role).toBe('volunteer');
    });

    it('should reset local identity without deleting unrelated conversations or messages', async () => {
      // 1. Create a dummy conversation and message
      let convId = '';
      await database.write(async () => {
        const conv = await database.collections.get<Conversation>('conversations').create((c) => {
          c.participantIds = JSON.stringify(['RM-0001', 'RM-0002']);
          c.isGroup = false;
          c.lastMessageAt = Date.now();
        });
        convId = conv.id;

        await database.collections.get<Message>('messages').create((m) => {
          m.conversationId = conv.id;
          m.senderId = 'RM-0001';
          m.encryptedPayload = 'test-payload';
          m.status = 'Delivered';
          m.hopCount = 1;
        });
      });

      // 2. Create identity
      await userIdentityService.getOrCreateIdentity('Test User', 'citizen');

      // 3. Reset identity
      await userIdentityService.resetIdentity();

      // 4. Verify identity is gone
      const identity = await userIdentityService.getIdentity();
      expect(identity).toBeNull();

      // 5. Verify conversation and message remain intact
      const remainingConvs = await database.collections.get<Conversation>('conversations').query().fetch();
      expect(remainingConvs.length).toBe(1);
      expect(remainingConvs[0].id).toBe(convId);

      const remainingMsgs = await database.collections.get<Message>('messages').query().fetch();
      expect(remainingMsgs.length).toBe(1);
    });
  });
});
