const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    topicName: {
        type: String,
        unique: true,
        required: [true, "Topic name must be required"],
        trim: true,
        lowercase: true,
    },
    topicDes: {
        type: String,
        required: [true, "Topic description must be required"],
        trim: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Topic", topicSchema);