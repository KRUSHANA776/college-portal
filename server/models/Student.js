const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters long']
  },
  attendance: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  marks: [{
    subject: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  }],
  standard: {
    type: String,
    required: true,
    default: '12th'
  },
  stream: {
    type: String,
    enum: ['Science', 'Commerce', 'Arts'],
    default: 'Science'
  },
  batch: {
    type: String,
    default: '2025-26'
  },
  resultsPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Indexes for performance
studentSchema.index({ id: 1 }); // Primary search
studentSchema.index({ stream: 1, standard: 1 }); // Filtering
studentSchema.index({ name: 'text' }); // Search by name

module.exports = mongoose.model('Student', studentSchema);
