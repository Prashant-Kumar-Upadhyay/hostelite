// backend/models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  pgId: { type: mongoose.Schema.Types.ObjectId, ref: 'PG', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  monthFor: { type: String, required: true }, // e.g., "Dec 2025"
  method: { type: String, enum: ['offline','online'], default: 'offline' },
  proofUrl: { type: String }, // Cloudinary URL or direct link
  razorpayOrderId: String,
  razorpayPaymentId: String,
  status: { type: String, enum: ['pending','confirmed','rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  confirmedAt: Date
});

module.exports = mongoose.model('Payment', paymentSchema);
