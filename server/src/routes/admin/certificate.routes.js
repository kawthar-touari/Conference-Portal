const express = require('express');
const router = express.Router();
const { getCertificates, getCertificateById, generateCertificate, updateCertificate } = require('../../controllers/admin/certificate.controller');

router.get('/certificates', getCertificates);
router.get('/certificates/:id', getCertificateById);
router.post('/certificates/generate', generateCertificate);
router.put('/certificates/:id', updateCertificate);

module.exports = router;