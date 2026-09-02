import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Generate a deterministic or random fallback node ID if none exists
  const generateNodeId = () => {
    const randomHex = Math.floor(1000 + Math.random() * 9000).toString();
    return `#RM-${randomHex}`;
  };

  const extractProfileFromUser = (usr: User | null): UserProfile | null => {
    if (!usr) return null;
    const metadata = usr.user_metadata || {};
    return {
      id: usr.id,
      email: usr.email || '',
      fullName: metadata.full_name || metadata.name || 'Responder Node',
      role: metadata.role || 'citizen',
      nodeId: metadata.node_id || `#RM-${usr.id.substring(0, 4).toUpperCase()}`,
      phone: metadata.phone || '',
      bloodGroup: metadata.blood_group || 'O+ Positive',
      medicalNotes: metadata.medical_notes || 'None specified',
      emergencyContact: metadata.emergency_contact || '+94 77 123 4567',
    };
  };

  // Sync profile with database public.profiles table if available
  const syncWithDatabaseProfile = async (usr: User | null, initialProf: UserProfile | null) => {
    if (!usr || !initialProf) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', usr.id)
        .maybeSingle();

      if (data && !error) {
        setProfile({
          id: usr.id,
          email: usr.email || '',
          fullName: data.full_name || initialProf.fullName,
          role: data.role || initialProf.role,
          nodeId: data.node_id || initialProf.nodeId,
          phone: data.phone || initialProf.phone,
          bloodGroup: data.blood_group || initialProf.bloodGroup,
          medicalNotes: data.medical_notes || initialProf.medicalNotes,
          emergencyContact: data.emergency_contact || initialProf.emergencyContact,
        });
      } else {
        // Attempt to upsert initial profile into profiles table
        await supabase.from('profiles').upsert(
          {
            id: usr.id,
            email: usr.email,
            full_name: initialProf.fullName,
            role: initialProf.role,
            node_id: initialProf.nodeId,
            phone: initialProf.phone,
            blood_group: initialProf.bloodGroup,
            medical_notes: initialProf.medicalNotes,
            emergency_contact: initialProf.emergencyContact,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );
      }
    } catch {
      // Gracefully ignore if profiles table is not yet created
    }
  };

  useEffect(() => {
    // 1. Initial Session Check
    supabase.auth.getSession().then(({ data: { session: currentSession }, error }) => {
      if (error) {
        console.error('Error fetching session:', error.message);
      }
      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);
      const extracted = extractProfileFromUser(currentUser);
      setProfile(extracted);
      setLoading(false);

      if (currentUser && extracted) {
        syncWithDatabaseProfile(currentUser, extracted);
      }
    });

    // 2. Listen to Auth State Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      const newUser = newSession?.user ?? null;
      setUser(newUser);
      const extracted = extractProfileFromUser(newUser);
      setProfile(extracted);
      setLoading(false);

      if (newUser && extracted) {
        syncWithDatabaseProfile(newUser, extracted);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { error: error.message };
      }

      setUser(data.user);
      setSession(data.session);
      const extracted = extractProfileFromUser(data.user);
      setProfile(extracted);
      if (data.user && extracted) {
        syncWithDatabaseProfile(data.user, extracted);
      }
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'An unexpected error occurred during sign in.' };
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
      const nodeId = generateNodeId();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
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

      if (error) {
        return { error: error.message };
      }

      // Check if email confirmation is required by Supabase project settings
      if (data.user && !data.session) {
        return {
          error: null,
          message: 'Account created! Please check your email to confirm your registration if required.',
        };
      }

      setUser(data.user);
      setSession(data.session);
      const extracted = extractProfileFromUser(data.user);
      setProfile(extracted);
      if (data.user && extracted) {
        syncWithDatabaseProfile(data.user, extracted);
      }
      return { error: null, message: 'Account created successfully!' };
    } catch (err: any) {
      return { error: err.message || 'An unexpected error occurred during registration.' };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const updateProfile = async (updated: Partial<UserProfile>) => {
    try {
      if (!user) return { error: 'No authenticated user found' };

      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: updated.fullName ?? profile?.fullName,
          role: updated.role ?? profile?.role,
          blood_group: updated.bloodGroup ?? profile?.bloodGroup,
          medical_notes: updated.medicalNotes ?? profile?.medicalNotes,
          emergency_contact: updated.emergencyContact ?? profile?.emergencyContact,
          phone: updated.phone ?? profile?.phone,
        },
      });

      if (error) {
        return { error: error.message };
      }

      setUser(data.user);
      const extracted = extractProfileFromUser(data.user);
      setProfile(extracted);

      // Also update public.profiles table if present
      try {
        await supabase.from('profiles').upsert(
          {
            id: user.id,
            full_name: updated.fullName ?? profile?.fullName,
            role: updated.role ?? profile?.role,
            blood_group: updated.bloodGroup ?? profile?.bloodGroup,
            medical_notes: updated.medicalNotes ?? profile?.medicalNotes,
            emergency_contact: updated.emergencyContact ?? profile?.emergencyContact,
            phone: updated.phone ?? profile?.phone,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );
      } catch {
        // Ignore if profiles table is not setup
      }

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
