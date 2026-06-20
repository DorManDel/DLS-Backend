// src/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: { 
        type: String,
        required: true,
        trim: true
    },
    email: { 
        type: String,
        required: true,
        unique: true,
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['student', 'lecturer'], 
        default: 'student' 
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model("User", userSchema);