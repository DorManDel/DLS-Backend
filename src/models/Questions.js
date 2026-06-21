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
        enum: ["open", "answered"],
        default: "open"
    },

    color: {
        type: String,
        default: "#ff2f6d"
    },

    studentId: {
        type: String,
        index: true,
        default: null
    },

    studentEmail: {
        type: String,
        index: true,
        default: null
    },

    studentName: {
        type: String,
        default: "Anonymous"
    },

    isAnonymous: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Question", questionSchema);