const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const validator = require('validator');
const Faculty = require('../models/Faculty');
const OTP = require('../models/OTP');
const { authenticateToken, requireRole, generateAccessToken, generateRefreshToken } = require('../middleware/auth');
const { authLimiter, userLimiter } = require('../middleware/rateLimiter');
const {
    validateFacultyLogin,
    validateFacultyCreate,
    validatePasswordChange
} = require('../middleware/validate');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Logout
router.post('/logout', (req, res) => {
    res.cookie('accessToken', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.cookie('refreshToken', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success', message: 'Logged out successfully' });
});

// Helper to set cookie
const sendTokenResponse = (user, statusCode, res) => {
    const tokenPayload = { id: user._id.toString(), role: user.role, username: user.username };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    const cookieOptions = {
        expires: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
        httpOnly: true,
        secure: true, // Always true — required for sameSite:'none'
        sameSite: 'none' // Cross-domain: client and server are on different Vercel domains
    };

    res.cookie('accessToken', accessToken, cookieOptions);
    
    const refreshCookieOptions = { ...cookieOptions, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) };
    res.cookie('refreshToken', refreshToken, refreshCookieOptions);

    const userData = user.toObject();
    delete userData.password;
    delete userData.__v;

    res.status(statusCode).json({
        message: 'Login successful',
        faculty: userData,
        role: user.role // FIXED: use actual DB role instead of hardcoding 'teacher'
    });
};

// Faculty login
router.post('/login', authLimiter, validateFacultyLogin, catchAsync(async (req, res, next) => {
    const { username, password } = req.body;
    const faculty = await Faculty.findOne({ username });

    if (!faculty || !(await bcrypt.compare(password, faculty.password))) {
        return next(new AppError('Invalid credentials', 401));
    }

    sendTokenResponse(faculty, 200, res);
}));

// Create faculty (admin only)
router.post('/', authenticateToken, requireRole('admin'), userLimiter, validateFacultyCreate, catchAsync(async (req, res, next) => {
    const { username, password, name, role, email } = req.body;

    const existingFaculty = await Faculty.findOne({ username });
    if (existingFaculty) {
        return next(new AppError('Username already exists', 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const faculty = await Faculty.create({
        username,
        password: hashedPassword,
        name,
        role: role || 'teacher',
        email
    });

    const facultyData = faculty.toObject();
    delete facultyData.password;
    delete facultyData.__v;

    res.status(201).json({ message: 'Faculty created successfully', faculty: facultyData });
}));

// Change password (requires auth + OTP for re-verification)
router.put('/change-password', authenticateToken, authLimiter, validatePasswordChange, catchAsync(async (req, res, next) => {
    const { username, currentPassword, newPassword, otp } = req.body;

    // Verify the authenticated user is changing their own password
    if (req.user.username !== username) {
        return next(new AppError('You can only change your own password', 403));
    }

    const faculty = await Faculty.findOne({ username });

    if (!faculty) {
        return next(new AppError('Account not found', 404));
    }

    if (!faculty.email) {
        return next(new AppError('Email not configured for this account. Contact admin.', 400));
    }

    // Verify OTP
    const normalizedEmail = validator.normalizeEmail(faculty.email) || faculty.email.trim().toLowerCase();
    const otpRecord = await OTP.findOne({ email: normalizedEmail, otp });
    if (!otpRecord) {
        return next(new AppError('Invalid or expired OTP', 400));
    }

    const isMatch = await bcrypt.compare(currentPassword, faculty.password);
    if (!isMatch) {
        return next(new AppError('Current password is incorrect', 401));
    }

    faculty.password = await bcrypt.hash(newPassword, 10);
    await faculty.save();

    // Delete used OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    res.json({ message: 'Password changed successfully' });
}));

module.exports = router;
