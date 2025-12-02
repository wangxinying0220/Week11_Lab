import { ObjectId } from 'mongodb';
import { getDB } from '../db.js';

const collection = () => getDB().collection('participants');

// 1. 新增學員
export async function createParticipant(data) {
  const result = await collection().insertOne({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return result.insertedId;
}

// 2. 取得學員列表 (支援分頁)
export async function listParticipants(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  // 同時抓取資料 (items) 與總數 (total)
  const [items, total] = await Promise.all([
    collection().find().sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
    collection().countDocuments()
  ]);
  
  return { items, total };
}

// 3. 更新學員資料
export async function updateParticipant(id, patch) {
  return collection().updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...patch, updatedAt: new Date() } }
  );
}

// 4. 刪除學員
export async function deleteParticipant(id) {
  return collection().deleteOne({ _id: new ObjectId(id) });
}