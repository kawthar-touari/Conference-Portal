const mongoose = require('mongoose');
const { REGISTRATION_STATUSES } = require('../constants/enums');
const { getNextSequence, formatPublicId } = require('../utils/publicId');

const registrationSchema = new mongoose.Schema(
  {
    conferenceId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Conference', required: true, index: true },
    participantId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Participant', required: true, index: true },
    registrationId:      { type: String, unique: true, index: true },
    registrationStatus:  { type: String, enum: REGISTRATION_STATUSES, default: 'REGISTERED', index: true },
    attendanceConfirmed: { type: Boolean, default: false, index: true },
    notes:               { type: String, trim: true, maxlength: 500 },
    registeredAt:        { type: Date, default: Date.now }
  },
  { timestamps: true }
);

registrationSchema.pre('validate', async function (next) {
  try {
    if (this.isNew && !this.registrationId) {
      const seq = await getNextSequence('registration');
      this.registrationId = formatPublicId('REG', seq);
    }
    next();
  } catch (error) {
    next(error);
  }
});

registrationSchema.index({ conferenceId: 1, participantId: 1 }, { unique: true });
registrationSchema.index({ conferenceId: 1, registrationStatus: 1 });
module.exports = mongoose.model('Registration', registrationSchema);
