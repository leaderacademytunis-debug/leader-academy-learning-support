import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../../drizzle/schema';

let db: any = null;

export async function initializeDatabase() {
  if (db) return db;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const connection = await mysql.createConnection(connectionString);
  db = drizzle(connection, { schema, mode: 'default' });

  console.log('✅ Database connected successfully');
  return db;
}

export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}
