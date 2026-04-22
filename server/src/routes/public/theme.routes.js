const express = require('express');
const router = express.Router();
const { getThemes } = require('../../controllers/public/theme.controller');

router.get('/themes', getThemes);

module.exports = router;