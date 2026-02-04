const JobMatch = require('../models/JobMatch');
const Resume = require('../models/Resume');
const { matchJobDescription } = require('../utils/jobMatcher');

// @desc    Match resume with job description
// @route   POST /api/job-match
// @access  Private
exports.matchJob = async (req, res) => {
  try {
    const { resumeId, jobDescription, jobTitle, company } = req.body;

    if (!jobDescription) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a job description',
      });
    }

    // Get resume
    let resume;
    if (resumeId) {
      resume = await Resume.findById(resumeId);

      if (!resume) {
        return res.status(404).json({
          success: false,
          message: 'Resume not found',
        });
      }

      // Check ownership
      if (resume.user.toString() !== req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized',
        });
      }
    } else {
      // Get latest resume
      resume = await Resume.findOne({ user: req.user.id }).sort('-createdAt');

      if (!resume) {
        return res.status(404).json({
          success: false,
          message: 'Please upload a resume first',
        });
      }
    }

    // Perform matching
    const matchResult = matchJobDescription(resume, jobDescription);

    // Save match result
    const jobMatch = await JobMatch.create({
      user: req.user.id,
      resume: resume._id,
      jobDescription,
      jobTitle: jobTitle || 'Untitled Job',
      company: company || '',
      matchScores: matchResult.matchScores,
      matchedSkills: matchResult.matchedSkills,
      missingSkills: matchResult.missingSkills,
      matchedKeywords: matchResult.matchedKeywords,
      missingKeywords: matchResult.missingKeywords,
      recommendations: matchResult.recommendations,
    });

    res.status(201).json({
      success: true,
      jobMatch,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all job matches for user
// @route   GET /api/job-match
// @access  Private
exports.getJobMatches = async (req, res) => {
  try {
    const jobMatches = await JobMatch.find({ user: req.user.id })
      .populate('resume', 'fileName createdAt')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: jobMatches.length,
      jobMatches,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single job match
// @route   GET /api/job-match/:id
// @access  Private
exports.getJobMatch = async (req, res) => {
  try {
    const jobMatch = await JobMatch.findById(req.params.id)
      .populate('resume', 'fileName createdAt');

    if (!jobMatch) {
      return res.status(404).json({
        success: false,
        message: 'Job match not found',
      });
    }

    // Check ownership
    if (jobMatch.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    res.status(200).json({
      success: true,
      jobMatch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete job match
// @route   DELETE /api/job-match/:id
// @access  Private
exports.deleteJobMatch = async (req, res) => {
  try {
    const jobMatch = await JobMatch.findById(req.params.id);

    if (!jobMatch) {
      return res.status(404).json({
        success: false,
        message: 'Job match not found',
      });
    }

    // Check ownership
    if (jobMatch.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    await jobMatch.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job match deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
