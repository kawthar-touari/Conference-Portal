const mongoose = require('mongoose');
const { CERTIFICATE_STATUSES, CERTIFICATE_TYPES } = require('../constants/enums');
const { getNextSequence, formatPublicId } = require('../utils/publicId');

function createVerificationCode() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

const certificateSchema = new mongoose.Schema(
  {
    conferenceId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Conference', required: true, index: true },
    registrationIdRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Registration', required: true, unique: true, index: true },
    participantId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Participant', required: true, index: true },
    certificateId:     { type: String, unique: true, index: true },
    certificateType:   { type: String, enum: CERTIFICATE_TYPES, default: 'PARTICIPANT' },
    ownerName:         { type: String, required: true, trim: true, maxlength: 150 },
    ownerEmail:        { type: String, required: true, trim: true, lowercase: true, maxlength: 150 },
    issueDate:         { type: Date, default: Date.now },
    verificationCode:  { type: String, unique: true, index: true },
    status:            { type: String, enum: CERTIFICATE_STATUSES, default: 'GENERATED', index: true },
    pdfUrl:            { type: String, trim: true }
  },
  { timestamps: true }
);

certificateSchema.pre('validate', async function (next) {
  try {
    if (this.isNew && !this.certificateId) {
      const seq = await getNextSequence('certificate');
      this.certificateId = formatPublicId('CERT', seq);
    }
    if (this.isNew && !this.verificationCode) {
      this.verificationCode = createVerificationCode();
    }
    next();
  } catch (error) {
    next(error);
  }
});

certificateSchema.index({ ownerEmail: 1, status: 1 });
module.exports = mongoose.model('Certificate', certificateSchema);
