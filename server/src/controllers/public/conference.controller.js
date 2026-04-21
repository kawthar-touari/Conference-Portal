const Conference = require('../../models/conference.model');

async function getActiveConference(req, res) {
  const conference = await Conference.findOne({ isActive: true });
  if (!conference) {
    return res.status(404).json({ message: 'No active conference found.' });
  }
  res.json(conference);
}

module.exports = { getActiveConference };
