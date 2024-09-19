const express = require('express');
const multer = require('multer');
const pool = require('../config/db');
const protect = require('../middleware/authMiddleware');
const { createShares, embedShareInImage } = require('../utils/cryptography');
const router = express.Router();

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// POST /api/votes/submit - Submit a vote
router.post('/submit', [protect, upload.single('file')], async (req, res) => {
  const { candidate } = req.body;
  const userId = req.user.id;
  const file = req.file;

  try {
    // Check if an image is provided
    if (!file) {
      return res.status(400).json({ message: 'Image is required to submit the vote.' });
    }

    // Check if the user has already voted
    const voteQuery = 'SELECT has_voted FROM votes WHERE user_id = $1';
    const voteResult = await pool.query(voteQuery, [userId]);

    if (voteResult.rows.length > 0 && voteResult.rows[0].has_voted) {
      return res.status(400).json({ message: 'You have already voted.' });
    }

    // Process the vote (e.g., use visual cryptography and steganography)
    const [share1, share2] = createShares(candidate);
    const imagePath = file.path;

    await embedShareInImage(share1, imagePath);
    console.log(`Image saved at: ${imagePath}`);

    // Update the votes table with the encrypted vote and mark as voted
    const updateVoteQuery = `
      UPDATE votes
      SET encrypted_vote = $1, image_1 = $2, vote_time = NOW(), has_voted = true
      WHERE user_id = $3
    `;
    await pool.query(updateVoteQuery, [share2, imagePath, userId]);

    res.status(200).json({ message: 'Vote submitted successfully!' });
  } catch (error) {
    console.error('Error submitting vote:', error);
    res.status(500).json({ message: 'Server error during vote submission' });
  }
});

// GET /api/votes/results - Get the vote results
router.get('/results', async (req, res) => {
  try {
    const resultsQuery = `
      SELECT encrypted_vote AS candidate, COUNT(*) AS count
      FROM votes
      WHERE has_voted = true
      GROUP BY encrypted_vote
    `;
    const results = await pool.query(resultsQuery);

    res.status(200).json(results.rows);
  } catch (error) {
    console.error('Error fetching vote results:', error);
    res.status(500).json({ message: 'Server error during result fetching' });
  }
});

module.exports = router;
