const express = require('express');
const multer = require('multer');  // Ensure multer is correctly imported
const pool = require('../config/db'); // Ensure database connection is correct
const protect = require('../middleware/authMiddleware'); // Ensure the protect middleware is imported correctly
const { createShares, embedShareInImage } = require('../utils/cryptography'); // Import your cryptography utilities
const router = express.Router();

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// POST /api/votes/submit - Submit a vote
router.post('/submit', [protect, upload.single('file')], async (req, res) => {
  const { candidate } = req.body;
  const file = req.file;

  try {
    // Step 1: Split the selected candidate into two shares using Visual Cryptography
    const [share1, share2] = createShares(candidate);

    // Step 2: Embed share1 into the uploaded image using Steganography
    if (file) {
      const imagePath = file.path;
      await embedShareInImage(share1, imagePath);
    }

    // Step 3: Store share2 in the database
    const queryText = `INSERT INTO votes (encrypted_vote, image_1) VALUES ($1, $2)`;
    const filePath = file ? file.path : null;
    await pool.query(queryText, [share2, filePath]);

    res.status(200).json({ message: 'Vote submitted successfully!' });
  } catch (error) {
    console.error('Error submitting vote:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
