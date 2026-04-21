const { registerParticipant } = require('../../services/registration.service');
const Conference = require('../../models/conference.model');

async function register(req, res) {
  try {
    const conference = await Conference.findOne({ isActive: true });
    if (!conference) {
      return res.status(404).json({ message: 'No active conference found.' });
    }

    const result = await registerParticipant(req.body, conference._id);
    
    res.json({
      registrationId: result.registration.registrationId,
      alreadyRegistered: result.alreadyRegistered
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { register };
