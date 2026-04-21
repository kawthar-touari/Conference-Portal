const Submission = require('../../models/submission.model');
const Registration = require('../../models/registration.model');
const Speaker = require('../../models/speaker.model');
const Certificate = require('../../models/certificate.model');

async function getStats(req, res) {
  try {
    const totalSubmissions = await Submission.countDocuments();
    const totalRegistrations = await Registration.countDocuments();
    const totalSpeakers = await Speaker.countDocuments();
    const totalCertificates = await Certificate.countDocuments();

    // Count submissions by status
    const submissionsByStatus = {};
    const statuses = ['PENDING', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'PUBLISHED'];
    
    for (const status of statuses) {
      submissionsByStatus[status] = await Submission.countDocuments({ status });
    }

    res.json({
      totalSubmissions,
      totalRegistrations,
      totalSpeakers,
      totalCertificates,
      submissionsByStatus
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getStats };
