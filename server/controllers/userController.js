const path = require('path');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            // Update fields based on request body
            // This is a dynamic update allowing any valid field to be updated
            const allowableFields = [
                // Identity & Contact
                'name', 'phone', 'alternatePhone', 'bio', 'location', 'address', 'profilePhoto', 'dob', 'gender', 'nationality', 'willingToRelocate',

                // Professional
                'headline', 'careerSummary', 'totalExperience', 'employmentStatus',

                // Skills
                'skills', 'softSkills', 'languages',

                // History
                'education', 'experience', 'projects',

                // Achievements
                'certifications', 'awards', 'publications',

                // Preferences & Docs
                'jobPreferences', 'resume', 'coverLetter',

                // Employer Specific
                'companyName', 'companyDescription', 'companyWebsite', 'companySize', 'companyLogo', 'socialLinks'
            ];

            allowableFields.forEach(field => {
                if (req.body[field] !== undefined) {
                    user[field] = req.body[field];
                }
            });

            // If key fields are present, mark profile as completed
            if (!user.isProfileCompleted) {
                if (user.role === 'job_seeker' && user.resume) {
                    user.isProfileCompleted = true;
                } else if (user.role === 'employer' && user.companyName) {
                    user.isProfileCompleted = true;
                }
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                isProfileCompleted: updatedUser.isProfileCompleted,
                token: req.body.token,
                // Return all profile fields for UI consistency
                profilePhoto: updatedUser.profilePhoto,
                companyLogo: updatedUser.companyLogo,
                phone: updatedUser.phone,
                location: updatedUser.location,
                bio: updatedUser.bio,
                headline: updatedUser.headline,
                companyName: updatedUser.companyName,
                companyWebsite: updatedUser.companyWebsite,
                socialLinks: updatedUser.socialLinks,
                jobPreferences: updatedUser.jobPreferences,
                education: updatedUser.education,
                experience: updatedUser.experience,
                projects: updatedUser.projects,
                certifications: updatedUser.certifications,
                skills: updatedUser.skills,
                softSkills: updatedUser.softSkills,
                languages: updatedUser.languages,
                resume: updatedUser.resume,
                coverLetter: updatedUser.coverLetter
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ message: error.message, details: error.errors });
    }
};

// @desc    Upload file to Cloudinary
// @route   POST /api/users/upload
// @access  Private
const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Convert buffer to base64 for Cloudinary
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

        const type = req.body.type || 'auto'; // 'image' or 'raw' (for pdf)

        // Force 'raw' for PDFs to avoid corruption/image conversion issues
        const resourceType = (type === 'resume' || req.file.mimetype === 'application/pdf') ? 'raw' : 'auto';

        const fileExtension = path.extname(req.file.originalname);
        const publicId = `${req.user.id}_${Date.now()}${fileExtension}`;

        const uploadResponse = await cloudinary.uploader.upload(dataURI, {
            resource_type: resourceType,
            folder: 'job-portal-uploads',
            public_id: publicId,
            use_filename: true
        });

        res.json({
            url: uploadResponse.secure_url,
            public_id: uploadResponse.public_id
        });

    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ message: 'File upload failed: ' + error.message });
    }
};

module.exports = {
    updateProfile,
    uploadFile
};
