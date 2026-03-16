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
    name: String,
    email: String,
    phone: String,
    skills: [String]
  }

});

module.exports = mongoose.model("Resume", ResumeSchema);