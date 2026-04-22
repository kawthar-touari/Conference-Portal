const express = require('express');
const router = express.Router();
const { getCommitteeMembers } = require('../../controllers/public/committee.controller');

router.get('/committee', getCommitteeMembers);

module.exports = router;