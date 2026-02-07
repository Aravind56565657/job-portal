const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['job_seeker', 'employer'],
        default: 'job_seeker',
    },
    // Common Fields
    isProfileCompleted: {
        type: Boolean,
        default: false,
    },
    location: String,
    socialLinks: {
        linkedin: String,
        github: String, // For Seekers
        portfolio: String, // For Seekers
        twitter: String, // For Employers
        facebook: String, // For Employers
    },

    // For Employer
    companyName: String,
    companyDescription: String,
    companyWebsite: String,
    companyLogo: String, // Cloudinary URL
    companySize: String, // e.g., "1-10", "11-50"

    // For Job Seeker - Comprehensive Profile
    profilePhoto: String, // Cloudinary URL
    dob: Date,
    gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
    nationality: String,
    willingToRelocate: { type: Boolean, default: false },
    alternatePhone: String,
    address: String,

    // Professional Overview
    headline: String,
    careerSummary: String,
    totalExperience: Number, // In years
    employmentStatus: { type: String, enum: ['Student', 'Employed', 'Unemployed', 'Fresher'] },

    // Skills & Languages
    skills: [String], // Technical Skills
    softSkills: [String],
    languages: [{ name: String, proficiency: String }],

    // Education & Experience
    education: [{
        degree: String,
        specialization: String,
        institution: String,
        startYear: Number,
        endYear: Number, // Null if present
        grade: String,
        mode: { type: String, enum: ['Full-time', 'Part-time', 'Distance'] }
    }],
    experience: [{
        title: String,
        company: String,
        type: { type: String, enum: ['Full-time', 'Internship', 'Contract', 'Freelance'] },
        location: String,
        startDate: Date,
        endDate: Date, // Null if present
        description: String,
        achievements: String
    }],

    // Projects (Important for Students)
    projects: [{
        title: String,
        description: String,
        technologies: [String],
        role: String,
        startDate: Date,
        endDate: Date,
        link: String
    }],

    // Certifications & Awards
    certifications: [{
        name: String,
        issuer: String,
        issueDate: Date,
        expiryDate: Date,
        credentialId: String,
        certificateFile: String // Cloudinary URL
    }],
    awards: [{
        title: String,
        date: Date,
        description: String
    }],
    publications: [{
        title: String,
        publisher: String,
        date: Date,
        link: String
    }],

    // Preferences & Docs
    jobPreferences: {
        roles: [String],
        industries: [String],
        employmentType: [String], // Full-time, Remote, etc. (Renamed from 'type' to avoid Mongoose conflict)
        locations: [String],
        salary: { min: Number, max: Number, currency: String },
        noticePeriod: String
    },
    resume: String, // Cloudinary URL
    coverLetter: String, // Cloudinary URL or Text
}, { timestamps: true });

// Encrypt password using bcrypt
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
