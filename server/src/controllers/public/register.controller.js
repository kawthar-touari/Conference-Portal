const { registerParticipant } = require('../../services/registration.service');
const Conference = require('../../models/conference.model');

async function register(req, res) {
  try {
    // Allow registration without an active conference (just create participant account)
    let conference = null;
    if (req.body.conferenceId) {
      conference = await Conference.findById(req.body.conferenceId);
      if (!conference) {
        return res.status(404).json({ message: 'Conference not found.' });
      }
    } else {
      // If no conferenceId provided, try to find active conference
      conference = await Conference.findOne({ isActive: true });
    }

    const result = await registerParticipant(req.body, conference ? conference._id : null);
    
    res.json({
      registrationId: result.registration ? result.registration.registrationId : null,
      participantId: result.participant._id,
      alreadyRegistered: result.alreadyRegistered,
      message: conference 
        ? (result.alreadyRegistered ? 'Already registered for this conference' : 'Successfully registered for the conference')
        : 'Account created successfully. You can now register for conferences.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { register };
