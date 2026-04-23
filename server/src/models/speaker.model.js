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
    email:         { type: String, trim: true, lowercase: true },
    // Rating system for speakers
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings:  { type: Number, default: 0 },
    ratings: [{
      participantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Participant' },
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String, maxlength: 500 },
      createdAt: { type: Date, default: Date.now }
    }]
  },
  { timestamps: true }
);

// Method to add rating
speakerSchema.methods.addRating = async function(participantId, rating, comment) {
  // Check if participant already rated
  const existingRating = this.ratings.find(r => r.participantId.toString() === participantId.toString());
  if (existingRating) {
    throw new Error('You have already rated this speaker');
  }
  
  this.ratings.push({ participantId, rating, comment });
  this.totalRatings += 1;
  
  // Calculate new average
  const sum = this.ratings.reduce((acc, r) => acc + r.rating, 0);
  this.averageRating = sum / this.totalRatings;
  
  await this.save();
  return true;
};

speakerSchema.index({ conferenceId: 1, fullName: 1 });
speakerSchema.index({ country: 1, topic: 1 });
speakerSchema.index({ averageRating: -1 }); // Index for ranking by rating
module.exports = mongoose.model('Speaker', speakerSchema);
