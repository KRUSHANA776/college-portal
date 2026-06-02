const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const OTP = require('../models/OTP');
const { authLimiter } = require('../middleware/rateLimiter');
const { validateSendOtp, validateVerifyOtp } = require('../middleware/validate');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Configure nodemailer. Note: connection pooling is disabled to avoid stale/frozen sockets in serverless environments (Vercel).
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send OTP (rate limited strictly)
router.post('/send-otp', authLimiter, validateSendOtp, catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save to database (upsert)
    await OTP.findOneAndUpdate(
        { email: normalizedEmail },
        { otp, createdAt: new Date() },
        { upsert: true, new: true }
    );

    // Send email
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: normalizedEmail,
        subject: 'Verification OTP - Prof. BSS Jr College',
        text: `Your OTP for verification is: ${otp}. It will expire in 5 minutes.`
    };

    const hasRealCredentials =
        process.env.EMAIL_USER &&
        process.env.EMAIL_PASS &&
        process.env.EMAIL_USER !== 'your_email@gmail.com' &&
        process.env.EMAIL_PASS !== 'your_gmail_app_password';

    if (hasRealCredentials) {
        // Must await the email sending so that serverless functions (like Vercel) do not freeze/terminate the execution before the SMTP process completes
        try {
            await transporter.sendMail(mailOptions);
            res.json({ message: 'OTP sent successfully' });
        } catch (err) {
            console.error('Nodemailer failed to send OTP email to:', normalizedEmail, err);
            return next(new AppError('Failed to send verification email. Please try again.', 500));
        }
    } else {
        // No real email configured
        console.log('Email not configured. OTP generated for:', normalizedEmail);
        res.status(200).json({
            message: 'Email service not configured. Please contact administrator.'
        });
    }
}));

// Verify OTP (rate limited strictly)
router.post('/verify-otp', authLimiter, validateVerifyOtp, catchAsync(async (req, res, next) => {
    const { email, otp } = req.body;
    const normalizedEmail = email.trim().toLowerCase();
    const otpRecord = await OTP.findOne({ email: normalizedEmail, otp });

    if (!otpRecord) {
        return next(new AppError('Invalid or expired OTP', 400));
    }

    // Delete OTP after successful verification to prevent reuse
    await OTP.deleteOne({ _id: otpRecord._id });

    res.json({ message: 'OTP verified successfully' });
}));

module.exports = router;
