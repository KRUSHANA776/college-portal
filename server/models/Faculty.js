const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'teacher',
        enum: ['teacher', 'admin']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Faculty', facultySchema);
