import { setCorsHeaders } from './_cors.js';
import { dbConnect } from './_db.js';
import DailyLog from '../models/DailyLog.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export default async function handler(req, res) {
  if (setCorsHeaders(req, res)) return;
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
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
    // Fetch logs for user
    const logs = await DailyLog.find({ user: decoded.userId }).sort({ createdAt: -1 });
    return res.json({ logs });
  }

  if (req.method === 'POST') {
    const { mood, notes } = req.body;
    if (!mood) return res.status(400).json({ error: 'Mood is required' });
    const log = new DailyLog({
      user: decoded.userId,
      mood,
      notes: notes || ''
    });
    await log.save();
    return res.status(201).json({ message: 'Log saved', log });
  }

  res.status(405).json({ error: 'Method not allowed' });
} 