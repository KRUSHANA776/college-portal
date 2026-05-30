const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { publicLimiter, userLimiter } = require('../middleware/rateLimiter');
const { validateNoticeCreate } = require('../middleware/validate');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Get all notices (public, rate limited)
router.get('/', publicLimiter, catchAsync(async (req, res, next) => {
    const notices = await Notice.find().select('-__v').sort({ date: -1 });
    res.json(notices);
}));

// Create a notice (faculty only)
router.post('/', authenticateToken, requireRole('teacher', 'admin'), userLimiter, validateNoticeCreate, catchAsync(async (req, res, next) => {
    const { title, content, category } = req.body;
    const notice = new Notice({ title, content, category });
    await notice.save();

    const noticeData = notice.toObject();
    delete noticeData.__v;

    res.status(201).json({ message: 'Notice posted successfully', notice: noticeData });
}));

// Delete a notice (faculty only)
router.delete('/:id', authenticateToken, requireRole('teacher', 'admin'), userLimiter, catchAsync(async (req, res, next) => {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) {
        return next(new AppError('Notice not found', 404));
    }
    res.json({ message: 'Notice deleted' });
}));

module.exports = router;
