const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: [true, "Blog name must be required"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Blog description must be required"]
    },
    images: {
        type: [String],
        required: [true, "Images must be required"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    topic: {
        type: mongoose.Schema.ObjectId,
        ref: 'Topic',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema)