import { setCorsHeaders } from '../../../_cors.js';
import { dbConnect } from '../../../_db.js';
import DailyLog from '../../../models/DailyLog.js';
import jwt from 'jsonwebtoken';
import { config } from '../../../config.js';

export default async function handler(req, res) {
  if (setCorsHeaders(req, res)) return;
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).end();
    return;
  }
  await dbConnect();
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });

  let decoded;
  try {
    decoded = jwt.verify(token, config.jwt.secret);
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (req.method === 'GET') {
    try {
      const stats = await DailyLog.aggregate([
        { $match: { user: decoded.userId } },
        { $group: { _id: "$mood", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
      return res.json({ stats });
    } catch (err) {
      console.error('Stats aggregation error:', err);
      return res.status(500).json({ error: 'Failed to aggregate mood stats', details: err.message });
    }
  }

  res.status(405).json({ error: 'Method not allowed' });
} 