// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Increase payload limits (if needed for image uploads)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());

// Connect to MongoDB (remove deprecated options for newer driver versions)
mongoose.connect('mongodb://localhost:27017/quoteapp')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const quotesRoutes = require('./routes/quotes');

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/quotes', quotesRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to QuoteApp API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
