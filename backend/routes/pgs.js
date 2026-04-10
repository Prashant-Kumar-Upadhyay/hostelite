// backend/routes/pgs.js
const express = require('express');
const router = express.Router();
const PG = require('../models/PG');
const { authenticate, authorize } = require('../middleware/auth');
const pgCtrl = require('../controllers/pgController');

// public: list pgs (optional - filter by city)
router.get('/', async (req, res) => {
  try {
    const q = req.query.city ? { city: req.query.city } : {};
    const pgs = await PG.find(q).select('-__v');
    res.json(pgs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// student my PGs
router.get(
  '/my',
  authenticate,
  authorize('student'),
  pgCtrl.getMyPGs
);

// student single PG dashboard
router.get(
  '/:pgId/dashboard',
  authenticate,
  authorize('student'),
  pgCtrl.getStudentPGDashboard
);


// PG search (advanced search using controller)
router.get('/search', pgCtrl.searchPGs);

//popular
router.get('/popular', pgCtrl.popularPGs);

// AI recommendation (home page)
router.get('/recommended', pgCtrl.recommendPGs);


// ADMIN approves PG
router.post(
  '/:pgId/approve',
  authenticate,
  authorize('admin'),
  pgCtrl.approvePGByAdmin
);



// student apply to pg
router.post('/:pgId/apply', authenticate, authorize('student'), pgCtrl.applyToPG);

module.exports = router;
