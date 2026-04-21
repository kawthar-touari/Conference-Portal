const mongoose = require('mongoose');
const { COMMITTEE_TEAMS } = require('../constants/enums');

const committeeMemberSchema = new mongoose.Schema(
  {
    conferenceId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Conference', required: true, index: true },
    fullName:      { type: String, required: true, trim: true, maxlength: 150 },
    academicTitle: { type: String, trim: true, maxlength: 80 },
    role:          { type: String, required: true, trim: true, maxlength: 120 },
    team:          { type: String, required: true, enum: COMMITTEE_TEAMS },
    affiliation:   { type: String, required: true, trim: true, maxlength: 200 },
    email:         { type: String, trim: true, lowercase: true },
    photoUrl:      { type: String, trim: true },
    displayOrder:  { type: Number, default: 0 },
    isVisible:     { type: Boolean, default: true }
  },
  { timestamps: true }
);

committeeMemberSchema.index({ conferenceId: 1, team: 1, displayOrder: 1 });
committeeMemberSchema.index({ email: 1 });
module.exports = mongoose.model('CommitteeMember', committeeMemberSchema);
