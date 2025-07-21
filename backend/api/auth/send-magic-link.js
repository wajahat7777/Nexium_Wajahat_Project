import { dbConnect } from '../_db.js';
import User from '../../models/User.js';
import jwt from 'jsonwebtoken';
import { config } from '../../config.js';
import { sendMagicLinkEmail } from '../../utils/emailService.js';
import crypto from 'crypto';

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
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  let user = await User.findOne({ email });
  if (!user) {
    user = new User({
      email,
      firstName: email.split('@')[0],
      lastName: '',
      authMethod: 'magic_link'
    });
    await user.save();
  }

  // Generate JWT token for magic link
  const jwtToken = jwt.sign(
    {
      userId: user._id,
      email: user.email
    },
    config.jwt.secret,
    { expiresIn: '15m' }
  );

  const frontendUrl = process.env.FRONTEND_URL || 'https://mental-health-project-delta.vercel.app';
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
  const magicLink = `${frontendUrl}/verify-magic-link?token=${jwtToken}`;
  const emailSent = await sendMagicLinkEmail(email, magicLink);

  if (emailSent) {
    res.json({ message: 'Magic link sent to your email', success: true });
  } else {
    res.status(500).json({ error: 'Failed to send email. Please try again.', success: false });
  }
} 