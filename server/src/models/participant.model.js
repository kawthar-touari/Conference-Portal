const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { PARTICIPANT_TYPES } = require('../constants/enums');

const participantSchema = new mongoose.Schema(
  {
    fullName:        { type: String, required: true, trim: true, maxlength: 150 },
    email:           { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    password:        { type: String, required: true, minlength: 6, select: false },
    phone:           { type: String, trim: true, maxlength: 30 },
    affiliation:     { type: String, trim: true, maxlength: 200 },
    country:         { type: String, trim: true, maxlength: 100 },
    participantType: { type: String, enum: PARTICIPANT_TYPES, default: 'ATTENDEE' }
  },
  { timestamps: true }
);

// Hash password before saving
participantSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
participantSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

participantSchema.index({ fullName: 1 });
module.exports = mongoose.model('Participant', participantSchema);
