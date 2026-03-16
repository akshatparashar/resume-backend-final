const { matchJobDescription } = require("../utils/jobMatcher");
const jobDescriptions = require("../data/jobDescriptions");
const { analyzeResume } = require("../services/aiAnalyzer");
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
router.get("/analyze/:id", async (req, res) => {
  try {

    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ success:false, message:"Resume not found" });
    }

    const aiResult = await analyzeResume(resume.resumeText);
    res.json({
      success:true,
      resumeId:resume._id,
      analysis:aiResult
    });

  } catch (error) {
    res.status(500).json({
      success:false,
      error:error.message
    });
  }
});
router.post("/match-role/:id", async (req, res) => {
  try {

    const { role } = req.body;

    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found"
      });
    }

    const jobDescription = jobDescriptions[role];

    if (!jobDescription) {
      return res.status(400).json({
        success: false,
        message: "Invalid role"
      });
    }

    // Convert DB structure to matcher structure
    const resumeData = {
      parsedContent: resume.resumeText || "",
      extractedData: {
        skills: resume.parsedData?.skills || []
      }
    };

    const matchResult = await matchJobDescription(resumeData, jobDescription);

    res.json({
      success: true,
      role,
      match: matchResult
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
});
module.exports = router;