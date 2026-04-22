const express = require('express');
const router = express.Router();
const { getSpeakers, createSpeaker, updateSpeaker, deleteSpeaker } = require('../../controllers/admin/speaker.controller');

router.get('/speakers', getSpeakers);
router.post('/speakers', createSpeaker);
router.put('/speakers/:id', updateSpeaker);
router.delete('/speakers/:id', deleteSpeaker);

module.exports = router;