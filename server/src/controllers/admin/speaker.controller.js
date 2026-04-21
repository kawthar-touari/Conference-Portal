const Speaker = require('../../models/speaker.model');
const Conference = require('../../models/conference.model');

async function getSpeakers(req, res) {
  try {
    const speakers = await Speaker.find();
    res.json(speakers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createSpeaker(req, res) {
  try {
    const conference = await Conference.findOne({ isActive: true });
    if (!conference) {
      return res.status(404).json({ message: 'No active conference found.' });
    }

    const speaker = await Speaker.create({
      ...req.body,
      conferenceId: conference._id
    });
    
    res.status(201).json(speaker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateSpeaker(req, res) {
  try {
    const speaker = await Speaker.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!speaker) {
      return res.status(404).json({ message: 'Speaker not found.' });
    }
    
    res.json(speaker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteSpeaker(req, res) {
  try {
    const speaker = await Speaker.findByIdAndDelete(req.params.id);
    
    if (!speaker) {
      return res.status(404).json({ message: 'Speaker not found.' });
    }
    
    res.json({ message: 'Speaker deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getSpeakers, createSpeaker, updateSpeaker, deleteSpeaker };
