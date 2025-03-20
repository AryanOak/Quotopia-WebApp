// routes/profile.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Quote = require('../models/Quote'); // Added to fetch user quotes

// GET: Fetch profile of the authenticated user (protected)
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT: Update profile of the authenticated user (protected)
router.put('/', auth, async (req, res) => {
  const { username, headlineQuote, profilePhoto } = req.body;
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    if (username) user.username = username;
    if (headlineQuote !== undefined) user.headlineQuote = headlineQuote;
    if (profilePhoto !== undefined) user.profilePhoto = profilePhoto;
    
    await user.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET: Public profile view by userId (public)
router.get('/public/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('username profilePhoto headlineQuote');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const quotes = await Quote.find({ user: req.params.userId }).populate('user', 'username profilePhoto');
    res.json({ user, quotes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
