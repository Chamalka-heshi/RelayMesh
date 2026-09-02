import { NativeModules, Platform } from 'react-native';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import { mySchema } from './schema';
import { migrations } from './migrations';

const createAdapter = () => {
  // Use LokiJS for Jest unit tests, web browser environments, or Expo Go (where native bridge is not compiled)
  if (
    process.env.NODE_ENV === 'test' ||
    typeof (globalThis as any).jest !== 'undefined' ||
    Platform.OS === 'web' ||
    !NativeModules?.WMDatabaseBridge
  ) {
    return new LokiJSAdapter({
      schema: mySchema,
      migrations,
      useWebWorker: false,
      useIncrementalIndexedDB: false,
    });
  }

  // Use SQLite for native iOS and Android builds with WatermelonDB native bridge
  return new SQLiteAdapter({
    schema: mySchema,
    migrations,
    jsi: false,
    onSetUpError: (error: any) =>
      console.warn('WatermelonDB SQLite setup warning:', error),
  });
};

export const dbAdapter = createAdapter();