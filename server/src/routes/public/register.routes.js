const express = require('express');
const router = express.Router();
const { register } = require('../../controllers/public/register.controller');

router.post('/register', register);

module.exports = router;