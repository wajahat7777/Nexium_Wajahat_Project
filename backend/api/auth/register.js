import { dbConnect } from '../_db.js';
import User from '../../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../../config.js';

export default async function handler(req, res) {
  // CORS headers
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://mental-health-project-delta.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).end();
    return;
  }
  res.setHeader('Access-Control-Allow-Origin', 'https://mental-health-project-delta.vercel.app');

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  await dbConnect();
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ error: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = new User({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    authMethod: 'password'
  });

  await user.save();

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );

  res.status(201).json({
    message: 'User created successfully',
    token,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    }
  });
} 