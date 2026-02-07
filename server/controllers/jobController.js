const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private (Employer)
const createJob = async (req, res) => {
    try {
        const {
            title,
            description,
            qualifications,
            responsibilities,
            location,
            salaryRange,
            jobType,
        } = req.body;

        const job = await Job.create({
            employer: req.user.id,
            title,
            description,
            // Ensure these are arrays, generic split if string
            qualifications: Array.isArray(qualifications) ? qualifications : qualifications.split('\n').filter(i => i.trim()),
            responsibilities: Array.isArray(responsibilities) ? responsibilities : responsibilities.split('\n').filter(i => i.trim()),
            location,
            salaryRange,
            jobType,
        });

        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
    try {
        const { keyword, location, jobType } = req.query;
        let query = {};

        // Keyword Search (Title or Description)
        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
            ];
        }

        // Location Filter
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        // Job Type Filter (Supports multiple comma-separated values)
        if (jobType) {
            const types = jobType.split(',').filter(t => t.trim() !== '');
            if (types.length > 0) {
                // Case-insensitive match for each type
                query.jobType = { $in: types.map(t => new RegExp(`^${t.trim()}$`, 'i')) };
            }
        }

        const jobs = await Job.find(query).populate('employer', 'name companyName').sort({ createdAt: -1 });

        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('employer', 'name companyName email');

        if (job) {
            res.json(job);
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (Employer)
const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check user
        if (job.employer.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        // Process arrays if they are strings
        let updateData = { ...req.body };
        if (typeof updateData.qualifications === 'string') {
            updateData.qualifications = updateData.qualifications.split('\n').filter(i => i.trim());
        }
        if (typeof updateData.responsibilities === 'string') {
            updateData.responsibilities = updateData.responsibilities.split('\n').filter(i => i.trim());
        }

        const updatedJob = await Job.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });

        res.json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer)
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check user
        if (job.employer.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await job.deleteOne();

        res.json({ message: 'Job removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get jobs posted by current employer
// @route   GET /api/jobs/my-jobs
// @access  Private (Employer)
const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ employer: req.user.id }).sort({ createdAt: -1 }).lean();

        // Get application counts for these jobs
        const jobIds = jobs.map(job => job._id);
        const applicationCounts = await Application.aggregate([
            { $match: { job: { $in: jobIds } } },
            { $group: { _id: "$job", count: { $sum: 1 } } }
        ]);

        // Map counts to jobs
        const jobsWithCounts = jobs.map(job => {
            const countObj = applicationCounts.find(c => c._id.equals(job._id));
            return { ...job, applicantCount: countObj ? countObj.count : 0 };
        });

        res.json(jobsWithCounts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    getMyJobs,
};
