import { database, Conversation, Message, EncryptionKey, UserProfile } from '../src/database';
import { userIdentityService } from '../src/services/UserIdentityService';
import { Q } from '@nozbe/watermelondb';

describe('Stage 1: Runtime Verification for UserIdentityService & WatermelonDB', () => {
  beforeEach(async () => {
    await userIdentityService.resetIdentity();
  });

  afterAll(async () => {
    await userIdentityService.resetIdentity();
  });

  test('Verification 1-8: Initial getOrCreateIdentity() creates valid UserProfile and EncryptionKey', async () => {
    // 1. Call UserIdentityService.getOrCreateIdentity()
    const profile = await userIdentityService.getOrCreateIdentity('Citizen Alpha', 'citizen', 'citizen.alpha@mesh.local');

    // 2. Verify that a UserProfile record is created
    expect(profile).toBeDefined();
    expect(profile.id).toBeDefined();
    const fetchedProfiles = await database.collections.get<UserProfile>('user_profiles').query().fetch();
    expect(fetchedProfiles.length).toBe(1);
    expect(fetchedProfiles[0].id).toBe(profile.id);

    // 3. Verify the device ID matches /^RM-[A-Z0-9]{4}$/
    expect(profile.deviceId).toMatch(/^RM-[A-Z0-9]{4}$/);
    expect(profile.deviceId.length).toBe(7);

    // 4. Verify the role is either citizen or volunteer
    expect(['citizen', 'volunteer']).toContain(profile.role);
    expect(profile.role).toBe('citizen');

    // 5. Verify a public key exists
    expect(profile.publicKey).toBeDefined();
    expect(typeof profile.publicKey).toBe('string');
    expect(profile.publicKey.length).toBeGreaterThan(20);

    // 6. Verify a corresponding EncryptionKey record exists for the same device/node
    const encKeys = await database.collections
      .get<EncryptionKey>('encryption_keys')
      .query(Q.where('node_id', profile.deviceId))
      .fetch();
    expect(encKeys.length).toBe(1);
    const keyRecord = encKeys[0];
    expect(keyRecord.nodeId).toBe(profile.deviceId);

    // 7. Verify the public key matches between UserProfile and EncryptionKey
    expect(keyRecord.publicKey).toBe(profile.publicKey);

    // 8. Verify the private key exists only in EncryptionKey and is NOT stored in UserProfile
    expect(keyRecord.privateKey).toBeDefined();
    expect(typeof keyRecord.privateKey).toBe('string');
    expect(keyRecord.privateKey!.length).toBeGreaterThan(20);
    // Explicitly verify UserProfile schema & model does NOT have privateKey or password
    expect((profile as any).privateKey).toBeUndefined();
    expect((profile as any).password).toBeUndefined();
  });

  test('Verification 9-11: Idempotency - second getOrCreateIdentity() call returns same identity with no duplicates', async () => {
    // Initial creation
    const firstCall = await userIdentityService.getOrCreateIdentity('Original Node', 'citizen');
    const initialDeviceId = firstCall.deviceId;
    const initialPublicKey = firstCall.publicKey;

    // 9. Call getOrCreateIdentity() a second time
    const secondCall = await userIdentityService.getOrCreateIdentity('Different Name', 'volunteer');

    // 10. Verify the same device ID and public key are returned
    expect(secondCall.id).toBe(firstCall.id);
    expect(secondCall.deviceId).toBe(initialDeviceId);
    expect(secondCall.publicKey).toBe(initialPublicKey);
    expect(secondCall.role).toBe('citizen'); // Preserved original role

    // 11. Verify no duplicate UserProfile or EncryptionKey records are created
    const allProfiles = await database.collections.get<UserProfile>('user_profiles').query().fetch();
    expect(allProfiles.length).toBe(1);

    const allKeys = await database.collections.get<EncryptionKey>('encryption_keys').query().fetch();
    expect(allKeys.length).toBe(1);
  });

  test('Verification 12: Test setRole("volunteer") and verify persistence', async () => {
    await userIdentityService.getOrCreateIdentity('Role Tester', 'citizen');

    // 12. Test setRole('volunteer') and verify persistence
    const updated = await userIdentityService.setRole('volunteer');
    expect(updated.role).toBe('volunteer');

    // Verify persisted in database
    const fetched = await database.collections.get<UserProfile>('user_profiles').find(updated.id);
    expect(fetched.role).toBe('volunteer');
  });

  test('Verification 13: Test setRole("citizen") and verify persistence', async () => {
    await userIdentityService.getOrCreateIdentity('Role Tester 2', 'volunteer');

    // 13. Test setRole('citizen') and verify persistence
    const updated = await userIdentityService.setRole('citizen');
    expect(updated.role).toBe('citizen');

    // Verify persisted in database
    const fetched = await database.collections.get<UserProfile>('user_profiles').find(updated.id);
    expect(fetched.role).toBe('citizen');
  });

  test('Verification 14: Test updateProfile() for name/email', async () => {
    const initial = await userIdentityService.getOrCreateIdentity('Initial Name', 'citizen', 'initial@mesh.local');

    // 14. Test updateProfile() for name/email
    const updated = await userIdentityService.updateProfile({
      name: 'Verified Name',
      email: 'verified@mesh.local',
    });
    expect(updated.name).toBe('Verified Name');
    expect(updated.email).toBe('verified@mesh.local');

    // Verify persisted in database
    const fetched = await database.collections.get<UserProfile>('user_profiles').find(initial.id);
    expect(fetched.name).toBe('Verified Name');
    expect(fetched.email).toBe('verified@mesh.local');
  });

  test('Verification 15: Verify resetIdentity() removes only local identity and key while preserving conversations, messages, and peer keys', async () => {
    // 1. Populate dummy conversation, message, and a peer encryption key
    let conversationId = '';
    const peerNodeId = 'RM-9999';

    await database.write(async () => {
      const conv = await database.collections.get<Conversation>('conversations').create((c) => {
        c.participantIds = JSON.stringify(['RM-0001', peerNodeId]);
        c.isGroup = false;
        c.lastMessageAt = Date.now();
      });
      conversationId = conv.id;

      await database.collections.get<Message>('messages').create((m) => {
        m.conversationId = conv.id;
        m.senderId = peerNodeId;
        m.encryptedPayload = 'encrypted-evacuation-route';
        m.status = 'Delivered';
        m.hopCount = 2;
      });

      // Peer key (must NOT have privateKey)
      await database.collections.get<EncryptionKey>('encryption_keys').create((k) => {
        k.nodeId = peerNodeId;
        k.publicKey = 'PEER_PUBLIC_KEY_BASE64_ABC123';
      });
    });

    // 2. Create local identity
    const localProfile = await userIdentityService.getOrCreateIdentity('Local Node', 'citizen');
    const localDeviceId = localProfile.deviceId;

    // Verify 2 keys currently exist (1 local, 1 peer)
    const keysBeforeReset = await database.collections.get<EncryptionKey>('encryption_keys').query().fetch();
    expect(keysBeforeReset.length).toBe(2);

    // 3. Perform resetIdentity()
    await userIdentityService.resetIdentity();

    // 4. Verify local profile is removed
    const profilesAfterReset = await database.collections.get<UserProfile>('user_profiles').query().fetch();
    expect(profilesAfterReset.length).toBe(0);

    const identityQuery = await userIdentityService.getIdentity();
    expect(identityQuery).toBeNull();

    // 5. Verify local key was removed, BUT peer key is preserved!
    const keysAfterReset = await database.collections.get<EncryptionKey>('encryption_keys').query().fetch();
    expect(keysAfterReset.length).toBe(1);
    expect(keysAfterReset[0].nodeId).toBe(peerNodeId);
    expect(keysAfterReset[0].publicKey).toBe('PEER_PUBLIC_KEY_BASE64_ABC123');

    // 6. Verify conversations and messages remain completely intact!
    const remainingConversations = await database.collections.get<Conversation>('conversations').query().fetch();
    expect(remainingConversations.length).toBe(1);
    expect(remainingConversations[0].id).toBe(conversationId);

    const remainingMessages = await database.collections.get<Message>('messages').query().fetch();
    expect(remainingMessages.length).toBe(1);
    expect(remainingMessages[0].encryptedPayload).toBe('encrypted-evacuation-route');
  });
});
