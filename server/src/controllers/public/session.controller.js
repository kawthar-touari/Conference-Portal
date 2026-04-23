const Session = require('../../models/session.model');
const Conference = require('../../models/conference.model');
const Speaker = require('../../models/speaker.model');

async function getAgenda(req, res) {
  const conference = await Conference.findOne({ isActive: true });
  if (!conference) {
    // Return all sessions even without active conference for browsing
    const sessions = await Session.find()
      .populate('themeId', 'code label')
      .populate('speakerId', 'fullName academicTitle topic photoUrl averageRating')
      .sort({ startsAt: 1 });
    return res.json(sessions);
  }
  const sessions = await Session.find({ conferenceId: conference._id })
    .populate('themeId', 'code label')
    .populate('speakerId', 'fullName academicTitle topic photoUrl averageRating')
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
    .populate('speakerId', 'fullName academicTitle topic photoUrl averageRating');

  res.json(session || null);
}

// Book a session (requires authentication)
async function bookSession(req, res) {
  try {
    const { sessionId } = req.body;
    const participantId = req.participant.participantId; // From auth middleware

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    await session.bookParticipant(participantId);
    
    res.json({ 
      message: 'Successfully booked for this session',
      sessionId: session._id,
      spotsRemaining: session.maxAttendees - session.bookedParticipants.length
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Get top-rated speakers
async function getTopRatedSpeakers(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const speakers = await Speaker.find()
      .sort({ averageRating: -1, totalRatings: -1 })
      .limit(limit)
      .populate('conferenceId', 'name');
    
    res.json(speakers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Rate a speaker (requires authentication)
async function rateSpeaker(req, res) {
  try {
    const { speakerId, rating, comment } = req.body;
    const participantId = req.participant.participantId;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const speaker = await Speaker.findById(speakerId);
    if (!speaker) {
      return res.status(404).json({ message: 'Speaker not found' });
    }

    await speaker.addRating(participantId, rating, comment || '');
    
    res.json({ 
      message: 'Rating submitted successfully',
      averageRating: speaker.averageRating,
      totalRatings: speaker.totalRatings
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = { getAgenda, getCurrentSession, bookSession, getTopRatedSpeakers, rateSpeaker };
