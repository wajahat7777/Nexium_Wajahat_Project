import { dbConnect } from '../_db.js';
import User from '../../models/User.js';
import jwt from 'jsonwebtoken';
import { config } from '../../config.js';
import { magicLinkTokens } from './send-magic-link.js';
import MagicLinkToken from '../../models/MagicLinkToken.js';

export default async function handler(req, res) {
  const allowedOrigins = [
    'https://mental-health-project-delta.vercel.app',
    'https://mental-health-project-hgsnro2cg-wajahat-ullah-khans-projects.vercel.app',
    'https://mental-health-project-git-main-wajahat-ullah-khans-projects.vercel.app'
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

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  await dbConnect();
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token is required' });

  console.log('Token received:', token);
  const tokenData = await MagicLinkToken.findOne({ token });
  console.log('Token data from DB:', tokenData);
  if (!tokenData) return res.status(400).json({ error: 'Invalid or expired token' });
  if (new Date() > tokenData.expiresAt) {
    await MagicLinkToken.deleteOne({ token });
    return res.status(400).json({ error: 'Token has expired' });
  }

  const user = await User.findById(tokenData.userId);
  if (!user) return res.status(400).json({ error: 'User not found' });

  const jwtToken = jwt.sign(
    { userId: user._id, email: user.email },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  await MagicLinkToken.deleteOne({ token });

  res.json({
    message: 'Login successful',
    token: jwtToken,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    }
  });
} 