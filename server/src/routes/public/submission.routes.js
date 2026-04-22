const express = require('express');
const router = express.Router();
const { submitPaper, getStatus } = require('../../controllers/public/submission.controller');

router.post('/submit', submitPaper);
router.get('/submission-status', getStatus);

module.exports = router;