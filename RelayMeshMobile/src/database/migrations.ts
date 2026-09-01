import { schemaMigrations, createTable } from '@nozbe/watermelondb/Schema/migrations';

export const migrations = schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        createTable({
          name: 'resources',
          columns: [
            { name: 'name', type: 'string' },
            { name: 'title', type: 'string' },
            { name: 'category', type: 'string', isIndexed: true },
            { name: 'description', type: 'string', isOptional: true },
            { name: 'latitude', type: 'number' },
            { name: 'longitude', type: 'number' },
            { name: 'capacity', type: 'number' },
            { name: 'available_capacity', type: 'number' },
            { name: 'status', type: 'string', isIndexed: true },
            { name: 'amenities', type: 'string', isOptional: true },
            { name: 'contact_info', type: 'string', isOptional: true },
            { name: 'verified_at', type: 'number', isOptional: true },
            { name: 'last_synced_at', type: 'number', isOptional: true },
            { name: 'created_at', type: 'number' },
            { name: 'updated_at', type: 'number' },
          ],
        }),
        createTable({
          name: 'user_profiles',
          columns: [
            { name: 'device_id', type: 'string', isIndexed: true },
            { name: 'name', type: 'string' },
            { name: 'email', type: 'string', isOptional: true },
            { name: 'role', type: 'string', isIndexed: true },
            { name: 'public_key', type: 'string' },
            { name: 'created_at', type: 'number' },
            { name: 'updated_at', type: 'number' },
          ],
        }),
      ],
    },
  ],
});
