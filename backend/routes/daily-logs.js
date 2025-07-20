const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const config = require('../config');
const DailyLog = require('../models/DailyLog');

const router = express.Router();

// Middleware to authenticate user
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Create daily log
router.post('/', authenticateUser, [
  body('mood').notEmpty().withMessage('Mood is required'),
  body('notes').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { mood, notes } = req.body;

    const dailyLog = new DailyLog({
      userId: req.userId,
      mood,
      notes: notes || ''
    });

    await dailyLog.save();

    res.status(201).json({
      message: 'Daily log created successfully',
      log: dailyLog
    });
  } catch (error) {
    console.error('Create daily log error:', error);
    res.status(500).json({ error: 'Failed to create daily log' });
  }
});

// Get all daily logs for user
router.get('/', authenticateUser, async (req, res) => {
  try {
    const { page = 1, limit = 10, mood } = req.query;
    
    const query = { userId: req.userId };
    if (mood) {
      query.mood = mood;
    }

    const logs = await DailyLog.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await DailyLog.countDocuments(query);

    res.json({
      logs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalLogs: count
    });
  } catch (error) {
    console.error('Get daily logs error:', error);
    res.status(500).json({ error: 'Failed to get daily logs' });
  }
});

// Get specific daily log
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const log = await DailyLog.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!log) {
      return res.status(404).json({ error: 'Daily log not found' });
    }

    res.json({ log });
  } catch (error) {
    console.error('Get daily log error:', error);
    res.status(500).json({ error: 'Failed to get daily log' });
  }
});

// Update daily log
router.put('/:id', authenticateUser, [
  body('mood').optional().notEmpty(),
  body('notes').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { mood, notes } = req.body;

    const log = await DailyLog.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { 
        ...(mood && { mood }),
        ...(notes !== undefined && { notes })
      },
      { new: true, runValidators: true }
    );

    if (!log) {
      return res.status(404).json({ error: 'Daily log not found' });
    }

    res.json({
      message: 'Daily log updated successfully',
      log
    });
  } catch (error) {
    console.error('Update daily log error:', error);
    res.status(500).json({ error: 'Failed to update daily log' });
  }
});

// Delete daily log
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const log = await DailyLog.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!log) {
      return res.status(404).json({ error: 'Daily log not found' });
    }

    res.json({ message: 'Daily log deleted successfully' });
  } catch (error) {
    console.error('Delete daily log error:', error);
    res.status(500).json({ error: 'Failed to delete daily log' });
  }
});

// Get mood statistics
router.get('/stats/mood', authenticateUser, async (req, res) => {
  try {
    const stats = await DailyLog.aggregate([
      { $match: { userId: req.userId } },
      { $group: { _id: '$mood', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({ stats });
  } catch (error) {
    console.error('Get mood stats error:', error);
    res.status(500).json({ error: 'Failed to get mood statistics' });
  }
});

module.exports = router; 