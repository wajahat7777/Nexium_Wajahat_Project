import { dbConnect } from '../_db.js';
import User from '../../models/User.js';
import jwt from 'jsonwebtoken';
import { config } from '../../config.js';

export default async function handler(req, res) {
  const allowedOrigins = [
    'https://mental-health-project-delta.vercel.app',
    'https://mental-health-project-hgsnro2cg-wajahat-ullah-khans-projects.vercel.app'
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  await dbConnect();
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return res.status(401).json({ error: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
} 