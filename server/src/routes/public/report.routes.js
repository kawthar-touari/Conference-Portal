const express = require('express');
const router = express.Router();
const { 
  createReport, 
  getConferenceReports, 
  updateReportStatus, 
  getAllReports 
} = require('../../controllers/public/report.controller');
const { protect } = require('../../middleware/auth.middleware');

// Public routes
router.post('/reports', createReport);
router.get('/reports/conference/:conferenceId', getConferenceReports);

// Admin routes (protected)
router.put('/reports/:reportId/status', protect, updateReportStatus);
router.get('/reports', protect, getAllReports);

module.exports = router;
