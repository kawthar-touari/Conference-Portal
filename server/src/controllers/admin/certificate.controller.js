const Certificate = require('../../models/certificate.model');
const { generateParticipantCertificate } = require('../../services/certificate.service');

async function getCertificates(req, res) {
  try {
    const { status, search } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { certificateId: new RegExp(search, 'i') },
        { ownerName: new RegExp(search, 'i') },
        { ownerEmail: new RegExp(search, 'i') }
      ];
    }

    const certificates = await Certificate.find(query)
      .populate('participantId', 'fullName email')
      .populate('conferenceId', 'name')
      .sort({ issueDate: -1 });
    
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getCertificateById(req, res) {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate('participantId')
      .populate('conferenceId', 'name')
      .populate('registrationIdRef');
    
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found.' });
    }
    
    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function generateCertificate(req, res) {
  try {
    const { registrationId } = req.body;
    
    if (!registrationId) {
      return res.status(400).json({ message: 'Registration ID is required.' });
    }

    const result = await generateParticipantCertificate(registrationId);
    
    res.json(result);
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
}

async function updateCertificate(req, res) {
  try {
    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('participantId')
      .populate('conferenceId', 'name');
    
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found.' });
    }
    
    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getCertificates, getCertificateById, generateCertificate, updateCertificate };