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
        enum: ['Applied', 'Reviewed', 'Interviewing', 'Rejected', 'Hired'],
        default: 'Applied',
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
