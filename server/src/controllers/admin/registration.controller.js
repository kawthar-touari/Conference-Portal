const Registration = require('../../models/registration.model');

async function getRegistrations(req, res) {
  try {
    const { status, search } = req.query;
    
    let query = {};
    if (status) query.registrationStatus = status;
    if (search) {
      // This would require text index on participant data, simplified for now
      query.registrationId = new RegExp(search, 'i');
    }

    const registrations = await Registration.find(query)
      .populate('participantId', 'fullName email phoneNumber')
      .populate('conferenceId', 'name')
      .sort({ registeredAt: -1 });
    
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getRegistrationById(req, res) {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate('participantId')
      .populate('conferenceId', 'name');
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found.' });
    }
    
    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateRegistration(req, res) {
  try {
    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('participantId')
      .populate('conferenceId', 'name');
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found.' });
    }
    
    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteRegistration(req, res) {
  try {
    const registration = await Registration.findByIdAndDelete(req.params.id);
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found.' });
    }
    
    res.json({ message: 'Registration deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getRegistrations, getRegistrationById, updateRegistration, deleteRegistration };