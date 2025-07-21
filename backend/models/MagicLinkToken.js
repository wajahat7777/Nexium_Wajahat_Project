import mongoose from 'mongoose';

const magicLinkTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true },
  expiresAt: { type: Date, required: true }
});

export default mongoose.models.MagicLinkToken || mongoose.model('MagicLinkToken', magicLinkTokenSchema); 