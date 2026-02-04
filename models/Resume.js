const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  parsedContent: {
    type: String,
  },

  // Analysis Results
  scores: {
    resumeScore: {
      type: Number,
      default: 0,
    },
    atsScore: {
      type: Number,
      default: 0,
    },
    skillMatch: {
      type: Number,
      default: 0,
    },
  },

  // Extracted Information
  extractedData: {
    name: String,
    email: String,
    phone: String,
    skills: [String],
    experience: [{
      title: String,
      company: String,
      duration: String,
      description: String,
    }],
    education: [{
      degree: String,
      institution: String,
      year: String,
    }],
    certifications: [String],
  },

  // Analysis Details
  analysis: {
    strengths: [String],
    weaknesses: [String],
    missingSkills: [String],
    recommendations: [String],
    keywords: [String],
  },

  targetRole: {
    type: String,
  },

  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'lead'],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
resumeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Resume', resumeSchema);
