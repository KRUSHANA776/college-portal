const bcrypt = require('bcryptjs');
const OTP = require('../models/OTP');
const studentService = require('../services/studentService');
const { generateAccessToken, generateRefreshToken } = require('../middleware/auth');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Helper to set cookie
const sendTokenResponse = (student, statusCode, res) => {
    const tokenPayload = { id: student.id, role: 'student' };
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

    const studentData = student.toObject ? student.toObject() : student;
    if (studentData.password) delete studentData.password;
    if (studentData.__v !== undefined) delete studentData.__v;

    res.status(statusCode).json({
        message: 'Login successful',
        student: studentData,
        role: 'student'
    });
};

exports.logout = (req, res) => {
    res.cookie('accessToken', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.cookie('refreshToken', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};

exports.login = catchAsync(async (req, res, next) => {
    const { id, password } = req.body;
    const student = await studentService.findForAuth(id);

    if (!student || !(await bcrypt.compare(password, student.password))) {
        return next(new AppError('Invalid credentials', 401));
    }

    sendTokenResponse(student, 200, res);
});

exports.register = catchAsync(async (req, res, next) => {
    const { id, name, email, stream, password, otp, standard } = req.body;

    const normalizedEmail = email.trim().toLowerCase();
    const otpRecord = await OTP.findOne({ email: normalizedEmail, otp });
    if (!otpRecord) {
        return next(new AppError('Invalid or expired OTP', 400));
    }

    const existingStudent = await studentService.findForAuth(id);
    if (existingStudent) {
        return next(new AppError('Student ID already exists', 400));
    }

    const student = await studentService.createStudent({
        id, name, email: normalizedEmail, stream, password,
        standard: standard || '12th', attendance: 0, marks: []
    });

    await OTP.deleteOne({ _id: otpRecord._id });

    sendTokenResponse(student, 201, res);
});

exports.getAllStudents = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    let query = {};
    if (search) {
        query = {
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { id: { $regex: search, $options: 'i' } },
                { stream: { $regex: search, $options: 'i' } }
            ]
        };
    }

    const { students, total } = await studentService.findAll(query, skip, limit);

    res.json({
        results: students.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: students
    });
});

exports.getStudentById = catchAsync(async (req, res, next) => {
    if (req.user.role === 'student' && req.user.id !== req.params.id) {
        return next(new AppError('Access denied', 403));
    }

    const student = await studentService.findById(req.params.id);
    if (!student) {
        return next(new AppError('Student not found', 404));
    }
    res.json(student);
});

exports.createStudent = catchAsync(async (req, res, next) => {
    const { id, name, email, stream, password, standard, attendance, marks } = req.body;

    const existingStudent = await studentService.findForAuth(id);
    if (existingStudent) {
        return next(new AppError('Student ID already exists', 400));
    }

    const student = await studentService.createStudent({
        id, name, email, stream, password,
        standard: standard || '12th',
        attendance: attendance || 0,
        marks: marks || []
    });

    const studentData = student.toObject();
    delete studentData.password;
    delete studentData.__v;

    res.status(201).json({ message: 'Student created successfully', student: studentData });
});

exports.updateStudent = catchAsync(async (req, res, next) => {
    const student = await studentService.updateStudent(req.params.id, req.body);
    if (!student) {
        return next(new AppError('Student not found', 404));
    }
    res.json({ message: 'Student updated successfully', student });
});

exports.publishAllResults = catchAsync(async (req, res, next) => {
    const { published } = req.body;
    await studentService.updateManyResults(published);
    res.json({ message: `All results ${published ? 'published' : 'unpublished'} successfully` });
});

exports.publishResults = catchAsync(async (req, res, next) => {
    const { published } = req.body;
    const student = await studentService.updateOneResult(req.params.id, published);

    if (!student) {
        return next(new AppError('Student not found', 404));
    }
    res.json({ message: `Results ${published ? 'published' : 'unpublished'} successfully`, student });
});

exports.deleteStudent = catchAsync(async (req, res, next) => {
    const student = await studentService.deleteStudent(req.params.id);
    if (!student) {
        return next(new AppError('Student not found', 404));
    }
    res.json({ message: 'Student deleted successfully' });
});
