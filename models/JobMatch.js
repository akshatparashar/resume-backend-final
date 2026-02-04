const mongoose = require('mongoose');

const jobMatchSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
  },
  company: {
    type: String,
  },

  // Match Scores
  matchScores: {
    overall: {
      type: Number,
      default: 0,
    },
    skills: {
      type: Number,
      default: 0,
    },
    experience: {
      type: Number,
      default: 0,
    },
    keywords: {
      type: Number,
      default: 0,
    },
  },

  // Match Analysis
  matchedSkills: [String],
  missingSkills: [String],
  matchedKeywords: [{
    keyword: String,
    count: Number,
  }],
  missingKeywords: [String],

  recommendations: [String],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('JobMatch', jobMatchSchema);
