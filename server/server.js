const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config();

const logger = require('./utils/logger');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// ───── Security Headers (Helmet) ─────
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:"],
            connectSrc: ["'self'"]
        }
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));

app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
});

// ───── CORS — explicit allowlist ─────
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,https://bssaindane.vercel.app')
    .split(',')
    .map(o => o.trim());

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Postman)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked: origin ${origin} not allowed`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight for all routes

// ───── Body Parsing with size limits ─────
app.use(express.json({ limit: '10kb' })); // Reduced for security
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser()); // Add cookie parser

// ───── Data Sanitization ─────
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// ───── Request Logging ─────
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`);
    next();
});

// ───── MongoDB Connection (cached for Vercel serverless) ─────
let isConnected = false;

async function connectDB() {
    if (isConnected && mongoose.connection.readyState === 1) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        logger.info('MongoDB connected successfully');
        await initializeData();
    } catch (err) {
        logger.error('MongoDB connection failed', err);
        throw err;
    }
}

// Connect eagerly (non-blocking) so it's ready for first request
if (process.env.NODE_ENV !== 'test') {
    connectDB().catch(err => logger.error('Initial DB connect error', err));
}

// Middleware to ensure DB is connected before handling requests
app.use(async (req, res, next) => {
    if (process.env.NODE_ENV === 'test') return next();
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(503).json({ status: 'error', message: 'Database unavailable' });
    }
});

// ───── Initialize sample data ─────
async function initializeData() {
    const Student = require('./models/Student');
    const Faculty = require('./models/Faculty');
    const Notice = require('./models/Notice');

    try {
        const studentCount = await Student.countDocuments();
        const hashedStudentPassword = await bcrypt.hash('student123', 10);

        if (studentCount === 0) {
            await Student.insertMany([
                { id: 'S101', name: 'James Wilson', email: 'james@college.edu', attendance: 88, marks: [{ subject: 'Mathematics', score: 92 }, { subject: 'Physics', score: 85 }], stream: 'Science', password: hashedStudentPassword },
                { id: 'S102', name: 'Sarah Parker', email: 'sarah@college.edu', attendance: 94, marks: [{ subject: 'Accounts', score: 85 }, { subject: 'Economics', score: 88 }], stream: 'Commerce', password: hashedStudentPassword },
                { id: 'S103', name: 'Michael Brown', email: 'michael@college.edu', attendance: 76, marks: [{ subject: 'History', score: 78 }, { subject: 'Psychology', score: 82 }], stream: 'Arts', password: hashedStudentPassword }
            ]);
            logger.info('Sample students created');
        }

        const adminUser = await Faculty.findOne({ username: 'admin' });
        const hashedAdminPassword = await bcrypt.hash('admin123', 10);
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@college.edu';

        if (!adminUser) {
            await Faculty.create({
                username: 'admin',
                password: hashedAdminPassword,
                name: 'Faculty Admin',
                email: adminEmail,
                role: 'admin'
            });
            logger.info('Default faculty account created');
        }

        const noticeCount = await Notice.countDocuments();
        if (noticeCount === 0) {
            await Notice.insertMany([
                { title: 'Final Examinations Schedule', content: 'Final exams for the current semester will begin from March 1st.', category: 'Academic' },
                { title: 'Annual Cultural Fest 2026', content: 'Join us for "Utsav 2026" on Feb 25, 2026.', category: 'Event' },
                { title: 'Holiday Notice', content: 'College will remain closed on Feb 15 for local festivities.', category: 'Holiday' }
            ]);
            logger.info('Sample notices initialized');
        }
    } catch (error) {
        logger.error('Error initializing data', error);
    }
}

// ───── Routes ─────
app.use('/api/students', require('./routes/students'));
app.use('/api/faculty', require('./routes/faculty'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/otp', require('./routes/otp'));

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Prof. BSS Jr College API is running',
        timestamp: new Date().toISOString()
    });
});

// Handle unhandled routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// ───── Global Error Handler ─────
app.use(globalErrorHandler);

// Only start HTTP server when running locally (not on Vercel serverless)
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
    });
}

// Log uncaught errors without crashing the serverless function
process.on('uncaughtException', err => {
    logger.error('UNCAUGHT EXCEPTION!', err);
});

process.on('unhandledRejection', err => {
    logger.error('UNHANDLED REJECTION!', err);
});

module.exports = app;
