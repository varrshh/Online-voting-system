const pool = require('../config/db');

const submitVote = async (req, res) => {
  const { vote, imagePath } = req.body;

  try {
    const queryText = `
      INSERT INTO votes (encrypted_vote, image_1, image_2) 
      VALUES ($1, $2, $3)
    `;
    
    // Simulate embedded image placeholders (replace this with actual logic)
    const encryptedVote = 'encrypted_vote_placeholder';
    const embeddedImage1 = 'image1_placeholder';
    const embeddedImage2 = 'image2_placeholder';

    await pool.query(queryText, [encryptedVote, embeddedImage1, embeddedImage2]);

    res.status(200).json({ message: 'Vote submitted successfully!' });
  } catch (error) {
    console.error('Error submitting vote:', error);
    res.status(500).json({ message: 'Error submitting vote' });
  }
};

module.exports = { submitVote };
