const CommitteeMember = require('../../models/committeeMember.model');
const Conference = require('../../models/conference.model');

async function getCommitteeMembers(req, res) {
  try {
    const committeeMembers = await CommitteeMember.find()
      .populate('conferenceId', 'name')
      .sort({ team: 1, displayOrder: 1 });
    
    res.json(committeeMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createCommitteeMember(req, res) {
  try {
    const conference = await Conference.findOne({ isActive: true });
    if (!conference) {
      return res.status(404).json({ message: 'No active conference found.' });
    }

    const committeeMember = await CommitteeMember.create({
      ...req.body,
      conferenceId: conference._id
    });
    
    res.status(201).json(committeeMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateCommitteeMember(req, res) {
  try {
    const committeeMember = await CommitteeMember.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('conferenceId', 'name');
    
    if (!committeeMember) {
      return res.status(404).json({ message: 'Committee member not found.' });
    }
    
    res.json(committeeMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteCommitteeMember(req, res) {
  try {
    const committeeMember = await CommitteeMember.findByIdAndDelete(req.params.id);
    
    if (!committeeMember) {
      return res.status(404).json({ message: 'Committee member not found.' });
    }
    
    res.json({ message: 'Committee member deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getCommitteeMembers, createCommitteeMember, updateCommitteeMember, deleteCommitteeMember };