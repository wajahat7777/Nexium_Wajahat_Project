import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  authMethod: { type: String, enum: ['password', 'magic_link'], default: 'password' },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema); 