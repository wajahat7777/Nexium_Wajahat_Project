import { dbConnect } from '../_db.js';
import User from '../../models/User.js';
import { sendMagicLinkEmail } from '../../utils/emailService.js';
import crypto from 'crypto';

const magicLinkTokens = new Map();

export default async function handler(req, res) {
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

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  magicLinkTokens.set(token, { userId: user._id, email: user.email, expiresAt });

  const magicLink = `${process.env.FRONTEND_URL}/verify-magic-link?token=${token}`;
  const emailSent = await sendMagicLinkEmail(email, magicLink);

  if (emailSent) {
    res.json({ message: 'Magic link sent to your email', success: true });
  } else {
    res.status(500).json({ error: 'Failed to send email. Please try again.', success: false });
  }
}

export { magicLinkTokens }; 