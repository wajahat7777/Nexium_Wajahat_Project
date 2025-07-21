import mongoose from 'mongoose';

const dailyLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood: { type: String, required: true },
  notes: { type: String },
}, { timestamps: true });

export default mongoose.models.DailyLog || mongoose.model('DailyLog', dailyLogSchema); 