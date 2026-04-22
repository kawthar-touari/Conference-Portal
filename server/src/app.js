const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express      = require('express');
const cors         = require('cors');
const { protect }  = require('./middleware/auth.middleware');
const errorHandler = require('./middleware/error.middleware');
const connectDB = require('./config/db');


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
app.use('/api/admin', protect, require('./routes/admin/dashboard.routes'));
app.use('/api/admin', protect, require('./routes/admin/speaker.routes'));
app.use('/api/admin', protect, require('./routes/admin/session.routes'));
app.use('/api/admin', protect, require('./routes/admin/submission.routes'));
app.use('/api/admin', protect, require('./routes/admin/registration.routes'));
app.use('/api/admin', protect, require('./routes/admin/certificate.routes'));
app.use('/api/admin', protect, require('./routes/admin/committeeMember.routes'));

app.get('/api/health', (req, res) => res.json({ message: 'API is running' }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();
  app.listen(PORT, () => console.log(`weeeeeeee 😎Server runningggg on port ${PORT}`));
}

startServer();

module.exports = app;
