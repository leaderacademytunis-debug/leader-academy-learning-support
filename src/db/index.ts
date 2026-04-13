import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../../drizzle/schema';
import path from 'path';

let db: any = null;

export async function initializeDatabase() {
  if (db) return db;

  try {
    const dbPath = path.join(process.cwd(), 'data', 'courses.db');
    const sqlite = new Database(dbPath);
    db = drizzle(sqlite, { schema, mode: 'default' });
    console.log('✅ SQLite Database connected successfully at', dbPath);
    return db;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}


