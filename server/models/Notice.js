const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Academic', 'Event', 'Urgent', 'Holiday'],
        default: 'Academic'
    },
    date: {
        type: Date,
        default: Date.now
    },
    postedBy: {
        type: String,
        default: 'Faculty Administration'
    }
}, {
    timestamps: true
});

// Index for sorting by date (descending)
noticeSchema.index({ date: -1 });

module.exports = mongoose.model('Notice', noticeSchema);
