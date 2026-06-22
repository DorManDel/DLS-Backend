// src/routes/session.routes.js
// Remove authentication middleware – PoC accepts IDs in request bodies
// No requireAuth / requireLecturer needed for this proof‑of‑concept

const express = require('express');
const sessionCtrl = require('../controllers/sessionController');

const router = express.Router();

/**
 * POST   /api/sessions
 *   – multipart/form-data (field "pdf")
 *   – body must include "ownerId" (the lecturer's ObjectId)
 */
router.post('/', sessionCtrl.upload.single('pdf'), sessionCtrl.createSession);
/**
 * GET    /api/sessions/:code/pdf – stream the PDF (any user that knows the code may fetch it)
 */
router.get('/:code/pdf', sessionCtrl.streamPdf);

/**
 * POST   /api/sessions/:code/join – add a participant (body field "userId")
 */
router.post('/:code/join', sessionCtrl.joinSession);

/**
 * GET    /api/sessions/:code – session metadata (no PDF)
 */
router.get('/:code', sessionCtrl.getSessionInfo);

/**
 * DELETE /api/sessions/:code – delete a session (no owner check for PoC)
 */
router.delete('/:code', sessionCtrl.deleteSession);

/**
 * GET    /api/sessions – list all sessions (metadata only)
 */
router.get('/', sessionCtrl.listAllSessions);

/**
 * GET    /api/sessions/:code/participants – list participants of a session
 */
router.get('/:code/participants', sessionCtrl.listParticipants);

module.exports = router;

