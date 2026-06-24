// src/controllers/sessionController.js
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const Session = require('../models/Session');
const User = require('../models/User');

// Added detailed debug logs for development (only when NODE_ENV === 'development')
const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('nodemon');

// ------------------------------------------------------------
// Helper: generate a 6‑character alphanumeric (ASCII) code
// ------------------------------------------------------------
function generateSessionCode() {
  // 3 random bytes => 6 hex characters, upper‑cased (e.g. "A1B2C3")
  return crypto.randomBytes(3).toString('hex').toUpperCase();
}

// ------------------------------------------------------------
// Multer config – keep file in memory, enforce 16 MB limit, PDF only
// ------------------------------------------------------------
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 16 * 1024 * 1024 }, // 16 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  }
});

// ------------------------------------------------------------
// Controller actions
// ------------------------------------------------------------
/**
 * POST /api/sessions
 * Creates a new lecture session and stores the uploaded PDF in GridFS.
 */
async function createSession(req, res) {
  if (isDev) console.log('--- createSession invoked ---');
  try {
  // Expected body: { ownerId: <User ObjectId>, pdf: <file> }
  const { ownerId , title } = req.body;
  const file = req.file;
    if (isDev) console.log('ownerId from body:', ownerId);
  if (!ownerId || !file || !title) {
      return res.status(400).json({ success: false, message: 'ownerId (lecturer) and title are required' });
  }
  // For PoC we relax ObjectId validation – accept any non‑empty string as ownerId
  if (typeof ownerId !== 'string' || ownerId.trim() === '') {
      if (isDev) console.log('ownerId missing or not a string');
      return res.status(400).json({ success: false, message: 'ownerId is required' });
  }
  // Ensure a PDF was provided. Multer puts a file in req.file, but for PoC we also accept a base64 string.
  let pdfBuffer = null;
  if (req.file) {
    pdfBuffer = req.file.buffer;
    if (isDev) console.log('PDF file buffer size (bytes):', pdfBuffer.length);
  } else if (req.body.pdfBase64) {
    // Expect a base64‑encoded string without data URI prefix
    try {
      pdfBuffer = Buffer.from(req.body.pdfBase64, 'base64');
      if (isDev) console.log('Decoded PDF from base64, size (bytes):', pdfBuffer.length);
    } catch (e) {
      if (isDev) console.log('Failed to decode base64 PDF');
      return res.status(400).json({ success: false, message: 'Invalid base64 PDF data' });
    }
  } else {
    if (isDev) console.log('No PDF provided');
    return res.status(400).json({ success: false, message: 'PDF file is required' });
  }

  // 1️⃣ Generate a unique 6‑char code
  let code;
  for (let i = 0; i < 5; i++) { // try a few times before giving up
    const candidate = generateSessionCode();
    const exists = await Session.findOne({ code: candidate }).lean();
    if (!exists) {
      code = candidate;
      break;
    }
  }
  if (!code) {
      if (isDev) console.log('Failed to generate unique code');
    return res.status(500).json({ success: false, message: 'Could not generate unique session code' });
  }
    if (isDev) console.log('Generated session code:', code);


  // 2️⃣ Store PDF in GridFS and capture the file id after the upload finishes
  const db = mongoose.connection.db;
  const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'sessionPdfs' });
  const uploadStream = bucket.openUploadStream(code, {
    contentType: 'application/pdf',
    metadata: { lecturerId: ownerId }
  });

  // pipe the buffer (from either multer or base64) into the upload stream
  uploadStream.end(pdfBuffer);



  // Wait for the stream to finish, then use the generated file id
  await new Promise((resolve, reject) => {
    uploadStream.on('error', reject);


    uploadStream.on('finish', resolve);
  });

  const pdfFileId = uploadStream.id; // GridFS generated ObjectId for the file
  if (isDev) console.log('PDF stored in GridFS with _id:', pdfFileId);

  // 3️⃣ Persist the Session document (owner is automatically a participant)
  const session = new Session({
    code,
    owner: ownerId,

    pdfFileId,
    participants: [ownerId],
    title: title || `Session:(${code})`
  });
  await session.save();
    if (isDev) console.log('Session saved to DB with _id:', session._id);

  // 4️⃣ Respond with the short code and a URL to fetch the PDF later
  return res.status(201).json({
    success: true,
    message: 'Session created',
    data: {
      code: session.code,
      pdfUrl: `/api/sessions/${session.code}/pdf`,
      title: session.title
    }
  });
  } catch (err) {
    console.error('SERVER ERROR in createSession:', err);
    return res.status(500).json({ success: false, message: 'Internal server error', data: null });
}
}

