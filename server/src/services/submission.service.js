const Submission = require('../models/submission.model');

async function createSubmission(payload, conferenceId) {
  const submission = await Submission.create({
    conferenceId,
    themeId:    payload.themeId,
    paperTitle: payload.paperTitle,
    abstract:   payload.abstract,
    institution:payload.institution,
    country:    payload.country,
    pdfUrl:     payload.pdfUrl,
    authors: payload.authors.map((author, index) => ({
      fullName:        author.fullName,
      email:           author.email,
      affiliation:     author.affiliation,
      country:         author.country,
      authorOrder:     author.authorOrder || index + 1,
      isCorresponding: Boolean(author.isCorresponding)
    }))
  });
  return submission;
}

async function trackSubmission({ submissionId, email, paperTitle }) {
  if (submissionId) {
    return Submission.findOne({ submissionId }).populate('themeId', 'code label');
  }
  return Submission.findOne({
    'authors.email': email.toLowerCase(),
    paperTitle: new RegExp(`^${paperTitle}$`, 'i')
  }).populate('themeId', 'code label');
}

module.exports = { createSubmission, trackSubmission };
