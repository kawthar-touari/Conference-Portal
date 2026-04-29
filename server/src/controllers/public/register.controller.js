const Conference = require('../../models/conference.model');
const Participant = require('../../models/participant.model');
const Registration = require('../../models/registration.model');

async function register (data, conferenceId) {
  const { fullName, email, password, phone, affiliation, country, participantType } = data;
  // Find or create participant
  let participant = await Participant.findOne({ email });
  let alreadyRegistered = false;

  if (!participant) {
    // Create new participant – password will be hashed by schema pre('save')
    participant = await Participant.create({
      fullName,
      email,
      password,          // ← MUST be included here
      phone,
      affiliation,
      country,
      participantType
    });
  }

  // If a conference ID is provided, handle registration
  let registration = null;
  if (conferenceId) {
    // Check if already registered for this conference
    const existingReg = await Registration.findOne({
      conferenceId,
      participantId: participant._id
    });
    
    if (existingReg) {
      alreadyRegistered = true;
      registration = existingReg;
    } else {
      registration = await Registration.create({
        conferenceId,
        participantId: participant._id,
        registrationStatus: 'REGISTERED',
        registeredAt: new Date()
      });
    }
  }

  return {
    participant,
    registration,
    alreadyRegistered
  };
}

module.exports = { register };
