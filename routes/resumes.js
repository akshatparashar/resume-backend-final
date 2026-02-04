const express = require("express");
const multer = require("multer");
const path = require("path");
const Resume = require("../models/Resume");

const router = express.Router();

// Storage
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});




// Upload resume
router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });}
    const resume = await Resume.create({
      filename: req.file.originalname,
      uploadedAt: new Date(),
      fileBuffer: req.file.buffer
    });
    

    res.json({
      success: true,
      resumeId: resume._id,
      file: resume
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
