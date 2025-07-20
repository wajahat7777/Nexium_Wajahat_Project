const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: String,
    required: true,
    enum: ['Happy', 'Good', 'Okay', 'Sad', 'Terrible'],
    trim: true
  },
  notes: {
    type: String,
    default: '',
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  activities: [{
    type: String,
    trim: true
  }],
  sleepHours: {
    type: Number,
    min: 0,
    max: 24
  },
  exerciseMinutes: {
    type: Number,
    min: 0
  },
  stressLevel: {
    type: Number,
    min: 1,
    max: 10
  },
  energyLevel: {
    type: Number,
    min: 1,
    max: 10
  }
}, {
  timestamps: true
});

// Indexes for better query performance
dailyLogSchema.index({ userId: 1, createdAt: -1 });
dailyLogSchema.index({ userId: 1, mood: 1 });
dailyLogSchema.index({ createdAt: -1 });

// Virtual for formatted date
dailyLogSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString();
});

// Virtual for time of day
dailyLogSchema.virtual('timeOfDay').get(function() {
  const hour = this.createdAt.getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  if (hour < 21) return 'evening';
  return 'night';
});

// Method to get mood emoji
dailyLogSchema.methods.getMoodEmoji = function() {
  const moodEmojis = {
    'Happy': '😊',
    'Good': '🙂',
    'Okay': '😐',
    'Sad': '😔',
    'Terrible': '😖'
  };
  return moodEmojis[this.mood] || '😐';
};

// Method to get summary
dailyLogSchema.methods.getSummary = function() {
  return {
    id: this._id,
    mood: this.mood,
    moodEmoji: this.getMoodEmoji(),
    notes: this.notes,
    date: this.formattedDate,
    timeOfDay: this.timeOfDay,
    createdAt: this.createdAt
  };
};

// Static method to get user's mood trends
dailyLogSchema.statics.getMoodTrends = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        mood: { $first: "$mood" },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
};

// Static method to get mood statistics
dailyLogSchema.statics.getMoodStats = async function(userId) {
  return this.aggregate([
    {
      $match: { userId: mongoose.Types.ObjectId(userId) }
    },
    {
      $group: {
        _id: "$mood",
        count: { $sum: 1 },
        percentage: { $avg: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

module.exports = mongoose.model('DailyLog', dailyLogSchema); 