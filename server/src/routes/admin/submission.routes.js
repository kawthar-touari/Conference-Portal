const express = require('express');
const router = express.Router();
const { getSubmissions, getSubmissionById, updateStatus } = require('../../controllers/admin/submission.controller');

router.get('/submissions', getSubmissions);
router.get('/submissions/:id', getSubmissionById);
router.put('/submissions/:id/status', updateStatus);

module.exports = router;