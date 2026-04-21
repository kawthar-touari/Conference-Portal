const mongoose = require('mongoose');

const speakerSchema = new mongoose.Schema(
  {
    conferenceId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Conference', required: true, index: true },
    fullName:      { type: String, required: true, trim: true, maxlength: 150 },
    academicTitle: { type: String, trim: true, maxlength: 80 },
    affiliation:   { type: String, required: true, trim: true, maxlength: 200 },
    country:       { type: String, trim: true, maxlength: 100 },
    topic:         { type: String, required: true, trim: true, maxlength: 200 },
    biography:     { type: String, trim: true },
    photoUrl:      { type: String, trim: true },
    email:         { type: String, trim: true, lowercase: true }
  },
  { timestamps: true }
);

speakerSchema.index({ conferenceId: 1, fullName: 1 });
speakerSchema.index({ country: 1, topic: 1 });
module.exports = mongoose.model('Speaker', speakerSchema);
