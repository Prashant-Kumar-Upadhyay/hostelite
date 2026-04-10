const Complaint = require('../models/Complaint');

// Student raises a complaint
exports.createComplaint = async (req, res) => {
  try {
    const { pgId, title, description } = req.body;

    const complaint = await Complaint.create({
      pgId,
      studentId: req.user.id,
      title,
      description
    });

    res.status(201).json({
      message: 'Complaint created',
      complaint
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Owner views complaints
exports.getOwnerComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('pgId', 'name ownerId')
      .populate('studentId', 'name email');

    const ownerComplaints = complaints.filter(
      c => c.pgId.ownerId.toString() === req.user.id
    );

    res.json(ownerComplaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Owner updates complaint status
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findById(req.params.id)
      .populate('pgId', 'ownerId');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.pgId.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    complaint.status = status;
    await complaint.save();

    res.json({
      message: 'Complaint updated',
      complaint
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

