import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import { mySchema } from './schema';
import { migrations } from './migrations';

const createAdapter = () => {
  if (process.env.NODE_ENV === 'test' || typeof jest !== 'undefined') {
    return new LokiJSAdapter({
      schema: mySchema,
      migrations,
      useWebWorker: false,
      useIncrementalIndexedDB: false,
    });
  }
  return new SQLiteAdapter({
    schema: mySchema,
    migrations,
    jsi: false,
    onSetUpError: (error: any) => console.error('WatermelonDB setup error:', error),
  });
};

export const dbAdapter = createAdapter();