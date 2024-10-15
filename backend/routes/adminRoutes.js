const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require('../config/db');
const fs = require('fs'); // Ensure this is included if you're using fs for reading files

// Middleware for token authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, 'd112b53441301142acc130612a2c67207fd87488cdf804d511bc6721a06d8001c6358a7e7c71d4a0b768bbc47d3e64b630e653976b517859f543d868115ee224', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};



router.post('/elections', async (req, res) => {
  const { start_date, end_date, result_date } = req.body;
  try {
    const result = await pool.query({
      text: `INSERT INTO elections (start_date, end_date, result_date) VALUES ($1, $2, $3) RETURNING *`,
      values: [start_date, end_date, result_date],
    });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating election:', error);
    res.status(500).json({ message: 'Error creating election' });
  }
});
router.get('/active', async (req, res) => {
  try {
    const result = await pool.query({
      text: `SELECT * FROM elections WHERE end_date > NOW() AND result_date > NOW()`,
    });
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error('Error getting active election:', error);
    res.status(500).json({ message: 'Error getting active election' });
  }
});
router.post('/logout', async (req, res) => {
  try {
    req.user = null;
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging out' });
  }
});



// Login Route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const results = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);

    if (results.rows.length > 0) {
      const user = results.rows[0];
      if (user.role === 'admin') {
        // Generate token for admin
        const token = jwt.sign({ id: user.id, role: user.role }, 'd112b53441301142acc130612a2c67207fd87488cdf804d511bc6721a06d8001c6358a7e7c71d4a0b768bbc47d3e64b630e653976b517859f543d868115ee224', { expiresIn: '1h' });
        return res.json({ token });
      } else {
        return res.status(403).json({ message: 'Access denied' });
      }
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error logging in' });
  }
});

// Route to fetch voting statistics

// Route to fetch voting statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const currentElection = await pool.query('SELECT id FROM elections WHERE end_date > NOW() AND result_date IS NULL');
    if (currentElection.rows.length === 0) {
      return res.status(404).json({ message: 'No active election found' });
    }
    const electionId = currentElection.rows[0].id;

    const totalVotersQuery = 'SELECT COUNT(*) AS total_voters FROM valid_voters';
    const totalVotersResult = await pool.query(totalVotersQuery);
    const totalVoters = totalVotersResult.rows[0].total_voters;

    const votesCastQuery = `SELECT COUNT(*) AS votes FROM votes WHERE has_voted = true AND election_id = $1`;
    const votesCastResult = await pool.query(votesCastQuery, [electionId]);
    const votesCast = votesCastResult.rows[0].votes;

    const candidateVotesQuery = `
      SELECT candidate_id, COUNT(*) AS vote_count
      FROM votes
      WHERE has_voted = true AND election_id = $1
      GROUP BY candidate_id
    `;
    const candidateVotesResult = await pool.query(candidateVotesQuery, [electionId]);
    const candidateVotes = candidateVotesResult.rows;

    res.status(200).json({
      totalVoters,
      votesCast,
      candidateVotes,
    });
  } catch (error) {
    console.error('Error fetching voting stats:', error);
    res.status(500).json({ message: 'Error fetching voting statistics' });
  }
});

// Route to tally votes
router.get('/tallyVotes', authenticateToken, async (req, res) => {
  try {
    const currentElection = await pool.query('SELECT id FROM elections WHERE end_date > NOW() AND result_date IS NULL');
    if (currentElection.rows.length === 0) {
      return res.status(404).json({ message: 'No active election found' });
    }
    const electionId = currentElection.rows[0].id;

    const votes = await pool.query('SELECT share1_path, share2_path FROM votes WHERE has_voted = true AND election_id = $1', [electionId]);
    const voteCounts = {};

    for (const vote of votes.rows) {
      const share1Path = vote.share1_path;
      const share2Path = vote.share2_path;

      try {
        const share1Buffer = await fs.promises.readFile(share1Path);
        const share2Buffer = await fs.promises.readFile(share2Path);

        const combinedImage = await combineShares([share1Buffer, share2Buffer]);
        const candidateId = await extractMessageFromPng(combinedImage);

        if (!voteCounts[candidateId]) {
          voteCounts[candidateId] = 0;
        }

        voteCounts[candidateId]++;
      } catch (err) {
        console.error('Error processing vote:', err);
      }
    }

    // Get candidate details for display purposes
    const candidates = await pool.query('SELECT id, cname, party FROM candidate WHERE election_id = $1', [electionId]);
    const results = candidates.rows.map(candidate => ({
      candidateId: candidate.id,
      candidateName: candidate.cname,
      party: candidate.party,
      votes: voteCounts[candidate.id] || 0 // Default to 0 if no votes
    }));

    res.json({ results, voteCounts });
  } catch (err) {
    console.error('Error tallying votes:', err);
    res.status(500).json({ message: 'Error tallying votes' });
  }
});

router.post('/logout', authenticateToken, async (req, res) => {
  try {
    req.user = null;
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging out' });
  }
});
module.exports = router;
