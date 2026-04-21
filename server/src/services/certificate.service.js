const Registration = require('../models/registration.model');
const Participant  = require('../models/participant.model');
const Conference   = require('../models/conference.model');
const Certificate  = require('../models/certificate.model');

async function generateParticipantCertificate(registrationIdValue) {
  const registration = await Registration.findOne({ registrationId: registrationIdValue });
  if (!registration) throw Object.assign(new Error('Registration not found.'), { status: 404 });

  if (!registration.attendanceConfirmed && registration.registrationStatus !== 'CONFIRMED') {
    throw Object.assign(new Error('Participant is not eligible for a certificate yet.'), { status: 400 });
  }

  const existing = await Certificate.findOne({ registrationIdRef: registration._id });
  if (existing) return existing;

  const participant = await Participant.findById(registration.participantId);
  const conference  = await Conference.findById(registration.conferenceId);

  const certificate = await Certificate.create({
    conferenceId:      conference._id,
    registrationIdRef: registration._id,
    participantId:     participant._id,
    ownerName:         participant.fullName,
    ownerEmail:        participant.email,
    certificateType:   'PARTICIPANT'
  });

  return {
    certificate,
    previewData: {
      conferenceName:   conference.name,
      ownerName:        participant.fullName,
      eventDate:        conference.endDate,
      certificateId:    certificate.certificateId,
      verificationCode: certificate.verificationCode
    }
  };
}

async function verifyCertificate(code) {
  const cert = await Certificate.findOne({ verificationCode: code.toUpperCase() })
    .populate('conferenceId', 'name startDate endDate');
  if (!cert) throw Object.assign(new Error('Certificate not found.'), { status: 404 });
  return cert;
}

module.exports = { generateParticipantCertificate, verifyCertificate };
