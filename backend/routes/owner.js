// backend/routes/owner.js
const express = require('express');
const router = express.Router();
const ownerCtrl = require('../controllers/ownerController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/pgs', authenticate, authorize('owner'), ownerCtrl.createPG);
router.get('/requests', authenticate, authorize('owner'), ownerCtrl.listRequests);
router.post('/requests/:id/approve', authenticate, authorize('owner'), ownerCtrl.approveRequest);

// Owner my PGs list
router.get(
  '/pgs',
  authenticate,
  authorize('owner'),
  ownerCtrl.getMyPGs
);

// Owner single PG dashboard
router.get(
  '/pgs/:pgId/dashboard',
  authenticate,
  authorize('owner'),
  ownerCtrl.getOwnerPGDashboard
);


router.delete(
  "/pgs/:pgId",
  authenticate,
  authorize("owner"),
  ownerCtrl.deletePG
);

module.exports = router;
