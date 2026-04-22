const express = require('express');
const router = express.Router();
const { getSessions, createSession, updateSession, deleteSession } = require('../../controllers/admin/session.controller');

router.get('/sessions', getSessions);
router.post('/sessions', createSession);
router.put('/sessions/:id', updateSession);
router.delete('/sessions/:id', deleteSession);

module.exports = router;