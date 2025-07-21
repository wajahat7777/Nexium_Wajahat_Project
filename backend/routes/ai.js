const express = require('express');
const router = express.Router();
const axios = require('axios');

// Suggestions for each emotion
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

// POST /api/analyze-mood
router.post('/analyze-mood', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });

  try {
    // Call your n8n webhook (replace with your actual n8n webhook URL)
    const n8nWebhookUrl = 'http://localhost:5678/webhook/your-webhook-id'; // TODO: Update this URL
    let emotions;
    try {
      const response = await axios.post(n8nWebhookUrl, { text });
      emotions = response.data;
    } catch (err) {
      // Fallback: use internal logic if n8n fails
      // Simple keyword-based fallback (customize as needed)
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
    res.json({
      detectedEmotion: topEmotion.label,
      score: topEmotion.score,
      suggestions: emotionSuggestions
    });
  } catch (err) {
    console.error(err);
    // Final fallback: always return a generic suggestion
    res.json({
      detectedEmotion: 'unknown',
      score: 1,
      suggestions: ["Take care of yourself!"]
    });
  }
});

module.exports = router; 