const Participant  = require('../models/participant.model');
const Registration = require('../models/registration.model');
const Conference = require('../models/conference.model');

async function registerParticipant(payload, conferenceId) {
  let participant = await Participant.findOne({ email: payload.email.toLowerCase() });
  if (!participant) {
    participant = await Participant.create({
      fullName:        payload.fullName,
      email:           payload.email,
      phone:           payload.phone,
      affiliation:     payload.affiliation,
      country:         payload.country,
      participantType: payload.participantType || 'ATTENDEE'
    });
  }

  // If conferenceId is provided, create registration for that conference
  if (conferenceId) {
    const existing = await Registration.findOne({ conferenceId, participantId: participant._id });
    if (existing) return { registration: existing, participant, alreadyRegistered: true };

    const registration = await Registration.create({
      conferenceId,
      participantId: participant._id,
      notes: payload.notes
    });

    return { registration, participant, alreadyRegistered: false };
  }

  // Return participant without registration if no conference specified
  return { participant, alreadyRegistered: false };
}

module.exports = { registerParticipant };
