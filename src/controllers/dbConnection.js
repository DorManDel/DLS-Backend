const mongoose = require('mongoose');

exports.dbConnection = {
    async createConnection() {
        try {
            await mongoose.connect(process.env.MONGO_URI);
            console.log("Connected to MongoDB Atlas successfully");
        } catch (error) {
            console.error("MongoDB connection failed:", error);
            throw error; // Pass the error back to index.js
        }
    }
}