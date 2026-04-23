const express = require('express');
const router = express.Router();
const { getAgenda, getCurrentSession, bookSession, getTopRatedSpeakers, rateSpeaker } = require('../../controllers/public/session.controller');
const { protectParticipant } = require('../../middleware/auth.middleware');

router.get('/agenda', getAgenda);
router.get('/current-session', getCurrentSession);
router.get('/speakers/top-rated', getTopRatedSpeakers);
router.post('/book', protectParticipant, bookSession);
router.post('/speakers/rate', protectParticipant, rateSpeaker);

module.exports = router;