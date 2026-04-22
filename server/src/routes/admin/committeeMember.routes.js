const express = require('express');
const router = express.Router();
const { getCommitteeMembers, createCommitteeMember, updateCommitteeMember, deleteCommitteeMember } = require('../../controllers/admin/committeeMember.controller');

router.get('/committee-members', getCommitteeMembers);
router.post('/committee-members', createCommitteeMember);
router.put('/committee-members/:id', updateCommitteeMember);
router.delete('/committee-members/:id', deleteCommitteeMember);

module.exports = router;