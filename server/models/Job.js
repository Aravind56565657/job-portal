const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    qualifications: {
        type: String,
        required: true,
    },
    responsibilities: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    salaryRange: {
        type: String, // e.g., "$50,000 - $70,000"
        required: true,
    },
    jobType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
        required: true,
    },
    postedDate: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
