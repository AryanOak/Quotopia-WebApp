// routes/quotes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Quote = require('../models/Quote');
const User = require('../models/User');

// POST: Create a new quote (protected)
router.post('/', auth, async (req, res) => {
  const { text, category } = req.body;
  if (!text || text.length > 200) {
    return res.status(400).json({ message: 'Quote must be provided and be no more than 200 characters.' });
  }
  try {
    const quote = new Quote({
      text,
      category,
      user: req.user.userId,
    });
    await quote.save();
    res.status(201).json({ message: 'Quote created successfully', quote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET: Fetch all quotes (public) with optional filtering by category
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category && category !== 'none') {
      filter.category = category;
    }
    // Populate user info (username and profilePhoto)
    const quotes = await Quote.find(filter).populate('user', 'username profilePhoto');
    res.json(quotes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET: Fetch quotes created by authenticated user (protected)
router.get('/me', auth, async (req, res) => {
  try {
    const quotes = await Quote.find({ user: req.user.userId }).populate('user', 'username profilePhoto');
    res.json(quotes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE: Delete a quote (protected) - only the creator can delete
router.delete('/:quoteId', auth, async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.quoteId);
    if (!quote) return res.status(404).json({ message: 'Quote not found' });
    
    if (quote.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized: You can only delete your own quote.' });
    }
    
    // Use deleteOne() instead of remove()
    await quote.deleteOne();
    res.json({ message: 'Quote deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// POST: Like a quote (protected)
router.post('/:quoteId/like', auth, async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.quoteId);
    if (!quote) return res.status(404).json({ message: 'Quote not found' });
    
    const userId = req.user.userId;
    // Toggle like: if already liked, remove like; otherwise, add like and remove any dislike.
    if (quote.likedBy.includes(userId)) {
      quote.likedBy.pull(userId);
    } else {
      if (quote.dislikedBy.includes(userId)) {
        quote.dislikedBy.pull(userId);
      }
      quote.likedBy.push(userId);
    }
    await quote.save();
    res.json({ 
      message: 'Like updated', 
      likes: quote.likedBy.length, 
      dislikes: quote.dislikedBy.length 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST: Dislike a quote (protected)
router.post('/:quoteId/dislike', auth, async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.quoteId);
    if (!quote) return res.status(404).json({ message: 'Quote not found' });
    
    const userId = req.user.userId;
    // Toggle dislike: if already disliked, remove dislike; otherwise, add dislike and remove any like.
    if (quote.dislikedBy.includes(userId)) {
      quote.dislikedBy.pull(userId);
    } else {
      if (quote.likedBy.includes(userId)) {
        quote.likedBy.pull(userId);
      }
      quote.dislikedBy.push(userId);
    }
    await quote.save();
    res.json({ 
      message: 'Dislike updated', 
      likes: quote.likedBy.length, 
      dislikes: quote.dislikedBy.length 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
// GET: Trending quotes (top 10 by likes)
router.get('/trending', async (req, res) => {
  try {
    // sort by number of likes (descending), limit to 10
    const quotes = await Quote.find()
      .populate('user', 'username profilePhoto')
      .sort({ 'likedBy.length': -1 })
      .limit(10);
    res.json(quotes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
