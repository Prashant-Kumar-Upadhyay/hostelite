// backend/controllers/adminController.js
const User = require('../models/User');
const PG = require('../models/PG');
const Complaint = require('../models/Complaint');

exports.getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPGs = await PG.countDocuments();

    const pendingPGs = await PG.countDocuments({ isApprovedByAdmin: false });
    const approvedPGs = await PG.countDocuments({ isApprovedByAdmin: true });

    const totalComplaints = await Complaint.countDocuments();
    const openComplaints = await Complaint.countDocuments({ status: 'open' });

    res.json({
      totalUsers,
      totalPGs,
      pendingPGs,
      approvedPGs,
      totalComplaints,
      openComplaints
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPendingPGs = async (req, res) => {
  try {
    const pgs = await PG.find({ isApprovedByAdmin: false });
    res.json({ pgs });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.approvePG = async (req, res) => {
  try {
    const { id } = req.params;

    const pg = await PG.findById(id);

    if (!pg) return res.status(404).json({ message: "PG not found" });

    pg.isApprovedByAdmin = true;
    await pg.save();

    res.json({ message: "PG approved" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};