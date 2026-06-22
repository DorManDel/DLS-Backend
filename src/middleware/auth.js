/**
 * Simple authentication middleware for testing
 * For PoC: Extract userId from request headers (x-user-id)
 * Later: Replace with proper JWT or session auth
 */

function requireAuth(req, res, next) {
  const userId = req.headers['x-user-id'] || req.body.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Provide userId in x-user-id header or userId in body.'
    });
  }

  // Attach userId to request for use in controllers
  req.userId = userId;
  next();
}

/**
 * Verify that the user owns the session (lecturer verification)
 * For PoC: Just check that userId matches session.owner
 */
async function requireOwner(req, res, next) {
  const { code } = req.params;
  const userId = req.userId;

  try {
    const Session = require('../models/Session');
    const session = await Session.findOne({ code }).exec();
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (session.owner !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only the session owner can perform this action'
      });
    }

    // Attach session to request for use in controller
    req.session = session;
    next();
  } catch (err) {
    console.error('Error in requireOwner middleware:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = { requireAuth, requireOwner };