/**
 * GET /api/sessions/:code/pdf
 * Streams the stored PDF to an authorized participant or the owner.
 */
async function streamPdf(req, res) {
  const { code } = req.params;
  const session = await Session.findOne({ code }).lean().exec();
  if (!session) {
    return res.status(404).json({ success: false, message: 'Session not found' });
  }

  const db = mongoose.connection.db;
  const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'sessionPdfs' });
  const downloadStream = bucket.openDownloadStream(session.pdfFileId);

  res.set('Content-Type', 'application/pdf');
  downloadStream.pipe(res);
}

/**
 * POST /api/sessions/:code/join
 * Adds the logged‑in student to the participants array (idempotent).
 */
async function joinSession(req, res) {
  const { code } = req.params;
  const { userId } = req.body; // student or any user joining
  if (!userId) {
    return res.status(400).json({ success: false, message: 'userId is required to join' });
  }
  // Prevent a lecturer from "joining" as a participant (they are already owner)
  const session = await Session.findOne({ code }).exec();
  if (!session) {
    return res.status(404).json({ success: false, message: 'Invalid session code' });
  }

  // If the requester is the owner, we simply return success – they are already a participant.
  if (session.owner.toString() === userId.toString()) {
    return res.status(200).json({
      success: true,
      message: 'Owner accessed session',
      data: { code, pdfUrl: `/api/sessions/${code}/pdf` }
    });
  }

  // Use $addToSet to avoid duplicates.
  await Session.updateOne({ code }, { $addToSet: { participants: userId } }).exec();

  // Placeholder for real‑time notification (later you can emit via socket.io)
  // if (global.io) { global.io.to(code).emit('participant:joined', { userId }); }

  return res.status(200).json({
    success: true,
    message: 'Joined session',
    data: { code, pdfUrl: `/api/sessions/${code}/pdf` }
  });
}

/**
 * GET /api/sessions/:code
 * Returns session metadata (no PDF, no questions).
 */
async function getSessionInfo(req, res) {
  const { code } = req.params;
  const session = await Session.findOne({ code })
    .lean()
    .exec();

  if (!session) {
    return res.status(404).json({ success: false, message: 'Session not found' });
  }

  return res.status(200).json({
    success: true,
    data: {
      code: session.code,
      ownerId: session.owner,
      createdAt: session.createdAt,
      participantsCount: session.participants.length
    }
  });
}

/**
 * DELETE /api/sessions/:code
 * Removes a session and its PDF from GridFS.
 * Only the owner (lecturer) can delete.
 * Note: Ownership is verified by requireOwner middleware before this is called.
 */
async function deleteSession(req, res) {
  // req.session is attached by the requireOwner middleware
  const session = req.session;
  if (!session) {
    return res.status(404).json({ success: false, message: 'Session not found' });
  }

  // Delete the session (pre-deleteOne hook will clean up the GridFS file)
  await session.deleteOne();

  return res.status(200).json({ success: true, message: 'Session deleted' });
}

/**
 * GET /api/sessions
 * Returns metadata for *all* sessions (no PDF data). Useful for an admin view.
 * The response contains code, ownerId, createdAt, participantsCount.
 */
