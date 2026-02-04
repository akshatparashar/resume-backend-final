const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  filename: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  fileBuffer: Buffer
});

module.exports = mongoose.model("Resume", ResumeSchema);
