const express = require('express')
const { 
  createDailyLog, 
  getDailyLogs, 
  getDailyLogById, 
  updateDailyLog, 
  deleteDailyLog 
} = require('../lib/supabase')
const { authenticateToken } = require('../middleware/auth')
const router = express.Router()

// Create a new daily log
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { mood, notes, ai_suggestion } = req.body
    const userId = req.user.id

    if (!mood) {
      return res.status(400).json({ error: 'Mood is required' })
    }

    const logData = {
      user_id: userId,
      mood,
      notes: notes || '',
      ai_suggestion: ai_suggestion || '',
      created_at: new Date().toISOString()
    }

    const newLog = await createDailyLog(logData)
    
    res.status(201).json({ 
      message: 'Daily log created successfully',
      log: newLog 
    })
  } catch (error) {
    console.error('Create daily log error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get all daily logs for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id
    const { limit = 50, page = 1 } = req.query

    const logs = await getDailyLogs(userId, parseInt(limit))
    
    res.json({ 
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: logs.length
      }
    })
  } catch (error) {
    console.error('Get daily logs error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get a specific daily log by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const log = await getDailyLogById(id)
    
    if (!log) {
      return res.status(404).json({ error: 'Daily log not found' })
    }

    // Check if the log belongs to the authenticated user
    if (log.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied' })
    }

    res.json({ log })
  } catch (error) {
    console.error('Get daily log error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update a daily log
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { mood, notes, ai_suggestion } = req.body
    const userId = req.user.id

    // First get the log to check ownership
    const existingLog = await getDailyLogById(id)
    
    if (!existingLog) {
      return res.status(404).json({ error: 'Daily log not found' })
    }

    if (existingLog.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied' })
    }

    const updates = {
      updated_at: new Date().toISOString()
    }

    if (mood !== undefined) updates.mood = mood
    if (notes !== undefined) updates.notes = notes
    if (ai_suggestion !== undefined) updates.ai_suggestion = ai_suggestion

    const updatedLog = await updateDailyLog(id, updates)
    
    res.json({ 
      message: 'Daily log updated successfully',
      log: updatedLog 
    })
  } catch (error) {
    console.error('Update daily log error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete a daily log
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    // First get the log to check ownership
    const existingLog = await getDailyLogById(id)
    
    if (!existingLog) {
      return res.status(404).json({ error: 'Daily log not found' })
    }

    if (existingLog.user_id !== userId) {
      return res.status(403).json({ error: 'Access denied' })
    }

    await deleteDailyLog(id)
    
    res.json({ message: 'Daily log deleted successfully' })
  } catch (error) {
    console.error('Delete daily log error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get daily logs by date range
router.get('/range/:startDate/:endDate', authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.params
    const userId = req.user.id

    const { data, error } = await supabase
      .from('daily_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json({ logs: data })
  } catch (error) {
    console.error('Get logs by date range error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get mood statistics
router.get('/stats/mood', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id
    const { days = 30 } = req.query

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(days))

    const { data, error } = await supabase
      .from('daily_logs')
      .select('mood, created_at')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })

    if (error) throw error

    // Group by mood and count
    const moodStats = data.reduce((acc, log) => {
      acc[log.mood] = (acc[log.mood] || 0) + 1
      return acc
    }, {})

    res.json({ 
      moodStats,
      totalLogs: data.length,
      dateRange: {
        start: startDate.toISOString(),
        end: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Get mood stats error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router 