const Theme = require('../../models/theme.model');
const Conference = require('../../models/conference.model');

async function getThemes(req, res) {
  const conference = await Conference.findOne({ isActive: true });
  if (!conference) {
    return res.status(404).json({ message: 'No active conference found.' });
  }
  const themes = await Theme.find({ conferenceId: conference._id }).sort({ displayOrder: 1 });
  res.json(themes);
}

module.exports = { getThemes };
