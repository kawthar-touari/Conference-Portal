const mongoose = require('mongoose');

const conferenceSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true, maxlength: 200 },
    slogan:       { type: String, trim: true, maxlength: 250 },
    description:  { type: String, trim: true },
    startDate:    { type: Date, required: true },
    endDate:      { type: Date, required: true },
    venue:        { type: String, required: true, trim: true, maxlength: 200 },
    city:         { type: String, trim: true, maxlength: 100 },
    country:      { type: String, trim: true, maxlength: 100 },
    contactEmail: { type: String, trim: true, lowercase: true },
    isActive:     { type: Boolean, default: true }
  },
  { timestamps: true }
);

conferenceSchema.index({ isActive: 1, startDate: 1 });
module.exports = mongoose.model('Conference', conferenceSchema);
