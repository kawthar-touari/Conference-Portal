const Session = require('../../models/session.model');

async function getSessions(req, res) {
  try {
    const sessions = await Session.find()
      .populate('themeId', 'code label')
      .populate('speakerId', 'fullName academicTitle')
      .sort({ startsAt: 1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createSession(req, res) {
  try {
    const session = await Session.create(req.body);
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateSession(req, res) {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }
    
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteSession(req, res) {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }
    
    res.json({ message: 'Session deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getSessions, createSession, updateSession, deleteSession };
