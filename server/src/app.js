const express      = require('express');
const cors         = require('cors');
const errorHandler = require('./middleware/error.middleware');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public routes
app.use('/api', require('./routes/public/conference.routes'));
app.use('/api', require('./routes/public/theme.routes'));
app.use('/api', require('./routes/public/committee.routes'));
app.use('/api', require('./routes/public/speaker.routes'));
app.use('/api', require('./routes/public/session.routes'));
app.use('/api', require('./routes/public/register.routes'));
app.use('/api', require('./routes/public/submission.routes'));
app.use('/api', require('./routes/public/certificate.routes'));

// Admin routes
app.use('/api/admin', require('./routes/admin/auth.routes'));
app.use('/api/admin', require('./routes/admin/dashboard.routes'));
app.use('/api/admin', require('./routes/admin/speaker.routes'));
app.use('/api/admin', require('./routes/admin/session.routes'));
app.use('/api/admin', require('./routes/admin/submission.routes'));
app.use('/api/admin', require('./routes/admin/registration.routes'));
app.use('/api/admin', require('./routes/admin/certificate.routes'));
app.use('/api/admin', require('./routes/admin/committeeMember.routes'));

app.get('/api/health', (req, res) => res.json({ message: 'API is running' }));
app.use(errorHandler);

module.exports = app;
