// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const adminCtrl = require('../controllers/adminController');

// Admin dashboard
router.get(
  '/dashboard',
  authenticate,
  authorize('admin'),
  adminCtrl.getAdminDashboard
);

router.get(
  "/pgs/pending",
  authenticate,
  authorize("admin"),
  adminCtrl.getPendingPGs
);

router.post(
  "/pgs/:id/approve",
  authenticate,
  authorize("admin"),
  adminCtrl.approvePG
);

module.exports = router;