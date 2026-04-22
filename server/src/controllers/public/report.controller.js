const Report = require('../models/report.model');

// Create a new report (for participants)
async function createReport(req, res) {
  try {
    const { conferenceId, title, content } = req.body;
    
    // Find participant by email (passed in body or from auth if implemented)
    const Participant = require('../models/participant.model');
    const participant = await Participant.findOne({ email: req.body.participantEmail });
    
    if (!participant) {
      return res.status(404).json({ message: 'Participant not found. Please register first.' });
    }

    const report = await Report.create({
      conference: conferenceId,
      participant: participant._id,
      title,
      content
    });

    res.status(201).json({
      message: 'Report submitted successfully',
      report
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Get all reports for a conference (public or admin)
async function getConferenceReports(req, res) {
  try {
    const { conferenceId } = req.params;
    
    const reports = await Report.find({ conference: conferenceId })
      .populate('participant', 'fullName affiliation')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Admin: Update report status
async function updateReportStatus(req, res) {
  try {
    const { reportId } = req.params;
    const { status } = req.body;

    const report = await Report.findByIdAndUpdate(
      reportId,
      { status },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({ message: 'Report status updated', report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Admin: Get all reports with filtering
async function getAllReports(req, res) {
  try {
    const { conferenceId, status } = req.query;
    
    const query = {};
    if (conferenceId) query.conference = conferenceId;
    if (status) query.status = status;

    const reports = await Report.find(query)
      .populate('conference', 'title startDate')
      .populate('participant', 'fullName email affiliation')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createReport,
  getConferenceReports,
  updateReportStatus,
  getAllReports
};
