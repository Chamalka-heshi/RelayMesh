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