// backend/routes/payments.js
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const paymentCtrl = require('../controllers/paymentController');

// If you created upload middleware for Cloudinary:
const upload = require('../middleware/upload'); // optional

// Student creates offline payment
// If using file upload: use upload.single('proof')
router.post('/', authenticate, authorize('student'), upload.single('proof'),  paymentCtrl.createOfflinePayment);

// Owner views payments for their PGs
router.get('/owner', authenticate, authorize('owner'), paymentCtrl.listForOwner);

// Owner confirms payment
router.post('/:id/confirm', authenticate, authorize('owner'), paymentCtrl.confirmPayment);

module.exports = router;
