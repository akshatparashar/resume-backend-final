const express = require('express');
const {
  getStatus,
  generateCareerPath,
  generateSuggestions,
  analyzeSection,
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/status', getStatus);
router.post('/career-path', protect, generateCareerPath);
router.post('/suggestions', protect, generateSuggestions);
router.post('/analyze-section', protect, analyzeSection);

module.exports = router;
