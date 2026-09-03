import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabase';

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
      const newId = 'usr-' + Date.now().toString();

      const newRecord = {
        id: newId,
        email: cleanEmail,
        password,
        fullName: fullName.trim(),
        role,
        nodeId,
        phone: phone || '',
        bloodGroup: 'O+ Positive',
        medicalNotes: 'None specified',
        emergencyContact: '+94 77 123 4567',
      };

      // Save to local registry
      const storedUsersRaw = await AsyncStorage.getItem(LOCAL_USERS_DB_KEY);
      const registeredUsers = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];
      registeredUsers.push(newRecord);
      await AsyncStorage.setItem(LOCAL_USERS_DB_KEY, JSON.stringify(registeredUsers));

      // Auto login newly registered user
      const registeredUser: any = {
        id: newId,
        email: cleanEmail,
        user_metadata: {
          full_name: newRecord.fullName,
          role: newRecord.role,
          node_id: newRecord.nodeId,
          phone: newRecord.phone,
        },
      };

      const registeredProfile: UserProfile = {
        id: newId,
        email: cleanEmail,
        fullName: newRecord.fullName,
        role: newRecord.role,
        nodeId: newRecord.nodeId,
        phone: newRecord.phone,
        bloodGroup: newRecord.bloodGroup,
        medicalNotes: newRecord.medicalNotes,
        emergencyContact: newRecord.emergencyContact,
      };

      setUser(registeredUser);
      setProfile(registeredProfile);
      await AsyncStorage.setItem(
        LOCAL_USER_KEY,
        JSON.stringify({ user: registeredUser, profile: registeredProfile })
      );

      return { error: null, message: 'Account created successfully!' };
    } catch (err: any) {
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

      const newProfile: UserProfile = {
        ...profile,
        ...updated,
      };

      setProfile(newProfile);
      await AsyncStorage.setItem(
        LOCAL_USER_KEY,
        JSON.stringify({ user, profile: newProfile })
      );

      return { error: null };
    } catch (err: any) {
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
