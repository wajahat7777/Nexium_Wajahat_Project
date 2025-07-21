import axios from 'axios';
import { setCorsHeaders } from './_cors.js';

const suggestions = {
  anger: [
    "Take a few deep breaths and try to relax.",
    "Go for a walk or do some physical activity.",
    "Write down what's making you angry and reflect on it."
  ],
  sadness: [
    "Reach out to a friend or loved one.",
    "Listen to your favorite music.",
    "Take some time for self-care."
  ],
  fear: [
    "Talk to someone you trust about your fears.",
    "Practice grounding techniques.",
    "Remind yourself of times you've overcome challenges."
  ],
  joy: [
    "Share your happiness with someone.",
    "Celebrate your achievements.",
    "Keep a gratitude journal."
  ],
  love: [
    "Express your feelings to someone you care about.",
    "Do something kind for yourself or others.",
    "Reflect on positive relationships in your life."
  ]
};

export default async function handler(req, res) {
  if (setCorsHeaders(req, res)) return;
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).end();
    return;
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });

  try {
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    let emotions;
    try {
      const response = await axios.post(n8nWebhookUrl, { text });
      emotions = response.data;
    } catch (err) {
      // Fallback: use internal logic if n8n fails
      const lower = text.toLowerCase();
      let label = 'joy';
      if (lower.includes('angry') || lower.includes('mad')) label = 'anger';
      else if (lower.includes('sad') || lower.includes('down')) label = 'sadness';
      else if (lower.includes('fear') || lower.includes('scared')) label = 'fear';
      else if (lower.includes('love')) label = 'love';
      emotions = [{ label, score: 1 }];
    }
    const topEmotion = emotions.reduce((prev, curr) => (curr.score > prev.score ? curr : prev), emotions[0]);
    const emotionSuggestions = suggestions[topEmotion.label] || ["Take care of yourself!"];
    res.status(200).json({
      detectedEmotion: topEmotion.label,
      score: topEmotion.score,
      suggestions: emotionSuggestions
    });
  } catch (err) {
    res.status(200).json({
      detectedEmotion: 'unknown',
      score: 1,
      suggestions: ["Take care of yourself!"]
    });
  }
} 