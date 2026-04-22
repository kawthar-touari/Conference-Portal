const express = require('express');
const router = express.Router();
const { getActiveConference } = require('../../controllers/public/conference.controller');

router.get('/conference', getActiveConference);

module.exports = router;