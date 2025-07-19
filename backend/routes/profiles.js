const express = require('express')
const { 
  getUserProfile, 
  updateUserProfile, 
  createUserProfile 
} = require('../lib/supabase')
const { authenticateToken } = require('../middleware/auth')
const router = express.Router()

// Get user profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id

    const profile = await getUserProfile(userId)
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' })
    }

    res.json({ profile })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Create or update user profile
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id
    const { 
      first_name, 
      last_name, 
      bio, 
      avatar_url, 
      preferences,
      timezone 
    } = req.body

    const profileData = {
      id: userId,
      first_name: first_name || '',
      last_name: last_name || '',
      bio: bio || '',
      avatar_url: avatar_url || '',
      preferences: preferences || {},
      timezone: timezone || 'UTC',
      updated_at: new Date().toISOString()
    }

    // Try to get existing profile
    let existingProfile
    try {
      existingProfile = await getUserProfile(userId)
    } catch (error) {
      // Profile doesn't exist, create new one
      existingProfile = null
    }

    let result
    if (existingProfile) {
      // Update existing profile
      result = await updateUserProfile(userId, profileData)
    } else {
      // Create new profile
      profileData.created_at = new Date().toISOString()
      result = await createUserProfile(profileData)
    }

    res.json({ 
      message: existingProfile ? 'Profile updated successfully' : 'Profile created successfully',
      profile: result 
    })
  } catch (error) {
    console.error('Create/update profile error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update user profile
router.put('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id
    const { 
      first_name, 
      last_name, 
      bio, 
      avatar_url, 
      preferences,
      timezone 
    } = req.body

    const updates = {
      updated_at: new Date().toISOString()
    }

    if (first_name !== undefined) updates.first_name = first_name
    if (last_name !== undefined) updates.last_name = last_name
    if (bio !== undefined) updates.bio = bio
    if (avatar_url !== undefined) updates.avatar_url = avatar_url
    if (preferences !== undefined) updates.preferences = preferences
    if (timezone !== undefined) updates.timezone = timezone

    const updatedProfile = await updateUserProfile(userId, updates)
    
    res.json({ 
      message: 'Profile updated successfully',
      profile: updatedProfile 
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update profile preferences
router.patch('/preferences', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id
    const { preferences } = req.body

    if (!preferences || typeof preferences !== 'object') {
      return res.status(400).json({ error: 'Preferences object is required' })
    }

    const updates = {
      preferences,
      updated_at: new Date().toISOString()
    }

    const updatedProfile = await updateUserProfile(userId, updates)
    
    res.json({ 
      message: 'Preferences updated successfully',
      profile: updatedProfile 
    })
  } catch (error) {
    console.error('Update preferences error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get user statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id

    // Get total logs count
    const { data: logs, error: logsError } = await supabase
      .from('daily_logs')
      .select('id')
      .eq('user_id', userId)

    if (logsError) throw logsError

    // Get streak information
    const { data: recentLogs, error: streakError } = await supabase
      .from('daily_logs')
      .select('created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30)

    if (streakError) throw streakError

    // Calculate current streak
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0

    if (recentLogs.length > 0) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      let currentDate = new Date(today)
      
      for (let i = 0; i < recentLogs.length; i++) {
        const logDate = new Date(recentLogs[i].created_at)
        logDate.setHours(0, 0, 0, 0)

        if (logDate.getTime() === currentDate.getTime()) {
          tempStreak++
          currentStreak = Math.max(currentStreak, tempStreak)
        } else if (logDate.getTime() === yesterday.getTime() && currentStreak === 0) {
          // Check if there's a log from yesterday to continue streak
          tempStreak = 1
          currentStreak = 1
        } else {
          longestStreak = Math.max(longestStreak, tempStreak)
          tempStreak = 0
        }

        currentDate.setDate(currentDate.getDate() - 1)
      }
    }

    res.json({
      stats: {
        totalLogs: logs.length,
        currentStreak,
        longestStreak: Math.max(longestStreak, currentStreak),
        averageMood: calculateAverageMood(recentLogs)
      }
    })
  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Helper function to calculate average mood
function calculateAverageMood(logs) {
  if (logs.length === 0) return null

  const moodValues = {
    'Happy': 5,
    'Good': 4,
    'Okay': 3,
    'Sad': 2,
    'Terrible': 1
  }

  const total = logs.reduce((sum, log) => {
    return sum + (moodValues[log.mood] || 3)
  }, 0)

  return (total / logs.length).toFixed(1)
}

module.exports = router 