const Resume = require('../models/Resume');
const { parseResume, extractResumeData } = require('../utils/resumeParser');
const { analyzeResume } = require('../utils/resumeAnalyzer');
const path = require('path');
const fs = require('fs').promises;

// @desc    Upload and analyze resume
// @route   POST /api/resumes/upload
// @access  Private
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    const { targetRole, experienceLevel } = req.body;

    // Parse resume
    const parsedContent = await parseResume(req.file.path, req.file.mimetype);

    // Extract structured data
    const extractedData = extractResumeData(parsedContent);

    // Analyze resume
    const analysis = analyzeResume(extractedData, parsedContent, targetRole, experienceLevel);

    // Create resume record
    const resume = await Resume.create({
      user: req.user.id,
      fileName: req.file.originalname,
      fileUrl: req.file.path,
      fileSize: req.file.size,
      parsedContent,
      scores: analysis.scores,
      extractedData,
      analysis: {
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        missingSkills: analysis.missingSkills,
        recommendations: analysis.recommendations,
        keywords: analysis.keywords,
      },
      targetRole,
      experienceLevel,
    });

    res.status(201).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all user resumes
// @route   GET /api/resumes
// @access  Private
exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single resume
// @route   GET /api/resumes/:id
// @access  Private
exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    // Make sure user owns resume
    if (resume.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this resume',
      });
    }

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
// @access  Private
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    // Make sure user owns resume
    if (resume.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this resume',
      });
    }

    // Delete file from filesystem
    try {
      await fs.unlink(resume.fileUrl);
    } catch (err) {
      console.error('Error deleting file:', err);
    }

    await resume.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get latest resume
// @route   GET /api/resumes/latest
// @access  Private
exports.getLatestResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user.id }).sort('-createdAt');

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'No resume found',
      });
    }

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
