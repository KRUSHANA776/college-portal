const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * Middleware to verify JWT access token from HTTP-Only cookie.
 * Sets req.user = { id, role, username } on success.
 */
const authenticateToken = catchAsync(async (req, res, next) => {
    // 1) Get token from cookie instead of Authorization header
    let token;
    if (req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    // 2) Verification token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Grant access to protected route
    req.user = decoded; // { id, role, username }
    next();
});

/**
 * Middleware to require a specific role (e.g., 'admin', 'teacher').
 * Must be used AFTER authenticateToken.
 */
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    };
};

/**
 * Generate a short-lived access token (15 min).
 */
const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
};

/**
 * Generate a longer-lived refresh token (7 days).
 */
const generateRefreshToken = (payload) => {
    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    return jwt.sign(payload, secret, { expiresIn: '7d' });
};

module.exports = {
    authenticateToken,
    requireRole,
    generateAccessToken,
    generateRefreshToken
};
