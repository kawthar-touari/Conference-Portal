const express = require('express');
const router = express.Router();
const Participant = require('../../models/participant.model');
const jwt = require('jsonwebtoken');

// Register new participant account (no conference required)
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password, phone, affiliation, country, participantType } = req.body;

    // Check if user already exists
    const existing = await Participant.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new participant
    const participant = await Participant.create({
      fullName,
      email: email.toLowerCase(),
      password,
      phone,
      affiliation,
      country,
      participantType: participantType || 'ATTENDEE'
    });

    // Generate JWT token
    const token = jwt.sign(
      { participantId: participant._id, email: participant.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account created successfully',
      participantId: participant._id,
      fullName: participant.fullName,
      email: participant.email,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login participant
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const participant = await Participant.findOne({ email: email.toLowerCase() }).select('+password');
    if (!participant) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await participant.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { participantId: participant._id, email: participant.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      participantId: participant._id,
      fullName: participant.fullName,
      email: participant.email,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
