const CommitteeMember = require('../../models/committeeMember.model');

async function getCommitteeMembers(req, res) {
  const members = await CommitteeMember.find({ isVisible: true })
    .sort({ team: 1, displayOrder: 1 });
  
  // Group by team
  const grouped = members.reduce((acc, member) => {
    if (!acc[member.team]) {
      acc[member.team] = [];
    }
    acc[member.team].push(member);
    return acc;
  }, {});
  
  res.json(grouped);
}

module.exports = { getCommitteeMembers };
