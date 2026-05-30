const rateLimit = require('express-rate-limit');

/**
 * Auth endpoints (login, signup, OTP, password reset): 5 requests/min/IP
 */
const authLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many attempts. Please try again later.' },
    handler: (req, res) => {
        res.status(429).set('Retry-After', '60').json({
            message: 'Too many attempts. Please try again after 1 minute.'
        });
    }
});

/**
 * Public endpoints: 20 requests/min/IP
 */
const publicLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests. Please slow down.' },
    handler: (req, res) => {
        res.status(429).set('Retry-After', '60').json({
            message: 'Too many requests. Please try again after 1 minute.'
        });
    }
});

/**
 * Authenticated user endpoints: 60 requests/min/user
 */
const userLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Rate limit exceeded. Please slow down.' },
    handler: (req, res) => {
        res.status(429).set('Retry-After', '60').json({
            message: 'Rate limit exceeded. Please try again after 1 minute.'
        });
    },
    // Use authenticated user ID if available, fall back to IP
    keyGenerator: (req) => (req.user && req.user.id) || req.ip,
    validate: { xForwardedForHeader: false, trustProxy: false, default: false }
});

module.exports = {
    authLimiter,
    publicLimiter,
    userLimiter
};
