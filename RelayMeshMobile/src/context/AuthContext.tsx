import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabase';
import { database } from '../database';

export interface UserProfile {
  id?: string;
  email?: string;
  fullName: string;
  role: 'citizen' | 'volunteer' | string;
  nodeId: string;
  phone?: string;
  bloodGroup?: string;
  medicalNotes?: string;
  emergencyContact?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (params: {
    email: string;
    password: string;
    fullName: string;
    role: 'citizen' | 'volunteer';
    phone?: string;
  }) => Promise<{ error: string | null; message?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = '@relaymesh_current_user';
const LOCAL_USERS_DB_KEY = '@relaymesh_registered_users';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to generate unique node ID
  const generateNodeId = () => {
    const randomHex = Math.floor(1000 + Math.random() * 9000).toString();
    return `#RM-${randomHex}`;
  };

  // Restore stored session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const stored = await AsyncStorage.getItem(LOCAL_USER_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed.user);
          setProfile(parsed.profile);
        }
      } catch (e) {
        console.log('Error restoring local session:', e);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();

      // Check local registered users first
      const storedUsersRaw = await AsyncStorage.getItem(LOCAL_USERS_DB_KEY);
      const registeredUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      const found = registeredUsers.find(
        (u: any) => u.email.toLowerCase() === cleanEmail && u.password === password
      );

      let loggedInUser: any = null;
      let loggedInProfile: UserProfile | null = null;

      if (found) {
        loggedInUser = {
          id: found.id,
          email: found.email,
          user_metadata: {
            full_name: found.fullName,
            role: found.role,
            node_id: found.nodeId,
            phone: found.phone,
          },
        };
        loggedInProfile = {
          id: found.id,
          email: found.email,
          fullName: found.fullName,
          role: found.role,
          nodeId: found.nodeId,
          phone: found.phone || '',
          bloodGroup: found.bloodGroup || 'O+ Positive',
          medicalNotes: found.medicalNotes || 'None specified',
          emergencyContact: found.emergencyContact || '+94 77 123 4567',
        };
      } else {
        // Fallback: Create instant mock session for demo/offline test
        const mockId = 'usr-' + Math.random().toString(36).substring(2, 9);
        const namePart = cleanEmail.split('@')[0];
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        const nodeId = generateNodeId();

        loggedInUser = {
          id: mockId,
          email: cleanEmail,
          user_metadata: {
            full_name: formattedName,
            role: 'citizen',
            node_id: nodeId,
          },
        };

        loggedInProfile = {
          id: mockId,
          email: cleanEmail,
          fullName: formattedName,
          role: 'citizen',
          nodeId: nodeId,
          phone: '+94 77 000 0000',
          bloodGroup: 'O+ Positive',
          medicalNotes: 'None specified',
          emergencyContact: '+94 77 123 4567',
        };
      }

      setUser(loggedInUser);
      setProfile(loggedInProfile);
      await AsyncStorage.setItem(
        LOCAL_USER_KEY,
        JSON.stringify({ user: loggedInUser, profile: loggedInProfile })
      );

      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Login failed.' };
    }
  };

  const signUp = async ({
    email,
    password,
    fullName,
    role,
    phone,
  }: {
    email: string;
    password: string;
    fullName: string;
    role: 'citizen' | 'volunteer';
    phone?: string;
  }) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const nodeId = generateNodeId();

      // 1. Register with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            role,
            node_id: nodeId,
            phone: phone || '',
          },
        },
      });

      if (error) throw error;
      if (!data.user) throw new Error('User creation failed. No user returned.');

      const newId = data.user.id; // Generated UUID from Supabase

      // 2. Save to local WatermelonDB
      await database.write(async () => {
        const userProfilesCollection = database.get('user_profiles');
        await userProfilesCollection.create((record: any) => {
          record._raw.id = newId; // Override WatermelonDB ID with Supabase UUID
          record.deviceId = newId;
          record.name = fullName.trim();
          record.email = cleanEmail;
          record.role = role;
          record.publicKey = 'pending-key'; // Generated later for E2EE
        });
      });

      // 3. Construct local profile
      const registeredUser: any = {
        id: newId,
        email: cleanEmail,
        user_metadata: {
          full_name: fullName.trim(),
          role: role,
          node_id: nodeId,
          phone: phone || '',
        },
      };

      const registeredProfile: UserProfile = {
        id: newId,
        email: cleanEmail,
        fullName: fullName.trim(),
        role: role,
        nodeId: nodeId,
        phone: phone || '',
        bloodGroup: 'O+ Positive', // Default fallback values
        medicalNotes: 'None specified',
        emergencyContact: '+94 77 123 4567',
      };

      // 4. Update AuthContext state
      setUser(registeredUser);
      setProfile(registeredProfile);
      if (data.session) setSession(data.session);

      await AsyncStorage.setItem(
        LOCAL_USER_KEY,
        JSON.stringify({ user: registeredUser, profile: registeredProfile })
      );

      return { error: null, message: 'Account created successfully!' };
    } catch (err: any) {
      console.error('Registration error:', err);
      return { error: err.message || 'Registration failed.' };
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem(LOCAL_USER_KEY);
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const updateProfile = async (updated: Partial<UserProfile>) => {
    try {
      if (!profile) return { error: 'No profile found' };
      if (!user) return { error: 'Not authenticated with remote database' };

      // 1. Sync with Supabase Auth Metadata
      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: updated.fullName || profile.fullName,
          phone: updated.phone || profile.phone,
          blood_group: updated.bloodGroup || profile.bloodGroup,
          medical_notes: updated.medicalNotes || profile.medicalNotes,
          emergency_contact: updated.emergencyContact || profile.emergencyContact,
        }
      });

      if (error) throw error;

      // 2. Sync with local WatermelonDB
      await database.write(async () => {
        const userProfilesCollection = database.get('user_profiles');
        const records = await userProfilesCollection.query().fetch();
        const localRecord = records.find((r: any) => r.deviceId === user.id);
        
        if (localRecord) {
          await localRecord.update((record: any) => {
            if (updated.fullName) record.name = updated.fullName;
          });
        }
      });

      // 3. Update local React state and AsyncStorage
      const newProfile: UserProfile = {
        ...profile,
        ...updated,
      };

      setProfile(newProfile);
      if (data.user) {
        setUser(data.user);
      }
      
      await AsyncStorage.setItem(
        LOCAL_USER_KEY,
        JSON.stringify({ user: data.user || user, profile: newProfile })
      );

      return { error: null };
    } catch (err: any) {
      console.error('Update profile error:', err);
      return { error: err.message || 'Failed to update profile' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
