const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({

  filename: {
    type: String,
    required: true
  },

  uploadedAt: {
    type: Date,
    default: Date.now
  },

  resumeText: {
    type: String
  },

  parsedData: {
    type: Object
  }

}, { strict: false });

module.exports = mongoose.model("Resume", ResumeSchema);