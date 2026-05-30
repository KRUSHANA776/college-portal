const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { authLimiter, userLimiter } = require('../middleware/rateLimiter');
const {
    validateStudentLogin,
    validateStudentRegister,
    validateStudentCreate,
    validateStudentUpdate,
    validatePublishResults
} = require('../middleware/validate');

// ───── Public Routes ─────
router.post('/login', authLimiter, validateStudentLogin, studentController.login);
router.post('/register', authLimiter, validateStudentRegister, studentController.register);
router.post('/logout', studentController.logout);

// ───── Authenticated Routes ─────
// Get all students (faculty only) - WITH PAGINATION and SEARCH
router.get('/', authenticateToken, requireRole('teacher', 'admin'), userLimiter, studentController.getAllStudents);

// Get student by ID (own data or faculty)
router.get('/:id', authenticateToken, userLimiter, studentController.getStudentById);

// Create new student (Admin/Teacher only)
router.post('/', authenticateToken, requireRole('teacher', 'admin'), userLimiter, validateStudentCreate, studentController.createStudent);

// Update student (Admin/Teacher only)
router.put('/:id', authenticateToken, requireRole('teacher', 'admin'), userLimiter, validateStudentUpdate, studentController.updateStudent);

// Bulk Publish / Unpublish results (Admin/Teacher only)
router.patch('/publish-all-results', authenticateToken, requireRole('teacher', 'admin'), userLimiter, validatePublishResults, studentController.publishAllResults);

// Publish / Unpublish results for a student (Admin/Teacher only)
router.patch('/publish-results/:id', authenticateToken, requireRole('teacher', 'admin'), userLimiter, validatePublishResults, studentController.publishResults);

// Delete student (Admin/Teacher only)
router.delete('/:id', authenticateToken, requireRole('teacher', 'admin'), userLimiter, studentController.deleteStudent);

module.exports = router;
