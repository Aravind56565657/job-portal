const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isProfileCompleted: user.isProfileCompleted,
                profilePhoto: user.profilePhoto,
                companyLogo: user.companyLogo,
                companyName: user.companyName,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isProfileCompleted: user.isProfileCompleted,
                profilePhoto: user.profilePhoto,
                companyLogo: user.companyLogo,
                companyName: user.companyName,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Google auth
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
    const { token } = req.body; // ID Token from frontend

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email, picture } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (user) {
            // User exists, log them in
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isProfileCompleted: user.isProfileCompleted,
                profilePhoto: user.profilePhoto,
                companyLogo: user.companyLogo,
                companyName: user.companyName,
                token: generateToken(user._id),
            });
        } else {
            // User doesn't exist, create new user
            // Generate a random password since they used Google
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

            user = await User.create({
                name,
                email,
                password: randomPassword,
                role: 'job_seeker', // Default role, user can change later if we add that flow
                isProfileCompleted: false,
            });

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isProfileCompleted: user.isProfileCompleted,
                profilePhoto: user.profilePhoto,
                companyLogo: user.companyLogo,
                companyName: user.companyName,
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        res.status(400).json({ message: 'Google Sign-In failed', error: error.message });
    }
};


// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isProfileCompleted: user.isProfileCompleted,
                // Return all profile fields
                profilePhoto: user.profilePhoto,
                companyLogo: user.companyLogo,
                phone: user.phone,
                location: user.location,
                bio: user.bio,
                headline: user.headline,
                companyName: user.companyName,
                companyWebsite: user.companyWebsite,
                socialLinks: user.socialLinks,
                jobPreferences: user.jobPreferences,
                education: user.education,
                experience: user.experience,
                projects: user.projects,
                certifications: user.certifications,
                skills: user.skills,
                softSkills: user.softSkills,
                languages: user.languages,
                resume: user.resume,
                coverLetter: user.coverLetter
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    googleLogin,
    getUserProfile,
};
