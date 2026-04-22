const express = require('express');
const router = express.Router();
const { verify, checkCertificate } = require('../../controllers/public/certificate.controller');

router.get('/certificate/:code', verify);
router.post('/certificate-check', checkCertificate);

module.exports = router;