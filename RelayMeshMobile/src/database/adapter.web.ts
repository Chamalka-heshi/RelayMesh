import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import { mySchema } from './schema';

export const dbAdapter = new LokiJSAdapter({
  schema: mySchema, // Point to the correct variable name here
  useWebWorker: false,
  useIncrementalIndexedDB: true,
});