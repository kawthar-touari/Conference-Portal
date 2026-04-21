const Submission = require('../../models/submission.model');
const { SUBMISSION_STATUSES } = require('../../constants/enums');

async function getSubmissions(req, res) {
  try {
    const { status, themeId, search } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (themeId) query.themeId = themeId;
    if (search) {
      query.$text = { $search: search };
    }

    const submissions = await Submission.find(query)
      .populate('themeId', 'code label')
      .sort({ submittedAt: -1 });
    
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getSubmissionById(req, res) {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('themeId', 'code label')
      .populate('conferenceId', 'name');
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found.' });
    }
    
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateStatus(req, res) {
  try {
    const { status, reviewComment } = req.body;
    
    if (!SUBMISSION_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { status, reviewComment },
      { new: true, runValidators: true }
    );
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found.' });
    }
    
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getSubmissions, getSubmissionById, updateStatus };
