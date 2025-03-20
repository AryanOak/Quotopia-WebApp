// models/Quote.js
const mongoose = require('mongoose');

const QuoteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    maxlength: 200
  },
  category: {
    type: String,
    enum: ['none', 'motivational', 'philosophical', 'spiritual', 'funny'],
    default: 'none'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  likedBy: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  ],
  dislikedBy: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Quote', QuoteSchema);
