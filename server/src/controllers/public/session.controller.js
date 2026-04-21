const Session = require('../../models/session.model');
const Conference = require('../../models/conference.model');

async function getAgenda(req, res) {
  const conference = await Conference.findOne({ isActive: true });
  if (!conference) {
    return res.status(404).json({ message: 'No active conference found.' });
  }
  const sessions = await Session.find({ conferenceId: conference._id })
    .populate('themeId', 'code label')
    .populate('speakerId', 'fullName academicTitle topic photoUrl')
    .sort({ startsAt: 1 });
  res.json(sessions);
}

async function getCurrentSession(req, res) {
  const now = new Date();
  const session = await Session.findOne({
    startsAt: { $lte: now },
    endsAt: { $gte: now }
  })
    .populate('themeId', 'code label')
    .populate('speakerId', 'fullName academicTitle topic photoUrl');
  
  res.json(session || null);
}

module.exports = { getAgenda, getCurrentSession };
