const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Job Seeker)
const applyForJob = async (req, res) => {
    try {
        const { jobId, resume, coverLetter, email, phone, portfolioLink, experience } = req.body;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const alreadyApplied = await Application.findOne({
            job: jobId,
            applicant: req.user.id,
        });

        if (alreadyApplied) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        // Use profile resume if not provided
        let resumeUrl = resume;
        if (!resumeUrl) {
            // Logic to fetch from user profile if stored there, simplified for now
            // Assuming frontend sends the resume URL
        }

        const application = await Application.create({
            job: jobId,
            applicant: req.user.id,
            resume: resumeUrl,
            coverLetter,
            email,
            phone,
            portfolioLink,
            experience
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user applications
// @route   GET /api/applications/my-applications
// @access  Private (Job Seeker)
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicant: req.user.id })
            .populate('job', 'title companyName location');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get applications for a job
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer)
const getJobApplications = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if user is the employer who posted the job
        if (job.employer.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const applications = await Application.find({ job: req.params.jobId })
            .populate('applicant', 'name email resume profilePhoto');

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Employer)
const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findById(req.params.id).populate('job');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.job.employer.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        application.status = status;
        await application.save();

        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    applyForJob,
    getMyApplications,
    getJobApplications,
    updateApplicationStatus,
};
