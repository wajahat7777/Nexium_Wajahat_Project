const jwt = require('jsonwebtoken')
const { getUser } = require('../lib/supabase')

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  console.log('Auth middleware - token present:', !!token)

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  try {
    // Verify token with Supabase
    const user = await getUser(token)
    if (!user) {
      console.error('Auth middleware - user not found for token')
      return res.status(401).json({ error: 'Invalid token' })
    }
    
    console.log('Auth middleware - user authenticated:', user.id)
    req.user = user
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(403).json({ error: 'Invalid or expired token' })
  }
}

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token) {
    try {
      const user = await getUser(token)
      req.user = user
    } catch (error) {
      // Token is invalid but we continue without user
      req.user = null
    }
  } else {
    req.user = null
  }
  
  next()
}

module.exports = {
  authenticateToken,
  optionalAuth
} 