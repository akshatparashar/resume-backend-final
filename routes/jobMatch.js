const express = require('express');
const {
  matchJob,
  getJobMatches,
  getJobMatch,
  deleteJobMatch,
} = require('../controllers/jobMatchController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, matchJob);
router.get('/', protect, getJobMatches);
router.get('/:id', protect, getJobMatch);
router.delete('/:id', protect, deleteJobMatch);

module.exports = router;