async function listAllSessions(req, res) {
  const sessions = await Session.find({})
    .select('code title owner createdAt participants')
    .lean()
    .exec();

  const payload = sessions.map(s => ({
    code: s.code,
    ownerId: s.owner,
    createdAt: s.createdAt,
    participantsCount: s.participants.length
  }));

  return res.status(200).json({ success: true, data: payload });
}

/**
 * GET /api/sessions/:code/participants
 * Returns the full list of participant ObjectIds (or minimal user data).
 */
async function listParticipants(req, res) {
  const { code } = req.params;
  const session = await Session.findOne({ code })
    .populate('participants', 'firstName lastName email')
    .lean()
    .exec();

  if (!session) {
    return res.status(404).json({ success: false, message: 'Session not found' });
  }

  return res.status(200).json({
    success: true,
    data: session.participants.map(p => ({
      id: p._id,
      firstName: p.firstName,
      lastName: p.lastName,
      email: p.email
    }))
  });
}

/**
 * GET /api/sessions/recent
 * Returns a limited number of the most recent sessions for a specific user.
 */
async function getRecentSessions(req,res) {
  const { userId, limit = 5 } = req.query; 
  const max = Math.min(parseInt(limit, 10) || 5, 50); // Default to 5 if limit isn't provided or is invalid, capped at 50

  if(!userId) {
    return res.status(400).json({
      success: false, 
      message: 'userId is required'
    });
  }

  try { 
    const sessions = await Session.find( { participants: userId } )
      .sort({ createdAt: -1 })
      .limit(max)
      .select('code title createdAt participants')
      .lean()
      .exec();

    const payload = sessions.map(session => ({
      id: session.code,
      title: `(${session.title })`,
      date: session.createdAt
    }));

    return res.status(200).json({ success:true, data:payload });
  } catch(err) { 
    console.error('SERVER ERROR in getRecentSessions:', err)
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching recent sessions',
    });
  };
}


/**
 * DELETE /api/sessions/cleanup/orphaned
 * Finds all PDFs in GridFS that are not referenced by any session and deletes them.
 * Admin/test endpoint to clean up accidentally uploaded PDFs without sessions.
 */
async function cleanupOrphanPdfs(req, res) {
  try {
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'sessionPdfs' });

    // Get all files from GridFS
    const allFiles = await db.collection('sessionPdfs.files').find({}).toArray();
    if (!allFiles || allFiles.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No PDF files found in GridFS',
        data: { deletedCount: 0 }
      });
    }

    // Get all pdfFileIds referenced by sessions
    const sessions = await Session.find({}).select('pdfFileId').lean().exec();
    const referencedFileIds = new Set(sessions.map(s => s.pdfFileId.toString()));

    // Find orphaned files (those not referenced by any session)
    const orphanedFiles = allFiles.filter(
      file => !referencedFileIds.has(file._id.toString())
    );

    if (orphanedFiles.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No orphaned PDFs found',
        data: { deletedCount: 0 }
      });
    }

    // Delete each orphaned file
    let deletedCount = 0;
    for (const file of orphanedFiles) {
      try {
        await bucket.delete(file._id);
        deletedCount++;
        console.log(`Deleted orphaned GridFS file: ${file._id}`);
      } catch (err) {
        console.warn(`Failed to delete orphaned file ${file._id}:`, err);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Cleanup complete: ${deletedCount} orphaned PDF(s) deleted`,
      data: { deletedCount, orphanedFileIds: orphanedFiles.map(f => f._id) }
    });
  } catch (err) {
    console.error('ERROR in cleanupOrphanPdfs:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during cleanup',
      data: null
    });
  }
}

module.exports = {
  // middlewares (now just upload)
  upload,
  // controller functions
  createSession,
  streamPdf,
  joinSession,
  getSessionInfo,
  deleteSession,
  listAllSessions,
  listParticipants,
  getRecentSessions,
  cleanupOrphanPdfs
};

