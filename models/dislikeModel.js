const mongoose = require('mongoose')

const disLikeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    blog: {
        type: mongoose.Schema.ObjectId,
        ref: 'Blog',
        required: true
    }
})
module.exports = mongoose.model('DisLike', disLikeSchema);