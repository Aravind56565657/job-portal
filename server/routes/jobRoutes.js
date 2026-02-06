const express = require('express');
const router = express.Router();
const {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(getJobs)
    .post(protect, authorize('employer'), createJob);

router.route('/:id')
    .get(getJobById)
    .put(protect, authorize('employer'), updateJob)
    .delete(protect, authorize('employer'), deleteJob);

module.exports = router;
