const { body, validationResult } = require('express-validator')

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors.array() 
    })
  }
  next()
}

// Auth validation rules
const signupValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  validate
]

// Magic link signup validation (no password required)
const magicLinkSignupValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('first_name')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  body('last_name')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  validate
]

const signinValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate
]

const magicLinkValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  validate
]

// Daily log validation rules
const createLogValidation = [
  body('mood')
    .isIn(['Happy', 'Good', 'Okay', 'Sad', 'Terrible'])
    .withMessage('Mood must be one of: Happy, Good, Okay, Sad, Terrible'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes must be less than 1000 characters'),
  validate
]

const updateLogValidation = [
  body('mood')
    .optional()
    .isIn(['Happy', 'Good', 'Okay', 'Sad', 'Terrible'])
    .withMessage('Mood must be one of: Happy, Good, Okay, Sad, Terrible'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes must be less than 1000 characters'),
  body('ai_suggestion')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('AI suggestion must be less than 2000 characters'),
  validate
]

// Profile validation rules
const profileValidation = [
  body('first_name')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  body('last_name')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio must be less than 500 characters'),
  body('avatar_url')
    .optional()
    .isURL()
    .withMessage('Avatar URL must be a valid URL'),
  body('timezone')
    .optional()
    .isIn(['UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris', 'Asia/Tokyo', 'Australia/Sydney'])
    .withMessage('Invalid timezone'),
  validate
]

// AI validation rules
const aiSuggestionValidation = [
  body('mood')
    .optional()
    .isIn(['Happy', 'Good', 'Okay', 'Sad', 'Terrible'])
    .withMessage('Mood must be one of: Happy, Good, Okay, Sad, Terrible'),
  body('notes')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Notes must be less than 1000 characters'),
  validate
]

// Query parameter validation
const validatePagination = (req, res, next) => {
  const { page, limit } = req.query
  
  if (page && (!Number.isInteger(parseInt(page)) || parseInt(page) < 1)) {
    return res.status(400).json({ error: 'Page must be a positive integer' })
  }
  
  if (limit && (!Number.isInteger(parseInt(limit)) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
    return res.status(400).json({ error: 'Limit must be between 1 and 100' })
  }
  
  next()
}

const validateDateRange = (req, res, next) => {
  const { startDate, endDate } = req.params
  
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  if (isNaN(start.getTime())) {
    return res.status(400).json({ error: 'Invalid start date format' })
  }
  
  if (isNaN(end.getTime())) {
    return res.status(400).json({ error: 'Invalid end date format' })
  }
  
  if (start > end) {
    return res.status(400).json({ error: 'Start date must be before end date' })
  }
  
  next()
}

// UUID validation
const validateUUID = (req, res, next) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  
  if (req.params.id && !uuidRegex.test(req.params.id)) {
    return res.status(400).json({ error: 'Invalid UUID format' })
  }
  
  next()
}

// Custom validation functions
const isValidMood = (mood) => {
  const validMoods = ['Happy', 'Good', 'Okay', 'Sad', 'Terrible']
  return validMoods.includes(mood)
}

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000) // Limit length
}

module.exports = {
  validate,
  signupValidation,
  magicLinkSignupValidation,
  signinValidation,
  magicLinkValidation,
  createLogValidation,
  updateLogValidation,
  profileValidation,
  aiSuggestionValidation,
  validatePagination,
  validateDateRange,
  validateUUID,
  isValidMood,
  isValidEmail,
  sanitizeInput
} 