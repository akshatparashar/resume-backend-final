const express = require("express");
const multer = require("multer");
const Resume = require("../models/Resume");

const router = express.Router();

// Vercel-safe memory storage
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Upload resume
router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const resume = await Resume.create({
      filename: req.file.originalname,
      fileBuffer: req.file.buffer
    });

    res.json({
      success: true,
      resumeId: resume._id
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Upload failed"
    });
  }
});

module.exports = router;
