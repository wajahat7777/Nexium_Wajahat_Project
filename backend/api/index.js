import { setCorsHeaders } from './_cors.js';

export default function handler(req, res) {
  if (setCorsHeaders(req, res)) return;
  res.status(200).json({
    message: 'Mental Health Tracker backend is running!',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
} 