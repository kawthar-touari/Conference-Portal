const mongoose = require('mongoose');
const { SUBMISSION_STATUSES } = require('../constants/enums');
const { getNextSequence, formatPublicId } = require('../utils/publicId');

const submissionAuthorSchema = new mongoose.Schema(
  {
    fullName:        { type: String, required: true, trim: true, maxlength: 150 },
    email:           { type: String, required: true, trim: true, lowercase: true, maxlength: 150 },
    affiliation:     { type: String, trim: true, maxlength: 200 },
    country:         { type: String, trim: true, maxlength: 100 },
    authorOrder:     { type: Number, required: true, min: 1 },
    isCorresponding: { type: Boolean, default: false }
  },
  { _id: false }
);

const submissionSchema = new mongoose.Schema(
  {
    conferenceId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Conference', required: true, index: true },
    themeId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Theme', required: true, index: true },
    submissionId:  { type: String, unique: true, index: true },
    paperTitle:    { type: String, required: true, trim: true, maxlength: 250 },
    abstract:      { type: String, required: true, trim: true, minlength: 50 },
    institution:   { type: String, trim: true, maxlength: 200 },
    country:       { type: String, trim: true, maxlength: 100 },
    status:        { type: String, enum: SUBMISSION_STATUSES, default: 'PENDING', index: true },
    reviewComment: { type: String, trim: true, maxlength: 2000 },
    pdfUrl:        { type: String, trim: true },
    submittedAt:   { type: Date, default: Date.now, index: true },
    authors: {
      type: [submissionAuthorSchema],
      validate: {
        validator: function (authors) {
          if (!Array.isArray(authors) || authors.length === 0) return false;
          const correspondingCount = authors.filter(a => a.isCorresponding).length;
          return correspondingCount === 1;
        },
        message: 'Submission must have at least one author and exactly one corresponding author.'
      }
    }
  },
  { timestamps: true }
);

submissionSchema.pre('validate', async function (next) {
  try {
    if (this.isNew && !this.submissionId) {
      const seq = await getNextSequence('submission');
      this.submissionId = formatPublicId('SUB', seq);
    }
    const orders = this.authors.map(a => a.authorOrder);
    if (new Set(orders).size !== orders.length) {
      return next(new Error('Each authorOrder value must be unique inside one submission.'));
    }
    next();
  } catch (error) {
    next(error);
  }
});

submissionSchema.index({ conferenceId: 1, status: 1, submittedAt: -1 });
submissionSchema.index({ themeId: 1, status: 1 });
submissionSchema.index({ 'authors.email': 1 });
submissionSchema.index({ paperTitle: 'text', abstract: 'text' });
module.exports = mongoose.model('Submission', submissionSchema);
