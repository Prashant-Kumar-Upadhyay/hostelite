// backend/controllers/ownerController.js
const PG = require('../models/PG');
const JoinRequest = require('../models/JoinRequest');
const User = require('../models/User');

exports.createPG = async (req, res) => {
  try {
    const ownerId = req.userId;
    const { name, address, city, capacity, inviteCode } = req.body;
    const pg = await PG.create({ ownerId, name, address, city, capacity, inviteCode });
    res.json(pg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listRequests = async (req, res) => {
  try {
    const ownerId = req.userId;
    // find pgs by owner
    const pgs = await PG.find({ ownerId }).select('_id');
    const pgIds = pgs.map(p => p._id);
    const requests = await JoinRequest.find({ pgId: { $in: pgIds }, status: 'pending' })
      .populate('studentId', 'name email')
      .populate('pgId', 'name');
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.approveRequest = async (req, res) => {
  try {
    const ownerId = req.userId;
    const { id } = req.params; // request id
    const request = await JoinRequest.findById(id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // ensure the PG belongs to this owner
    const pg = await PG.findById(request.pgId);
    if (!pg) return res.status(404).json({ message: 'PG not found' });
    if (pg.ownerId.toString() !== ownerId) return res.status(403).json({ message: 'Not allowed' });

    request.status = 'approved';
    request.reviewedAt = new Date();
    await request.save();

    // add membership to student
    const student = await User.findById(request.studentId);
    student.memberships.push({ pgId: pg._id, joinedAt: new Date(), status: 'member' });
    await student.save();

    res.json({ message: 'Request approved', request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Owner: Single PG Dashboard
exports.getOwnerPGDashboard = async (req, res) => {
  try {
    const ownerId = req.userId;
    const { pgId } = req.params;

    // Check PG ownership
    const pg = await PG.findById(pgId);
    if (!pg) return res.status(404).json({ message: 'PG not found' });

    if (pg.ownerId.toString() !== ownerId) {
      return res.status(403).json({ message: 'Not your PG' });
    }

    // Members count
    const membersCount = await User.countDocuments({
      memberships: {
        $elemMatch: {
          pgId: pgId,
          status: 'member'
        }
      }
    });

    // Pending join requests
    const pendingRequests = await JoinRequest.find({
      pgId,
      status: 'pending'
    }).populate('studentId', 'name email');

    // Payments
    const payments = await require('../models/Payment')
      .find({ pgId })
      .populate('studentId', 'name email');

    // Complaints
    const complaints = await require('../models/Complaint')
      .find({ pgId })
      .populate('studentId', 'name email');

    res.json({
      pg,
      membersCount,
      pendingRequests,
      payments,
      complaints
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Owner: My PGs list
exports.getMyPGs = async (req, res) => {
  try {
    const ownerId = req.userId;

    const pgs = await PG.find({ ownerId });

    res.json({
      count: pgs.length,
      pgs
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.deletePG = async (req, res) => {
  try {
    const ownerId = req.userId;
    const { pgId } = req.params;

    const pg = await PG.findById(pgId);

    if (!pg) return res.status(404).json({ message: "PG not found" });

    if (pg.ownerId.toString() !== ownerId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await pg.deleteOne();

    res.json({ message: "PG deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};