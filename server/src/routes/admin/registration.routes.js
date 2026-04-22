const express = require('express');
const router = express.Router();
const { getRegistrations, getRegistrationById, updateRegistration, deleteRegistration } = require('../../controllers/admin/registration.controller');

router.get('/registrations', getRegistrations);
router.get('/registrations/:id', getRegistrationById);
router.put('/registrations/:id', updateRegistration);
router.delete('/registrations/:id', deleteRegistration);

module.exports = router;