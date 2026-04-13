import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../../drizzle/schema';
import path from 'path';
import fs from 'fs';

let db: any = null;

export async function initializeDatabase() {
  if (db) return db;

  try {
    const dataDir = path.join(process.cwd(), 'data');
    
    // Create data directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const dbPath = path.join(dataDir, 'courses.db');
    const sqlite = new Database(dbPath);
    
    // Enable foreign keys
    sqlite.pragma('journal_mode = WAL');
    
    db = drizzle(sqlite as any, { schema, mode: 'default' });
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
