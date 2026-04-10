// backend/models/PG.js
const mongoose = require('mongoose');

const pgSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  address: String,
  city: String,
  capacity: Number,
  inviteCode: String,
  isApprovedByAdmin: { type: Boolean, default: false }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PG', pgSchema);
