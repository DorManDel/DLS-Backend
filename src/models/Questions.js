const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    presentationId: {
        type: String,
        required: true,
        index: true
    },

    fileName: {
        type: String,
        default: null
    },

    page: {
        type: Number,
        required: true
    },

    x: {
        type: Number,
        required: true
    },

    y: {
        type: Number,
        required: true
    },

    text: {
        type: String,
        required: true,
        trim: true
    },

    status: {
        type: String,
        enum: ["open", "close"],
        default: "open"
    },

    studentId: {
        type: String,
        index: true,
        default: null
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("Question", questionSchema);