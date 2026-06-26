// src/models/Session.js
const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

/**
 * Session represents a live lecture presentation.
 *  - `code`  : short 6‑char identifier used by students to join.
 *  - `owner` : ObjectId reference to the lecturer (User model).
 *  - `pdfFileId` : GridFS file _id that stores the uploaded PDF.
 *  - `participants` : array of User ObjectIds that have joined the session.
 *  - timestamps : createdAt / updatedAt (creation time is used for sorting).
 */
const sessionSchema = new Schema(
  {
    code: { type: String, required: true, unique: true },
    // For PoC we accept a simple string identifier for the lecturer (owner)
    owner: { type: String, required: true },
    pdfFileId: { type: Types.ObjectId, required: true },
    
    participants: [{ type: String }],
    // placeholder for future layer/annotation data
    // layers: [{ user: Types.ObjectId, data: Schema.Types.Mixed }]
    title: { type: String, required: true, unique: false }
  },
  { timestamps: true }
);

// When a session document is deleted we also delete the GridFS file.
sessionSchema.pre('deleteOne', { document: true }, async function () {
  try {
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'sessionPdfs' });
    await bucket.delete(this.pdfFileId);
  } catch (err) {
    // Silently continue if file not found (orphan file scenario)
    if (err.message.includes('File not found')) {
      console.warn(`Skipping orphan GridFS file deletion for session ${this.code}`);
    } else {
      console.warn('Error deleting GridFS file for session', err);
    }
  }
});

module.exports = mongoose.model('Session', sessionSchema);

