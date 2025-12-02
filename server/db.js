import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
let db;

export async function connectDB() {
  if (db) return db;
  try {
    await client.connect();
    db = client.db();
    console.log('✅ [DB] 成功連線到 MongoDB');
    return db;
  } catch (err) {
    console.error('❌ [DB] 連線失敗', err);
    process.exit(1);
  }
}

export function getDB() {
  if (!db) throw new Error('Database not initialized');
  return db;
}