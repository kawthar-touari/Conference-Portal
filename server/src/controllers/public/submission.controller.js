const { createSubmission, trackSubmission } = require('../../services/submission.service');
const Conference = require('../../models/conference.model');

async function submitPaper(req, res) {
  try {
    const conference = await Conference.findOne({ isActive: true });
    if (!conference) {
      return res.status(404).json({ message: 'No active conference found.' });
    }

    const submission = await createSubmission(req.body, conference._id);
    
    res.json({
      submissionId: submission.submissionId,
      ...submission.toObject()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getStatus(req, res) {
  try {
    const { submissionId, email, paperTitle } = req.query;
    
    if (!submissionId && (!email || !paperTitle)) {
      return res.status(400).json({ message: 'Provide submissionId OR both email and paperTitle.' });
    }

    const submission = await trackSubmission({ submissionId, email, paperTitle });
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found.' });
    }

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { submitPaper, getStatus };
