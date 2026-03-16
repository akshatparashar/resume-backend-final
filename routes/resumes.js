const express = require("express");
const multer = require("multer");

const { parseResume, extractResumeData } = require("../utils/resumeParser");
const Resume = require("../models/Resume");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
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

    // Convert buffer to temporary text
    const text = await parseResume(req.file.buffer, req.file.mimetype, true);

    // Extract structured data
    const structuredData = extractResumeData(text);

    // Save resume in database
    const resume = await Resume.create({
      filename: req.file.originalname,
      uploadedAt: new Date(),
      resumeText: text,
      parsedData: structuredData
    });

    res.json({
      success: true,
      resumeId: resume._id,
      data: structuredData
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;