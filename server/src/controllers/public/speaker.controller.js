const Speaker = require('../../models/speaker.model');
const Conference = require('../../models/conference.model');

async function getSpeakers(req, res) {
  const conference = await Conference.findOne({ isActive: true });
  if (!conference) {
    return res.status(404).json({ message: 'No active conference found.' });
  }
  const speakers = await Speaker.find({ conferenceId: conference._id });
  res.json(speakers);
}

async function getSpeakerById(req, res) {
  const speaker = await Speaker.findById(req.params.id);
  if (!speaker) {
    return res.status(404).json({ message: 'Speaker not found.' });
  }
  res.json(speaker);
}

module.exports = { getSpeakers, getSpeakerById };
