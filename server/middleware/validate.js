const { body, param, validationResult } = require('express-validator');

/**
 * Middleware to check validation results and return 400 on failure.
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
        });
    }
    next();
};

// ───── Student Validation Rules ─────

const validateStudentLogin = [
    body('id')
        .trim()
        .notEmpty().withMessage('Student ID is required')
        .isLength({ max: 20 }).withMessage('Student ID too long')
        .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Student ID contains invalid characters'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ max: 128 }).withMessage('Password too long'),
    handleValidationErrors
];

const validateStudentRegister = [
    body('id')
        .trim()
        .notEmpty().withMessage('Student ID is required')
        .isLength({ max: 20 }).withMessage('Student ID too long')
        .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Student ID contains invalid characters'),
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ max: 100 }).withMessage('Name too long')
        .matches(/^[a-zA-Z\s.'-]+$/).withMessage('Name contains invalid characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail()
        .isLength({ max: 254 }).withMessage('Email too long'),
    body('stream')
        .trim()
        .isIn(['Science', 'Commerce', 'Arts']).withMessage('Invalid stream'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6, max: 128 }).withMessage('Password must be 6-128 characters'),
    body('otp')
        .trim()
        .notEmpty().withMessage('OTP is required')
        .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
        .isNumeric().withMessage('OTP must be numeric'),
    handleValidationErrors
];

const validateStudentCreate = [
    body('id')
        .trim()
        .notEmpty().withMessage('Student ID is required')
        .isLength({ max: 20 }).withMessage('Student ID too long')
        .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Student ID contains invalid characters'),
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ max: 100 }).withMessage('Name too long'),
    body('email')
        .optional({ values: 'falsy' })
        .trim()
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail()
        .isLength({ max: 254 }).withMessage('Email too long'),
    body('stream')
        .trim()
        .isIn(['Science', 'Commerce', 'Arts']).withMessage('Invalid stream'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6, max: 128 }).withMessage('Password must be 6-128 characters'),
    body('attendance')
        .optional()
        .isInt({ min: 0, max: 100 }).withMessage('Attendance must be 0-100'),
    body('standard')
        .optional()
        .trim()
        .isLength({ max: 10 }).withMessage('Standard too long'),
    body('marks')
        .optional()
        .isArray({ max: 20 }).withMessage('Too many marks entries'),
    body('marks.*.subject')
        .optional()
        .trim()
        .isLength({ max: 50 }).withMessage('Subject name too long'),
    body('marks.*.score')
        .optional()
        .isInt({ min: 0, max: 100 }).withMessage('Score must be 0-100'),
    handleValidationErrors
];

const validateStudentUpdate = [
    param('id')
        .trim()
        .isLength({ max: 20 }).withMessage('Student ID too long')
        .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Student ID contains invalid characters'),
    body('name')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Name too long'),
    body('attendance')
        .optional()
        .isInt({ min: 0, max: 100 }).withMessage('Attendance must be 0-100'),
    body('stream')
        .optional()
        .trim()
        .isIn(['Science', 'Commerce', 'Arts']).withMessage('Invalid stream'),
    body('standard')
        .optional()
        .trim()
        .isLength({ max: 10 }).withMessage('Standard too long'),
    body('password')
        .optional({ values: 'falsy' })
        .isLength({ min: 6, max: 128 }).withMessage('Password must be 6-128 characters'),
    body('marks')
        .optional()
        .isArray({ max: 20 }).withMessage('Too many marks entries'),
    body('marks.*.subject')
        .optional()
        .trim()
        .isLength({ max: 50 }).withMessage('Subject name too long'),
    body('marks.*.score')
        .optional()
        .isInt({ min: 0, max: 100 }).withMessage('Score must be 0-100'),
    handleValidationErrors
];

const validatePublishResults = [
    body('published')
        .isBoolean().withMessage('Published must be a boolean'),
    handleValidationErrors
];

// ───── Faculty Validation Rules ─────

const validateFacultyLogin = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ max: 50 }).withMessage('Username too long')
        .matches(/^[a-zA-Z0-9_.-]+$/).withMessage('Username contains invalid characters'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ max: 128 }).withMessage('Password too long'),
    handleValidationErrors
];

const validateFacultyCreate = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ max: 50 }).withMessage('Username too long')
        .matches(/^[a-zA-Z0-9_.-]+$/).withMessage('Username contains invalid characters'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6, max: 128 }).withMessage('Password must be 6-128 characters'),
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ max: 100 }).withMessage('Name too long'),
    body('email')
        .optional({ values: 'falsy' })
        .trim()
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail()
        .isLength({ max: 254 }).withMessage('Email too long'),
    body('role')
        .optional()
        .isIn(['teacher', 'admin']).withMessage('Invalid role'),
    handleValidationErrors
];

const validatePasswordChange = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ max: 50 }).withMessage('Username too long'),
    body('currentPassword')
        .notEmpty().withMessage('Current password is required')
        .isLength({ max: 128 }).withMessage('Password too long'),
    body('newPassword')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 6, max: 128 }).withMessage('New password must be 6-128 characters'),
    body('otp')
        .trim()
        .notEmpty().withMessage('OTP is required')
        .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
        .isNumeric().withMessage('OTP must be numeric'),
    handleValidationErrors
];

// ───── Notice Validation Rules ─────

const validateNoticeCreate = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ max: 200 }).withMessage('Title too long'),
    body('content')
        .trim()
        .notEmpty().withMessage('Content is required')
        .isLength({ max: 2000 }).withMessage('Content too long'),
    body('category')
        .optional()
        .isIn(['Academic', 'Event', 'Urgent', 'Holiday']).withMessage('Invalid category'),
    handleValidationErrors
];

// ───── OTP Validation Rules ─────

const validateSendOtp = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail()
        .isLength({ max: 254 }).withMessage('Email too long'),
    handleValidationErrors
];

const validateVerifyOtp = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    body('otp')
        .trim()
        .notEmpty().withMessage('OTP is required')
        .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
        .isNumeric().withMessage('OTP must be numeric'),
    handleValidationErrors
];

module.exports = {
    validateStudentLogin,
    validateStudentRegister,
    validateStudentCreate,
    validateStudentUpdate,
    validatePublishResults,
    validateFacultyLogin,
    validateFacultyCreate,
    validatePasswordChange,
    validateNoticeCreate,
    validateSendOtp,
    validateVerifyOtp
};
