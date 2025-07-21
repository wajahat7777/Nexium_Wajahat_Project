export default function handler(req, res) {
  res.status(200).json({
    message: 'Mental Health Tracker backend is running!',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
} 