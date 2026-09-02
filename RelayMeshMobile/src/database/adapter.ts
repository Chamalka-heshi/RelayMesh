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
import { Platform } from 'react-native';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import { mySchema } from './schema';
import { migrations } from './migrations';

const createAdapter = () => {
  // Use LokiJS for Jest unit tests OR browser (web) environments
  if (
    process.env.NODE_ENV === 'test' ||
    typeof jest !== 'undefined' ||
    Platform.OS === 'web'
  ) {
    return new LokiJSAdapter({
      schema: mySchema,
      migrations,
      useWebWorker: false,
      useIncrementalIndexedDB: false,
    });
  }

  // Use SQLite for Native iOS and Android
  return new SQLiteAdapter({
    schema: mySchema,
    migrations,
    jsi: false,
    onSetUpError: (error: any) =>
      console.error('WatermelonDB setup error:', error),
  });
};

export const dbAdapter = createAdapter();