import { database, UserProfile, EncryptionKey } from '../database';
import { generateKeyPair } from '../modules/messaging/utils/crypto';
import { UserRole } from '../database/UserProfile';
import { Q } from '@nozbe/watermelondb';

export type { UserRole };

export interface IdentityData {
  deviceId: string;
  name: string;
  email?: string;
  role: UserRole;
  publicKey: string;
}

export class UserIdentityService {
  private static instance: UserIdentityService;
  private cachedProfile: UserProfile | null = null;
  private initPromise: Promise<UserProfile> | null = null;

  private constructor() {}

  public static getInstance(): UserIdentityService {
    if (!UserIdentityService.instance) {
      UserIdentityService.instance = new UserIdentityService();
    }
    return UserIdentityService.instance;
  }

  /**
   * Generates a persistent Ephemeral Device ID in the standard format RM-XXXX
   * where XXXX is exactly 4 uppercase hexadecimal/alphanumeric characters.
   * Matches /^RM-[A-Z0-9]{4}$/
   * e.g., RM-84F2, RM-7A3B, RM-4587
   */
  public generateDeviceId(): string {
    const chars = '0123456789ABCDEF';
    let suffix = '';
    for (let i = 0; i < 4; i++) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `RM-${suffix}`;
  }

  /**
   * Retrieves existing UserProfile if available, or returns null.
   */
  public async getIdentity(): Promise<UserProfile | null> {
    if (this.cachedProfile) {
      return this.cachedProfile;
    }

    try {
      const profiles = await database.collections
        .get<UserProfile>('user_profiles')
        .query()
        .fetch();

      if (profiles && profiles.length > 0) {
        this.cachedProfile = profiles[0];
        return this.cachedProfile;
      }
      return null;
    } catch (error) {
      console.error('[UserIdentityService] Error fetching identity:', error);
      return null;
    }
  }

  /**
   * Ensures an identity exists in an idempotent manner.
   * If one does not exist, generates a new persistent RM-XXXX device identifier
   * and Curve25519 cryptographic keypair, persisting both in WatermelonDB.
   *
   * Calling multiple times concurrently or sequentially will always return the
   * same persisted identity and never create duplicate records.
   */
  public async getOrCreateIdentity(
    defaultName: string = 'Relay Node',
    defaultRole: UserRole = 'citizen',
    email?: string
  ): Promise<UserProfile> {
    // Validate role
    const validatedRole: UserRole =
      defaultRole === 'volunteer' ? 'volunteer' : 'citizen';

    // 1. Check in-memory cache
    if (this.cachedProfile) {
      return this.cachedProfile;
    }

    // 2. Prevent race conditions by reusing existing in-flight promise
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      try {
        // Check database for existing profile
        const existing = await this.getIdentity();
        if (existing) {
          this.cachedProfile = existing;
          return existing;
        }

        // Generate persistent RM-XXXX device ID and cryptographic keypair
        const deviceId = this.generateDeviceId();
        const keyPair = generateKeyPair();

        let createdProfile!: UserProfile;

        // Atomic transaction to persist EncryptionKey and UserProfile
        await database.write(async () => {
          // Check if key already exists for this deviceId (to avoid duplicates)
          const existingKeys = await database.collections
            .get<EncryptionKey>('encryption_keys')
            .query(Q.where('node_id', deviceId))
            .fetch();

          if (existingKeys.length === 0) {
            await database.collections
              .get<EncryptionKey>('encryption_keys')
              .create((keyRecord) => {
                keyRecord.nodeId = deviceId;
                keyRecord.publicKey = keyPair.publicKey;
                keyRecord.privateKey = keyPair.privateKey;
              });
          }

          // Create UserProfile (without password storage)
          createdProfile = await database.collections
            .get<UserProfile>('user_profiles')
            .create((profile) => {
              profile.deviceId = deviceId;
              profile.name = defaultName;
              if (email) {
                profile.email = email;
              }
              profile.role = validatedRole;
              profile.publicKey = keyPair.publicKey;
            });
        });

        this.cachedProfile = createdProfile;
        return createdProfile;
      } finally {
        this.initPromise = null;
      }
    })();

    return this.initPromise;
  }

  /**
   * Gets the persistent device ID string (e.g. RM-XXXX), initializing if not present.
   */
  public async getDeviceId(): Promise<string> {
    const profile = await this.getOrCreateIdentity();
    return profile.deviceId;
  }

  /**
   * Gets the public key string for this device.
   */
  public async getPublicKey(): Promise<string> {
    const profile = await this.getOrCreateIdentity();
    return profile.publicKey;
  }

  /**
   * Updates user role ('citizen' | 'volunteer').
   * Rejects any invalid role string.
   */
  public async setRole(role: UserRole): Promise<UserProfile> {
    if (role !== 'citizen' && role !== 'volunteer') {
      throw new Error(`Invalid role "${role}". Allowed roles are 'citizen' or 'volunteer'.`);
    }

    const profile = await this.getOrCreateIdentity();
    await database.write(async () => {
      await profile.update((p) => {
        p.role = role;
      });
    });
    this.cachedProfile = profile;
    return profile;
  }

  /**
   * Updates general profile attributes (name, email, role).
   */
  public async updateProfile(data: {
    name?: string;
    email?: string;
    role?: UserRole;
  }): Promise<UserProfile> {
    if (data.role && data.role !== 'citizen' && data.role !== 'volunteer') {
      throw new Error(`Invalid role "${data.role}". Allowed roles are 'citizen' or 'volunteer'.`);
    }

    const profile = await this.getOrCreateIdentity();
    await database.write(async () => {
      await profile.update((p) => {
        if (data.name !== undefined) p.name = data.name;
        if (data.email !== undefined) p.email = data.email;
        if (data.role !== undefined) p.role = data.role;
      });
    });
    this.cachedProfile = profile;
    return profile;
  }

  /**
   * Resets the local device identity and associated local node encryption key.
   * NOTE: This is intended for development, testing, or account logout.
   * It safely deletes only the local node's UserProfile and own EncryptionKey,
   * without deleting unrelated conversations, messages, or peer encryption keys.
   */
  public async resetIdentity(): Promise<void> {
    const currentDeviceId = this.cachedProfile?.deviceId;
    this.cachedProfile = null;
    this.initPromise = null;

    await database.write(async () => {
      // 1. Delete all user profile records
      const profiles = await database.collections
        .get<UserProfile>('user_profiles')
        .query()
        .fetch();
      for (const p of profiles) {
        await p.destroyPermanently();
      }

      // 2. Delete only the local device's encryption key (or all if currentDeviceId is unknown)
      if (currentDeviceId) {
        const ownKeys = await database.collections
          .get<EncryptionKey>('encryption_keys')
          .query(Q.where('node_id', currentDeviceId))
          .fetch();
        for (const k of ownKeys) {
          await k.destroyPermanently();
        }
      }
    });
  }
}

export const userIdentityService = UserIdentityService.getInstance();
