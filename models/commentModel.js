const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: [true, "Comment must be required"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'Comment',
        required: true
    },
    blog: {
        type: mongoose.Schema.ObjectId,
        ref: 'Blog',
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Comment', commentSchema);