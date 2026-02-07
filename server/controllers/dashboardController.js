const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get Job Seeker Stats
// @route   GET /api/dashboard/seeker
// @access  Private (Job Seeker)
const getJobSeekerStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // Count total applications
        const applicationsCount = await Application.countDocuments({ applicant: userId });

        // Count interviews (Status: 'Interviewing')
        const interviewsCount = await Application.countDocuments({
            applicant: userId,
            status: 'Interviewing'
        });

        // Count shortlisted (Status: 'Shortlisted')
        const shortlistedCount = await Application.countDocuments({
            applicant: userId,
            status: 'Shortlisted'
        });

        res.json({
            applications: applicationsCount,
            interviews: interviewsCount,
            shortlisted: shortlistedCount
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Employer Stats
// @route   GET /api/dashboard/employer
// @access  Private (Employer)
const getEmployerStats = async (req, res) => {
    try {
        const employerId = req.user.id;

        // Count active jobs posted by this employer
        const activeJobsCount = await Job.countDocuments({ employer: employerId });

        // Find all jobs by this employer to get their IDs
        const jobs = await Job.find({ employer: employerId }).select('_id');
        const jobIds = jobs.map(job => job._id);

        // Count total applicants for these jobs
        const totalApplicantsCount = await Application.countDocuments({ job: { $in: jobIds } });

        // Count shortlisted candidates for these jobs
        const shortlistedCount = await Application.countDocuments({
            job: { $in: jobIds },
            status: 'Shortlisted'
        });

        res.json({
            activeJobs: activeJobsCount,
            totalApplicants: totalApplicantsCount,
            shortlistedCandidates: shortlistedCount
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getJobSeekerStats,
    getEmployerStats
};
