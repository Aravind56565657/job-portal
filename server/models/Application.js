const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['Applied', 'Reviewed', 'Shortlisted', 'Interviewing', 'Rejected', 'Hired'],
        default: 'Applied',
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    portfolioLink: {
        type: String,
    },
    experience: {
        type: String, // e.g., "3 years"
    },
    resume: {
        type: String, // URL specifically for this application if different from profile
    },
    coverLetter: String,
    appliedDate: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
