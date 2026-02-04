const express = require("express");
const multer = require("multer");
const path = require("path");
const Resume = require("../models/Resume");

const router = express.Router();

// Storage
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Upload resume
router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    const resume = await Resume.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      uploadedAt: new Date()
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
