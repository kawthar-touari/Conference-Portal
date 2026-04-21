const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { COMMITTEE_USER_ROLES } = require('../constants/enums');

const committeeUserSchema = new mongoose.Schema(
  {
    memberId:     { type: mongoose.Schema.Types.ObjectId, ref: 'CommitteeMember', default: null },
    fullName:     { type: String, required: true, trim: true, maxlength: 150 },
    email:        { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role:         { type: String, enum: COMMITTEE_USER_ROLES, default: 'EDITOR' },
    isActive:     { type: Boolean, default: true },
    lastLoginAt:  { type: Date, default: null }
  },
  { timestamps: true }
);

committeeUserSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

module.exports = mongoose.model('CommitteeUser', committeeUserSchema);
