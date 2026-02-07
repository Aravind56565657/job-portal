const express = require('express');
const router = express.Router();
const { updateProfile, uploadFile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.put('/profile', protect, updateProfile);
router.post('/upload', protect, upload.single('file'), uploadFile);

module.exports = router;
