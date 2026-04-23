const jwt = require('jsonwebtoken');
const CommitteeUser = require('../models/committeeUser.model');
const Participant = require('../models/participant.model');

// Middleware for Committee Users (Admin, Reviewer, Editor)
async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided.' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await CommitteeUser.findById(decoded.id).select('-passwordHash');
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User not found or inactive.' });
    }
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

// Middleware for Participants (regular users)
async function protectParticipant(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided.' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if it's a participant token
    if (decoded.participantId) {
      const participant = await Participant.findById(decoded.participantId).select('-password');
      if (!participant) {
        return res.status(401).json({ message: 'User not found.' });
      }
      req.participant = participant;
      return next();
    }
    
    // Also allow committee users
    if (decoded.id) {
      const user = await CommitteeUser.findById(decoded.id).select('-passwordHash');
      if (!user || !user.isActive) {
        return res.status(401).json({ message: 'User not found or inactive.' });
      }
      req.user = user;
      req.participant = { participantId: user._id }; // Fallback for admin
      return next();
    }
    
    return res.status(401).json({ message: 'Invalid token.' });
  } catch {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions.' });
    }
    next();
  };
}

module.exports = { protect, protectParticipant, requireRole };
