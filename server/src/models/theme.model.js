const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema(
  {
    conferenceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conference', required: true, index: true },
    code:         { type: String, required: true, trim: true, uppercase: true, maxlength: 30 },
    label:        { type: String, required: true, trim: true, maxlength: 120 },
    description:  { type: String, trim: true },
    displayOrder: { type: Number, default: 0 }
  },
  { timestamps: true }
);

themeSchema.index({ conferenceId: 1, code: 1 }, { unique: true });
themeSchema.index({ conferenceId: 1, label: 1 });
module.exports = mongoose.model('Theme', themeSchema);
