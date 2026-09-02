import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  'https://zokiceiwgigauwqqhrnm.supabase.co';

export const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpva2ljZWl3Z2lnYXV3cXFocm5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3NTE3MTgsImV4cCI6MjEwMzMyNzcxOH0.3Lo30k9SFesF-keaIYcvW96DHBoOtp4qE_pvO1QPiSQ';

// Fallback memory storage to prevent crashes if native AsyncStorage bridge is missing
const memoryStorage: Record<string, string> = {};

const customStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      return localStorage.getItem(key);
    }
    try {
      const value = await AsyncStorage.getItem(key);
      return value ?? memoryStorage[key] ?? null;
    } catch {
      return memoryStorage[key] ?? null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
      return;
    }
    memoryStorage[key] = value;
    try {
      await AsyncStorage.setItem(key, value);
    } catch {
      // Memory storage fallback active
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
      return;
    }
    delete memoryStorage[key];
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // Memory storage fallback active
    }
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: customStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
