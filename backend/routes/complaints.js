const express = require('express');
const router = express.Router();

const { authenticate, authorize } = require('../middleware/auth');
const complaintController = require('../controllers/complaintController');

// Student raises a complaint
router.post(
  '/',
  authenticate,
  authorize('student'),
  complaintController.createComplaint
);

// Owner views complaints
router.get(
  '/owner',
  authenticate,
  authorize('owner'),
  complaintController.getOwnerComplaints
);

// Owner updates complaint status
router.patch(
  '/:id/status',
  authenticate,
  authorize('owner'),
  complaintController.updateComplaintStatus
);


module.exports = router;
