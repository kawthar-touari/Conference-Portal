const express = require('express');
const router = express.Router();
const { getAgenda, getCurrentSession } = require('../../controllers/public/session.controller');

router.get('/agenda', getAgenda);
router.get('/current-session', getCurrentSession);

module.exports = router;