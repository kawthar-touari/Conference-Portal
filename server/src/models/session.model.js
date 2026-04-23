const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    conferenceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conference', required: true, index: true },
    themeId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Theme', required: true, index: true },
    speakerId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Speaker', default: null, index: true },
    sessionTitle: { type: String, required: true, trim: true, maxlength: 200 },
    startsAt:     { type: Date, required: true, index: true },
    endsAt:       { type: Date, required: true, index: true },
    room:         { type: String, trim: true, maxlength: 80 },
    description:  { type: String, trim: true },
    maxAttendees: { type: Number, default: 100 },
    bookedParticipants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Participant' }]
  },
  { timestamps: true }
);

sessionSchema.pre('validate', function (next) {
  if (this.startsAt && this.endsAt && this.endsAt <= this.startsAt) {
    return next(new Error('Session end time must be after start time.'));
  }
  next();
});

// Method to check if session is full
sessionSchema.methods.isFull = function() {
  return this.bookedParticipants.length >= this.maxAttendees;
};

// Method to book a participant
sessionSchema.methods.bookParticipant = async function(participantId) {
  if (this.isFull()) {
    throw new Error('Session is full');
  }
  if (this.bookedParticipants.includes(participantId)) {
    throw new Error('Already booked for this session');
  }
  this.bookedParticipants.push(participantId);
  await this.save();
  return true;
};

sessionSchema.index({ conferenceId: 1, startsAt: 1, endsAt: 1 });
sessionSchema.index({ themeId: 1, startsAt: 1 });
module.exports = mongoose.model('Session', sessionSchema);
