import express from 'express';
import {
  createParticipant,
  listParticipants,
  updateParticipant,
  deleteParticipant
} from '../repositories/participants.js';

const router = express.Router();

// POST: 新增報名
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ error: '缺少必要欄位' });
    }
    const id = await createParticipant({ name, email, phone });
    res.status(201).json({ id });
  } catch (error) {
    // 捕捉重複 Email 的錯誤 (MongoDB error code 11000)
    if (error.code === 11000) {
      return res.status(409).json({ error: '此 Email 已經報名過了' });
    }
    next(error);
  }
});

// GET: 取得列表 (含分頁)
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const { items, total } = await listParticipants(page, limit);
    
    res.json({ 
      data: items, 
      pagination: { total, page, limit } 
    });
  } catch (error) {
    next(error);
  }
});

// PATCH: 更新
router.patch('/:id', async (req, res, next) => {
  try {
    const result = await updateParticipant(req.params.id, req.body);
    if (!result.matchedCount) {
      return res.status(404).json({ error: '找不到資料' });
    }
    res.json({ updated: result.modifiedCount });
  } catch (error) {
    next(error);
  }
});

// DELETE: 刪除
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await deleteParticipant(req.params.id);
    if (!result.deletedCount) {
      return res.status(404).json({ error: '找不到資料' });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;