const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Stricter rate limiter for authentication routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: 'Too many login attempts from this IP, please try again after 15 minutes.',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful requests
});

// Rate limiter for creating/updating resources
const createLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 create/update requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { apiLimiter, authLimiter, createLimiter };
