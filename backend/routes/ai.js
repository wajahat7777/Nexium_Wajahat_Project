const express = require('express')
const { authenticateToken } = require('../middleware/auth')
const router = express.Router()

// Webhook endpoint for n8n integration
router.post('/webhook', async (req, res) => {
  try {
    const { mood, notes, user_id, auth_token } = req.body

    if (!mood || !user_id) {
      return res.status(400).json({ error: 'Mood and user_id are required' })
    }

    // Store the request for processing
    const webhookData = {
      mood,
      notes: notes || '',
      user_id,
      auth_token,
      timestamp: new Date().toISOString(),
      status: 'pending'
    }

    // Here you would typically store this in a queue or database
    // For now, we'll process it immediately
    const suggestion = generateAISuggestion(mood, notes)
    
    // Create daily log with AI suggestion
    const logData = {
      user_id,
      mood,
      notes: notes || '',
      ai_suggestion: suggestion,
      created_at: new Date().toISOString()
    }

    // You would typically save this to your database
    // For now, we'll just return the response
    res.json({ 
      success: true,
      suggestion,
      logData
    })
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get AI suggestion based on mood and notes
router.post('/suggestion', authenticateToken, async (req, res) => {
  try {
    const { mood, notes } = req.body
    const userId = req.user.id

    if (!mood && !notes) {
      return res.status(400).json({ error: 'Mood or notes are required' })
    }

    // Simple AI suggestion logic (you can replace this with actual AI service)
    const suggestion = generateAISuggestion(mood, notes)
    
    res.json({ 
      suggestion,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('AI suggestion error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get AI suggestion from external service (n8n/Hugging Face)
router.post('/external-suggestion', authenticateToken, async (req, res) => {
  try {
    const { mood, notes } = req.body
    const userId = req.user.id

    if (!mood && !notes) {
      return res.status(400).json({ error: 'Mood or notes are required' })
    }

    // Call external AI service (n8n webhook)
    const n8nResponse = await fetch(process.env.N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mood,
        notes,
        user_id: userId,
        auth_token: req.headers.authorization?.split(' ')[1]
      })
    })

    if (!n8nResponse.ok) {
      throw new Error('External AI service failed')
    }

    const result = await n8nResponse.json()
    
    res.json({ 
      suggestion: result.suggestion,
      timestamp: new Date().toISOString(),
      source: 'external'
    })
  } catch (error) {
    console.error('External AI suggestion error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get AI insights based on user's mood history
router.get('/insights', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id
    const { days = 30 } = req.query

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(days))

    const { data: logs, error } = await supabase
      .from('daily_logs')
      .select('mood, notes, created_at')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })

    if (error) throw error

    const insights = generateInsights(logs)
    
    res.json({ 
      insights,
      period: `${days} days`,
      totalLogs: logs.length
    })
  } catch (error) {
    console.error('AI insights error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Generate mood trend analysis
router.get('/trends', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id
    const { period = 'week' } = req.query

    let days
    switch (period) {
      case 'week':
        days = 7
        break
      case 'month':
        days = 30
        break
      case 'quarter':
        days = 90
        break
      default:
        days = 30
    }

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data: logs, error } = await supabase
      .from('daily_logs')
      .select('mood, created_at')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true })

    if (error) throw error

    const trends = analyzeMoodTrends(logs, period)
    
    res.json({ 
      trends,
      period,
      totalLogs: logs.length
    })
  } catch (error) {
    console.error('AI trends error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Helper function to generate AI suggestions
function generateAISuggestion(mood, notes) {
  const moodSuggestions = {
    'Happy': [
      "Great to see you're feeling happy! Consider journaling about what made your day special.",
      "Your positive energy is contagious! Maybe share your good mood with someone today.",
      "Happiness is a choice you're making. Keep up the great attitude!"
    ],
    'Good': [
      "You're in a good place today. What's contributing to this positive feeling?",
      "Good moods are worth celebrating. Consider doing something you enjoy.",
      "Your good mood might inspire others. Spread some positivity!"
    ],
    'Okay': [
      "It's okay to feel okay. Sometimes stability is underrated.",
      "Consider what might help you feel even better today.",
      "An okay day can become great with a small positive action."
    ],
    'Sad': [
      "It's okay to feel sad. Remember that emotions are temporary.",
      "Consider reaching out to a friend or doing something that usually helps.",
      "Sadness is valid. Be gentle with yourself today."
    ],
    'Terrible': [
      "I'm sorry you're having a tough time. Remember that this feeling won't last forever.",
      "Consider talking to someone you trust about how you're feeling.",
      "It's okay to ask for help when you're struggling."
    ]
  }

  const defaultSuggestions = [
    "Take a moment to breathe deeply and center yourself.",
    "Consider what you're grateful for today, no matter how small.",
    "Remember that every day is a new opportunity for growth."
  ]

  let suggestions = moodSuggestions[mood] || defaultSuggestions
  
  // Add context-specific suggestions based on notes
  if (notes && notes.length > 0) {
    const noteLower = notes.toLowerCase()
    
    if (noteLower.includes('work') || noteLower.includes('job')) {
      suggestions.push("Work stress is common. Consider setting boundaries and taking breaks.")
    }
    
    if (noteLower.includes('family') || noteLower.includes('friend')) {
      suggestions.push("Relationships can be complex. Open communication often helps.")
    }
    
    if (noteLower.includes('sleep') || noteLower.includes('tired')) {
      suggestions.push("Quality sleep is crucial for mental health. Consider your sleep routine.")
    }
  }

  // Return a random suggestion
  return suggestions[Math.floor(Math.random() * suggestions.length)]
}

// Helper function to generate insights
function generateInsights(logs) {
  if (logs.length === 0) {
    return {
      message: "No logs found for analysis. Start logging to get insights!",
      patterns: [],
      recommendations: []
    }
  }

  const moodCounts = logs.reduce((acc, log) => {
    acc[log.mood] = (acc[log.mood] || 0) + 1
    return acc
  }, {})

  const totalLogs = logs.length
  const dominantMood = Object.keys(moodCounts).reduce((a, b) => 
    moodCounts[a] > moodCounts[b] ? a : b
  )

  const insights = {
    dominantMood,
    moodDistribution: moodCounts,
    totalLogs,
    patterns: [],
    recommendations: []
  }

  // Analyze patterns
  if (moodCounts['Sad'] > moodCounts['Happy'] + moodCounts['Good']) {
    insights.patterns.push("You've been experiencing more challenging emotions lately.")
    insights.recommendations.push("Consider talking to a mental health professional.")
  }

  if (moodCounts['Happy'] > totalLogs * 0.6) {
    insights.patterns.push("You've been consistently positive!")
    insights.recommendations.push("Share your positive energy with others.")
  }

  if (totalLogs < 7) {
    insights.patterns.push("You're just getting started with mood tracking.")
    insights.recommendations.push("Try to log your mood daily for better insights.")
  }

  return insights
}

// Helper function to analyze mood trends
function analyzeMoodTrends(logs, period) {
  if (logs.length === 0) {
    return {
      trend: 'insufficient_data',
      message: 'Not enough data to analyze trends'
    }
  }

  const moodValues = {
    'Happy': 5,
    'Good': 4,
    'Okay': 3,
    'Sad': 2,
    'Terrible': 1
  }

  const recentLogs = logs.slice(-Math.min(logs.length, 7))
  const olderLogs = logs.slice(0, Math.max(0, logs.length - 7))

  const recentAverage = recentLogs.reduce((sum, log) => 
    sum + (moodValues[log.mood] || 3), 0
  ) / recentLogs.length

  const olderAverage = olderLogs.length > 0 ? 
    olderLogs.reduce((sum, log) => 
      sum + (moodValues[log.mood] || 3), 0
    ) / olderLogs.length : recentAverage

  const trend = recentAverage > olderAverage ? 'improving' : 
                recentAverage < olderAverage ? 'declining' : 'stable'

  return {
    trend,
    recentAverage: recentAverage.toFixed(1),
    olderAverage: olderAverage.toFixed(1),
    change: (recentAverage - olderAverage).toFixed(1)
  }
}

module.exports = router 