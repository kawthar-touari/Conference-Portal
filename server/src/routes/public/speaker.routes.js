const express = require('express');
const router = express.Router();
const { getSpeakers, getSpeakerById } = require('../../controllers/public/speaker.controller');

router.get('/speakers', getSpeakers);
router.get('/speakers/:id', getSpeakerById);

module.exports = router;