// backend/controllers/pgController.js
const JoinRequest = require('../models/JoinRequest');
const PG = require('../models/PG');
const User = require('../models/User');

exports.applyToPG = async (req, res) => {
  try {
    const studentId = req.userId;
    const pgId = req.params.pgId;
    const { message } = req.body;

    // check pg exists
    const pg = await PG.findById(pgId);
    if (!pg) return res.status(404).json({ message: 'PG not found' });

    // check if already applied and pending
    const existing = await JoinRequest.findOne({ pgId, studentId, status: 'pending' });
    if (existing) return res.status(400).json({ message: 'Already applied' });

    // check if already a member
    const student = await User.findById(studentId);
    if (student.memberships && student.memberships.some(m => m.pgId.toString() === pgId && m.status === 'member')) {
      return res.status(400).json({ message: 'Already a member' });
    }

    const reqDoc = await JoinRequest.create({ pgId, studentId, message });
    res.json({ message: 'Applied', request: reqDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// SEARCH PGs with sorting
exports.searchPGs = async (req, res) => {
  try {
    const { city, keyword, sort } = req.query;

    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    // base query
    let query = {
      city: { $regex: city, $options: "i" },
      isApprovedByAdmin: true
    };

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { address: { $regex: keyword, $options: "i" } }
      ];
    }

    let pgs = await PG.find(query);

    // SORTING LOGIC
    if (sort === 'name') {
      pgs.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sort === 'popular') {
      const User = require('../models/User');
      const Payment = require('../models/Payment');

      const withPopularity = [];

      for (let pg of pgs) {
        const membersCount = await User.countDocuments({
          memberships: { $elemMatch: { pgId: pg._id, status: 'member' } }
        });

        const paymentsCount = await Payment.countDocuments({
          pgId: pg._id,
          status: 'confirmed'
        });

        withPopularity.push({
          ...pg.toObject(),
          popularityScore: membersCount + paymentsCount
        });
      }

      withPopularity.sort((a, b) => b.popularityScore - a.popularityScore);

      return res.json({
        count: withPopularity.length,
        pgs: withPopularity
      });
    }

    // default / name sorted
    res.json({
      count: pgs.length,
      pgs
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



// ADMIN: approve PG
exports.approvePGByAdmin = async (req, res) => {
  try {
    const pg = await PG.findById(req.params.pgId);
    if (!pg) {
      return res.status(404).json({ message: 'PG not found' });
    }

    pg.isApprovedByAdmin = true;
    await pg.save();

    res.json({
      message: 'PG approved by admin',
      pg
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// AI: Recommend PGs (rule-based)
exports.recommendPGs = async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    // 1) Approved PGs lao
    const pgs = await PG.find({
      city: { $regex: city, $options: "i" },
      isApprovedByAdmin: true
    });

    // 2) Score calculate karo
    const scored = pgs.map(pg => {
      let score = 0;

      // Rule 1: Capacity
      if (pg.capacity >= 20) score += 2;
      if (pg.capacity >= 40) score += 3;

      // Rule 2: Popularity (members count)
      // Count students who are members of this PG
      // (simple approach)
      // NOTE: optimize later; for now OK
      score += 1; // base point so empty PGs bhi consider ho

      return {
        ...pg.toObject(),
        score
      };
    });

    // 3) Sort by score (high to low)
    scored.sort((a, b) => b.score - a.score);

    res.json({
      count: scored.length,
      recommended: scored
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// POPULAR PGs (rule-based)
exports.popularPGs = async (req, res) => {
  try {
    const pgs = await PG.find({ isApprovedByAdmin: true });

    const results = [];

    for (let pg of pgs) {
      const membersCount = await User.countDocuments({
        memberships: { $elemMatch: { pgId: pg._id, status: 'member' } }
      });

      const paymentsCount = await require('../models/Payment')
        .countDocuments({ pgId: pg._id, status: 'confirmed' });

      const score = membersCount + paymentsCount;

      results.push({
        ...pg.toObject(),
        popularityScore: score
      });
    }

    // sort by popularity
    results.sort((a, b) => b.popularityScore - a.popularityScore);

    res.json({
      count: results.length,
      popular: results
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Student: My PGs (joined PG dashboard list)
exports.getMyPGs = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('memberships.pgId');

    const myPGs = user.memberships
      .filter(m => m.status === 'member')
      .map(m => ({
        pg: m.pgId,
        joinedAt: m.joinedAt,
        status: m.status
      }));

    res.json({
      count: myPGs.length,
      myPGs
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Student: Single PG Dashboard
exports.getStudentPGDashboard = async (req, res) => {
  try {
    const studentId = req.userId;
    const { pgId } = req.params;

    // check membership
    const user = await User.findById(studentId);
    const isMember = user.memberships.some(
      m => m.pgId.toString() === pgId && m.status === 'member'
    );

    if (!isMember) {
      return res.status(403).json({ message: 'Not a member of this PG' });
    }

    const pg = await PG.findById(pgId);

    const payments = await require('../models/Payment').find({
      pgId,
      studentId
    });

    const complaints = await require('../models/Complaint').find({
      pgId,
      studentId
    });

    res.json({
      pg,
      payments,
      complaints
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};