import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { mySchema } from './schema'; 

export const dbAdapter = new SQLiteAdapter({
  schema: mySchema, // Point to the correct variable name here
  jsi: false, 
  onSetUpError: (error) => console.error("WatermelonDB setup error:", error)
});