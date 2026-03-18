const mongoose = require('mongoose');

const detectionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        imageUrl: {
            type: String,
            default: '',
        },
        crop: {
            type: String,
            required: true,
        },
        disease: {
            type: String,
            required: true,
        },
        confidence: {
            type: Number,
            required: true,
        },
        treatment: {
            type: String,
            required: true,
        },
        classKey: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Detection', detectionSchema);
