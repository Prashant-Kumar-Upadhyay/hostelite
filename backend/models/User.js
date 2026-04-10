const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  pgId: { type: mongoose.Schema.Types.ObjectId, ref: 'PG' },
  roomNo: String,
  joinedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['member', 'left'], default: 'member' }
});

// Main User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  phone: { type: String },

  passwordHash: { type: String, required: true },

  role: {
    type: String,
    enum: ['student', 'owner', 'admin', 'guard'],
    default: 'student'
  },

  isOwnerVerified: { type: Boolean, default: false },

  memberships: [membershipSchema],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
