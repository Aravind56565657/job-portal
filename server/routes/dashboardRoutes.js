const express = require('express');
const router = express.Router();
const {
    getJobSeekerStats,
    getEmployerStats
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/seeker', protect, authorize('job_seeker'), getJobSeekerStats);
router.get('/employer', protect, authorize('employer'), getEmployerStats);

module.exports = router;
