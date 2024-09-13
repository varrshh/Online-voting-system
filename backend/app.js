const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./config/db'); // No need to call connectDB
const voteRoutes = require('./routes/voteRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/votes', voteRoutes);
app.use('/api/auth', authRoutes);

app.listen(5000, () => {
  console.log('Backend server running on port 5000');
});
