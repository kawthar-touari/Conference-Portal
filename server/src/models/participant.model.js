const mongoose = require('mongoose');
const { PARTICIPANT_TYPES } = require('../constants/enums');

const participantSchema = new mongoose.Schema(
  {
    fullName:        { type: String, required: true, trim: true, maxlength: 150 },
    email:           { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
    phone:           { type: String, trim: true, maxlength: 30 },
    affiliation:     { type: String, trim: true, maxlength: 200 },
    country:         { type: String, trim: true, maxlength: 100 },
    participantType: { type: String, enum: PARTICIPANT_TYPES, default: 'GUEST' }
  },
  { timestamps: true }
);

participantSchema.index({ fullName: 1 });
module.exports = mongoose.model('Participant', participantSchema);
