const { verifyCertificate, generateParticipantCertificate } = require('../../services/certificate.service');
const Certificate = require('../../models/certificate.model');

async function verify(req, res) {
  try {
    const cert = await verifyCertificate(req.params.code);
    res.json(cert);
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
}

async function checkCertificate(req, res) {
  try {
    const { registrationId } = req.body;
    
    const registration = await Certificate.findOne({ registrationIdRef: registrationId })
      .populate('participantId', 'fullName email')
      .populate('conferenceId', 'name');
    
    if (!registration) {
      return res.json({ message: 'Certificate has not been generated yet.' });
    }
    
    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { verify, checkCertificate };
