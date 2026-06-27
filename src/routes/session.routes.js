// src/routes/session.routes.js

const express = require('express');
const sessionCtrl = require('../controllers/sessionController.js');
const { requireAuth, requireOwner } = require('../middleware/auth.js');

const router = express.Router();

/* END SESSION ROUTES */
router.post("/:code/end", sessionCtrl.endSession);
/**
 * GET    /api/sessions – list all sessions (metadata only)
 */
router.get('/', sessionCtrl.listAllSessions);

/*
 * GET    /api/sessions/recent – get most recent sessions for a user
 * IMPORTANT: This must be declared BEFORE /:code so "recent" isn't treated as a code.
 */
router.get('/recent', sessionCtrl.getRecentSessions);

/**
 * DELETE /api/sessions/cleanup/orphaned – cleanup orphaned PDFs (admin endpoint)
 *   – requires authentication
 *   – MUST be before /:code routes to avoid wildcard collision
 */
router.delete('/cleanup/orphaned', requireAuth, sessionCtrl.cleanupOrphanPdfs);

/**
 * POST   /api/sessions
 *   – multipart/form-data (field "pdf")
 *   – body must include "ownerId" (the lecturer's ObjectId)
 *   – requires authentication (x-user-id header)
 */
router.post('/', requireAuth, sessionCtrl.upload.single('pdf'), sessionCtrl.createSession);


/*
DELETE /api/sessions/cleanup/participant/:userId – delete all sessions that contain the given participant, DEBUG function!
 */
router.delete('/cleanup/participant/:userId', sessionCtrl.deleteSessionsByparticipant);

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
 * GET    /api/sessions/:code/participants – list participants of a session
 */
router.get('/:code/participants', sessionCtrl.listParticipants);

/**
 * DELETE /api/sessions/:code – delete a session
 *   – requires authentication and must be session owner
 */
router.delete('/:code', requireAuth, requireOwner, sessionCtrl.deleteSession);

module.exports = router;