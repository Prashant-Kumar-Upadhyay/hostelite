// backend/controllers/paymentController.js
const Payment = require('../models/Payment');
const PG = require('../models/PG');
const User = require('../models/User');

// Create offline payment (supports file upload via multer + cloudinary OR direct proofUrl)
exports.createOfflinePayment = async (req, res) => {
  try {
    const studentId = req.userId;
    const { pgId, amount, monthFor } = req.body;

    // basic validation
    if (!pgId || !amount || !monthFor) {
      return res.status(400).json({ message: 'pgId, amount and monthFor are required' });
    }

    // check pg exists
    const pg = await PG.findById(pgId);
    if (!pg) return res.status(404).json({ message: 'PG not found' });

    // determine proofUrl: either from req.file (Cloudinary) or from body.proofUrl
    let proofUrl = req.body.proofUrl || null;
    if (req.file && req.file.path) {
      // multer-storage-cloudinary stores url in req.file.path
      proofUrl = req.file.path;
    }

    const payment = await Payment.create({
      pgId,
      studentId,
      amount,
      monthFor,
      method: 'offline',
      proofUrl,
      status: 'pending'
    });

    res.json({ message: 'Payment created', payment });
  } catch (err) {
    console.error('Payment create error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Owner: list payments for their PGs
exports.listForOwner = async (req, res) => {
  try {
    const ownerId = req.userId;
    const pgs = await PG.find({ ownerId }).select('_id');
    const pgIds = pgs.map(p => p._id);
    const payments = await Payment.find({ pgId: { $in: pgIds } })
      .populate('studentId', 'name email')
      .sort('-createdAt');
    res.json(payments);
  } catch (err) {
    console.error('Payment list error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Owner: confirm payment
exports.confirmPayment = async (req, res) => {
  try {
    const ownerId = req.userId;
    const { id } = req.params;
    const payment = await Payment.findById(id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    // verify owner's PG
    const pg = await PG.findById(payment.pgId);
    if (!pg) return res.status(404).json({ message: 'PG not found' });
    if (pg.ownerId.toString() !== ownerId) return res.status(403).json({ message: 'Not allowed' });

    payment.status = 'confirmed';
    payment.confirmedAt = new Date();
    await payment.save();

    res.json({ message: 'Payment confirmed', payment });
  } catch (err) {
    console.error('Payment confirm error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
