import { NativeModules, Platform } from 'react-native';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import { mySchema } from './schema';

const createAdapter = () => {
  // Use native SQLiteAdapter only if native bridge is linked
  if (Platform.OS !== 'web' && NativeModules?.WMDatabaseBridge) {
    return new SQLiteAdapter({
      schema: mySchema,
      jsi: false,
      onSetUpError: (error) => console.warn('WatermelonDB SQLite setup warning:', error),
    });
  }

  // Gracefully fallback to LokiJS in Expo Go, Simulator, and Web environments
  return new LokiJSAdapter({
    schema: mySchema,
    useWebWorker: false,
    useIncrementalIndexedDB: true,
  });
};

export const dbAdapter = createAdapter();