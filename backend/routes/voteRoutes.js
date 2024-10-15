//////////////////////////////half ok ///////////////////////////////
// const express = require('express');
// const router = express.Router();
// const pool = require('../config/db'); // Adjust according to your database setup
// const fileUpload = require('express-fileupload');
// const jwt = require('jsonwebtoken'); // For decoding the user token
// const fs = require('fs');
// const path = require('path');
// const multer = require('multer');
// const sharp = require('sharp');
// const { PNG } = require('pngjs');


// const uploadsDir = path.join(__dirname, '../uploads'); // Make sure this is the correct path

// // Set up multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadsDir); // Directory to save uploaded files
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`); // Rename the file with a timestamp
//   },
// });

// const upload = multer({ storage }); // Initialize multer with the storage settings

// //const uploadsDir = path.join(__dirname, '../uploads'); // Make sure this is the correct path

// // Middleware to verify and extract user ID from token
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
  
//   if (token == null) return res.sendStatus(401);
  
//   jwt.verify(token, 'd112b53441301142acc130612a2c67207fd87488cdf804d511bc6721a06d8001c6358a7e7c71d4a0b768bbc47d3e64b630e653976b517859f543d868115ee224', (err, user) => {
//     if (err) {
//       console.log('Invalid or expired token'); // Log message for invalid token
//       return res.status(403).json({ message: 'Invalid or expired token' });
//     }
//     req.user = user;
//     next();
//   });
// };

// // Function to hide a message in a PNG image
// const hideMessageInPng = (imagePath, message) => {
//   const img = PNG.sync.read(fs.readFileSync(imagePath));
//   const messageBinary = Buffer.from(message, 'utf8').toString('binary');

//   for (let i = 0; i < messageBinary.length; i++) {
//     if (i >= img.data.length / 4) {
//       throw new Error('Message is too long for the image');
//     }
//     const char = messageBinary[i].charCodeAt(0);
//     img.data[i * 4] = (img.data[i * 4] & 0xFE) | (char & 1); // Modify red channel
//   }

//   return PNG.sync.write(img);
// };

// // Function to split an image into two shares
// const splitImage = (imageBuffer) => {
//   const width = 300; // Example width
//   const height = 300; // Example height
//   const totalPixels = width * height;
  
//   const share1 = Buffer.alloc(totalPixels * 4); // 4 channels (RGBA)
//   const share2 = Buffer.alloc(totalPixels * 4); // 4 channels (RGBA)

//   for (let i = 0; i < totalPixels; i++) {
//     // Generate random binary values for the shares
//     const bit1 = Math.random() < 0.5 ? 0 : 255; // Randomly choose black or white
//     const bit2 = (bit1 === 0) ? 255 : 0; // Complement the first bit

//     // Fill each share with RGBA values
//     for (let channel = 0; channel < 4; channel++) {
//       share1[i * 4 + channel] = bit1; // Fill share1 with bit1 values
//       share2[i * 4 + channel] = bit2; // Fill share2 with bit2 values
//     }
//   }

//   return [share1, share2];
// };


// // Function to combine two shares into one image
// const combineShares = (shares) => {
//   if (!Array.isArray(shares) || shares.length !== 2) {
//     throw new Error('Invalid input: expected an array of two shares.');
//   }

//   const [share1, share2] = shares;

//   // Ensure both shares are Buffers
//   if (!Buffer.isBuffer(share1) || !Buffer.isBuffer(share2)) {
//     throw new Error('Both shares must be Buffer objects.');
//   }

//   // Create a buffer for the combined image
//   const combined = Buffer.alloc(share1.length);

//   for (let i = 0; i < share1.length; i++) {
//     // Combine the shares using bitwise OR operation
//     combined[i] = share1[i] | share2[i];
//   }

//   return combined;
// };

// // Route to get candidates for voting dropdown
// router.get('/candidates', async (req, res) => {
//   try {
//     const candidates = await pool.query('SELECT id, cname, party, symbol FROM candidate');
//     res.json(candidates.rows);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Route to fetch voting statistics
// router.get('/stats', async (req, res) => {
//   try {
//     // Query to count the total number of voters
//     const totalVotersQuery = 'SELECT COUNT(*) AS total_voters FROM valid_voters';
//     const totalVotersResult = await pool.query(totalVotersQuery);
//     const totalVoters = totalVotersResult.rows[0].total_voters;

//     // Query to count the number of votes cast
//     const votesCastQuery = 'SELECT COUNT(*) AS votes FROM votes WHERE has_voted = true';
//     const votesCastResult = await pool.query(votesCastQuery);
//     const votesCast = votesCastResult.rows[0].votes;

//     // Query to retrieve the voting percentages per candidate
//     const candidateVotesQuery = `
//       SELECT candidate_id, COUNT(*) AS vote_count
//       FROM votes
//       WHERE has_voted = true
//       GROUP BY candidate_id
//     `;
//     const candidateVotesResult = await pool.query(candidateVotesQuery);
//     const candidateVotes = candidateVotesResult.rows;

//     // Calculate the percentage of votes cast
//     const percentageVoted = ((votesCast / totalVoters) * 100).toFixed(2);

//     // Send the statistics as a response
//     res.status(200).json({
//       totalVoters,
//       votesCast,
//       percentageVoted,
//       candidateVotes,
//     });
//   } catch (error) {
//     console.error('Error fetching voting stats:', error);
//     res.status(500).json({ message: 'Error fetching voting statistics' });
//   }
// });

// // Use upload.single('stegoImage') to process the uploaded image file
// router.post('/vote', authenticateToken, upload.single('stegoImage'), async (req, res) => {
//   const userId = req.user.id;
//   const { candidateId } = req.body;
//   const stegoImage = req.file;

//   if (!stegoImage) {
//     return res.status(400).json({ message: 'No file uploaded' });
//   }

//   console.log('Candidate ID:', candidateId);
//   console.log('stegoImage:', stegoImage); // Log image details
//   try {
//     const imageData = stegoImage.path;

//     // Hide the candidate ID in the image using pngjs
//     const message = candidateId.toString();
//     const encodedImageBuffer = hideMessageInPng(imageData, message);

//       // Process the image with sharp (resize or modify)
//     const processedImageBuffer = await sharp(encodedImageBuffer)
//     .raw()
//     .toBuffer({ resolveWithObject: true });

//     // Here, you would likely want to use processedImageBuffer.data
//     // Ensure you are passing the correct buffer format
//     const [share1, share2] = splitImage(processedImageBuffer.data);

//     // Convert shares to PNG format before saving
//     const share1Path = path.join(uploadsDir, `share1-${userId}-${stegoImage.originalname}`);
//     const share2Path = path.join(uploadsDir, `share2-${userId}-${stegoImage.originalname}`);

//     await sharp(share1, { raw: { width: 300, height: 300, channels: 1 } }) // Update width and height
//       .toFile(share1Path);

//     await sharp(share2, { raw: { width: 300, height: 300, channels: 1 } })
//       .toFile(share2Path);

//     // Insert into votes table (storing the paths to both shares)
//     await pool.query(
//       'UPDATE votes SET share1_path = $2, share2_path = $3, has_voted=true WHERE user_id=$1',
//       [userId, share1Path, share2Path]
//     );

//     res.json({ message: 'Vote recorded with visual cryptography!' });
//   } catch (err) {
//     console.error('Error processing vote:', err);
//     res.status(500).send({ error: 'Server error', details: err.message });
//   }
// });

// // Route to tally votes by combining the visual cryptography shares
// router.get('/tallyVotes', authenticateToken, async (req, res) => {
//   try {
//     const votes = await pool.query('SELECT share1_path, share2_path FROM votes');
//     const voteCounts = {};

//     // Combine each pair of shares and decode the vote (candidate ID)
//     for (const vote of votes.rows) {
//       const share1Path = path.join(vote.share1_path);
//       const share2Path = path.join(vote.share2_path);
//       console.log(share1Path)
    
//       try {
//         const share1Data = fs.readFileSync(share1Path);
//         const share2Data = fs.readFileSync(share2Path);
//         console.log(share1Data)

//         const combinedImage = combineShares([share1Data, share2Data]);
//         const candidateIdLength = 1; // Adjust based on actual hidden message length
//         const candidateId = extractMessageFromPng(combinedImage, candidateIdLength);

//         if (!voteCounts[candidateId]) {
//           voteCounts[candidateId] = 0;
//         }
//         voteCounts[candidateId]++;
//       } catch (err) {
//         console.error(`Error processing vote for shares: ${share1Path}, ${share2Path}`, err);
//         continue; // Skip the current vote if an error occurs
//       }
//     }

//     // Get candidate details for display purposes
//     const candidates = await pool.query('SELECT id, cname, party FROM candidate');
//     const results = candidates.rows.map(candidate => ({
//       candidateId: candidate.id,
//       candidateName: candidate.cname,
//       party: candidate.party,
//       votes: voteCounts[candidate.id] || 0 // If no votes, count is 0
//     }));

//     res.json(results);
//   } catch (err) {
//     console.error('Error during tallying votes:', err);
//     res.status(500).json({ message: 'Error during tallying votes', details: err.message });
//   }
// });

// // const PNG = require('pngjs').PNG;

// function extractMessageFromPng(pngFilePath) {
//     const buffer = fs.readFileSync(pngFilePath);
    
//     // Check if file is a valid PNG
//     if (!isValidPng(buffer)) {
//         throw new Error('Invalid PNG file');
//     }

//     // Use pngjs to read the image
//     const png = PNG.sync.read(buffer);

//     // Process PNG content (based on your logic)
//     // Example: process pixel data, hidden message, etc.
//     console.log('PNG image width:', png.width);
//     console.log('PNG image height:', png.height);

//     // Continue with your logic to extract the message...
// }

// function isValidPng(buffer) {
//     return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
// }

// module.exports = router;

///////////////////04.10//////////////////////////////////////////////////
// const express = require('express');
// const router = express.Router();
// const pool = require('../config/db');
// const jwt = require('jsonwebtoken');
// const fs = require('fs');
// const path = require('path');
// const multer = require('multer');
// const sharp = require('sharp');
// const { PNG } = require('pngjs');

// const uploadsDir = path.join(__dirname, '../uploads');

// // Set up multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadsDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage });

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
  
//   if (token == null) return res.status(401).json({ message: 'No token provided' });
  
//   jwt.verify(token, 'd112b53441301142acc130612a2c67207fd87488cdf804d511bc6721a06d8001c6358a7e7c71d4a0b768bbc47d3e64b630e653976b517859f543d868115ee224', (err, user) => {
//     if (err) return res.status(403).json({ message: 'Invalid token' });
//     req.user = user;
//     next();
//   });
// };

// // Function to encode a message in a PNG image


// // Function to split an image into two shares
// const splitImage = async (imageBuffer) => {
//   const { width, height } = await sharp(imageBuffer).metadata();
//   const totalPixels = width * height;

//   const share1 = Buffer.alloc(totalPixels * 4);
//   const share2 = Buffer.alloc(totalPixels * 4);

//   const image = await sharp(imageBuffer).raw().toBuffer();

//   for (let i = 0; i < totalPixels * 4; i += 4) {
//     const randomBit = Math.random() < 0.5 ? 0 : 255;
//     share1[i] = share1[i + 1] = share1[i + 2] = randomBit;
//     share2[i] = share2[i + 1] = share2[i + 2] = image[i] ^ randomBit;
//     share1[i + 3] = share2[i + 3] = 255; // Alpha channel
//   }

//   return [
//     await sharp(share1, { raw: { width, height, channels: 4 } }).png().toBuffer(),
//     await sharp(share2, { raw: { width, height, channels: 4 } }).png().toBuffer()
//   ];
// };

// // Function to combine two shares into one image
// const combineShares = async (shares) => {
//   const [share1, share2] = await Promise.all(shares.map(share => 
//     sharp(share).raw().toBuffer({ resolveWithObject: true })
//   ));

//   if (share1.info.width !== share2.info.width || share1.info.height !== share2.info.height) {
//     throw new Error('Shares must have the same dimensions');
//   }

//   const combinedImage = Buffer.alloc(share1.data.length);
//   for (let i = 0; i < share1.data.length; i++) {
//     combinedImage[i] = share1.data[i] ^ share2.data[i];
//   }

//   return sharp(combinedImage, { raw: share1.info }).png().toBuffer();
// };

// // Function to extract a message from a PNG image
// const extractMessageFromPng = async (imageBuffer) => {
//   const img = await sharp(imageBuffer).raw().toBuffer({ resolveWithObject: true });
//   let message = '';

//   for (let i = 0; i < img.data.length; i += 4) {
//     const bit = img.data[i] & 1;
//     message += bit.toString();
//   }

//   // Convert binary string to text
//   const binaryString = message.match(/.{1,8}/g);
//   const text = binaryString.map(binary => String.fromCharCode(parseInt(binary, 2))).join('');

//   return text;
// };

// // Route to get candidates for voting dropdown
// router.get('/candidates', async (req, res) => {
//   try {
//     const candidates = await pool.query('SELECT id, cname, party, symbol FROM candidate');
//     res.json(candidates.rows);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Route to fetch voting statistics
// router.get('/stats', async (req, res) => {
//   try {
//     // Query to count the total number of voters
//     const totalVotersQuery = 'SELECT COUNT(*) AS total_voters FROM valid_voters';
//     const totalVotersResult = await pool.query(totalVotersQuery);
//     const totalVoters = totalVotersResult.rows[0].total_voters;

//     // Query to count the number of votes cast
//     const votesCastQuery = 'SELECT COUNT(*) AS votes FROM votes WHERE has_voted = true';
//     const votesCastResult = await pool.query(votesCastQuery);
//     const votesCast = votesCastResult.rows[0].votes;

//     // Query to retrieve the voting percentages per candidate
//     const candidateVotesQuery = `
//       SELECT candidate_id, COUNT(*) AS vote_count
//       FROM votes
//       WHERE has_voted = true
//       GROUP BY candidate_id
//     `;
//     const candidateVotesResult = await pool.query(candidateVotesQuery);
//     const candidateVotes = candidateVotesResult.rows;

//     // Calculate the percentage of votes cast
//     const percentageVoted = ((votesCast / totalVoters) * 100).toFixed(2);

//     // Send the statistics as a response
//     res.status(200).json({
//       totalVoters,
//       votesCast,
//       percentageVoted,
//       candidateVotes,
//     });
//   } catch (error) {
//     console.error('Error fetching voting stats:', error);
//     res.status(500).json({ message: 'Error fetching voting statistics' });
//   }
// });

// // Function to encode a message in a PNG image
// const encodeMessageInPng = async (imagePath, message) => {
//   try {
//     // Read the image file
//     const imageBuffer = await fs.promises.readFile(imagePath);
    
//     // Load the image using sharp
//     const img = await sharp(imageBuffer).raw().toBuffer({ resolveWithObject: true });
    
//     const messageBits = message.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join('');

//     for (let i = 0; i < messageBits.length; i++) {
//       const pixelIndex = i * 4; // 4 channels per pixel (RGBA)
//       img.data[pixelIndex] = (img.data[pixelIndex] & 0xFE) | parseInt(messageBits[i]);
//     }

//     return sharp(img.data, { raw: img.info }).png().toBuffer();
//   } catch (error) {
//     console.error('Error encoding message in PNG:', error);
//     throw error;
//   }
// };

// // Route to post a vote
// router.post('/vote', authenticateToken, upload.single('stegoImage'), async (req, res) => {
//   const userId = req.user.id;
//   const { candidateId } = req.body;
//   const stegoImage = req.file;

//   if (!stegoImage) {
//     return res.status(400).json({ message: 'No file uploaded' });
//   }

//   try {
//     const message = candidateId.toString();
    
//     // Use the file path instead of buffer
//     const encodedImageBuffer = await encodeMessageInPng(stegoImage.path, message);
    
//     const [share1, share2] = await splitImage(encodedImageBuffer);

//     const share1Path = path.join(uploadsDir, `share1-${userId}-${stegoImage.originalname}`);
//     const share2Path = path.join(uploadsDir, `share2-${userId}-${stegoImage.originalname}`);

//     await sharp(share1).toFile(share1Path);
//     await sharp(share2).toFile(share2Path);

//     await pool.query(
//       'UPDATE votes SET share1_path = $2, share2_path = $3, has_voted=true WHERE user_id=$1',
//       [userId, share1Path, share2Path]
//     );

//     res.json({ message: 'Vote recorded with visual cryptography!' });
//   } catch (err) {
//     console.error('Error processing vote:', err);
//     res.status(500).send({ error: 'Server error', details: err.message });
//   }
// });

// // Route to tally votes
// // Route to tally votes
// // Route to tally votes
// router.get('/tallyVotes', authenticateToken, async (req, res) => {
//   try {
//     const votes = await pool.query('SELECT share1_path, share2_path FROM votes WHERE has_voted = true');
//     console.log(`Total votes to process: ${votes.rows.length}`);

//     const voteCounts = {};

//     for (const vote of votes.rows) {
//       const share1Path = vote.share1_path;
//       const share2Path = vote.share2_path;

//       try {
//         console.log(`Processing vote - Share1: ${share1Path}, Share2: ${share2Path}`);

//         const share1Buffer = await fs.promises.readFile(share1Path);
//         const share2Buffer = await fs.promises.readFile(share2Path);

//         const combinedImage = await combineShares([share1Buffer, share2Buffer]);
//         const candidateId = await extractMessageFromPng(combinedImage);

//         console.log(`Extracted candidateId: ${candidateId}`);

//         if (!voteCounts[candidateId]) {
//           voteCounts[candidateId] = 0;
//         }
//         voteCounts[candidateId]++;

//         console.log(`Updated vote count for candidate ${candidateId}: ${voteCounts[candidateId]}`);
//       } catch (err) {
//         console.error(`Error processing vote for shares: ${share1Path}, ${share2Path}`, err);
//         continue; // Skip if an error occurs
//       }
//     }

//     console.log('Final vote counts:', voteCounts);

//     // Get candidate details for display purposes
//     const candidates = await pool.query('SELECT id, cname, party FROM candidate');
//     const results = candidates.rows.map(candidate => {
//       const votes = voteCounts[candidate.id.toString()] || 0;
//       console.log(`Candidate ${candidate.id} (${candidate.cname}): ${votes} votes`);
//       return {
//         candidateId: candidate.id,
//         candidateName: candidate.cname,
//         party: candidate.party,
//         votes: votes
//       };
//     });

//     console.log('Final results:', results);

//     res.json(results);
//   } catch (err) {
//     console.error('Error during tallying votes:', err);
//     res.status(500).json({ message: 'Error during tallying votes', details: err.message });
//   }
// });
// module.exports = router;

const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
const { PNG } = require('pngjs');

const uploadsDir = path.join(__dirname, '../uploads');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

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

// Function to encode a message in a PNG image


// Function to split an image into two shares
const splitImage = async (imageBuffer) => {
  const { width, height } = await sharp(imageBuffer).metadata();
  const totalPixels = width * height;

  const share1 = Buffer.alloc(totalPixels * 4);
  const share2 = Buffer.alloc(totalPixels * 4);

  const image = await sharp(imageBuffer).raw().toBuffer();

  for (let i = 0; i < totalPixels * 4; i += 4) {
    const randomBit = Math.random() < 0.5 ? 0 : 255;
    share1[i] = share1[i + 1] = share1[i + 2] = randomBit;
    share2[i] = share2[i + 1] = share2[i + 2] = image[i] ^ randomBit;
    share1[i + 3] = share2[i + 3] = 255; // Alpha channel
  }

  return [
    await sharp(share1, { raw: { width, height, channels: 4 } }).png().toBuffer(),
    await sharp(share2, { raw: { width, height, channels: 4 } }).png().toBuffer()
  ];
};

// Function to combine two shares into one image
const combineShares = async (shares) => {
  const [share1, share2] = await Promise.all(shares.map(share => 
    sharp(share).raw().toBuffer({ resolveWithObject: true })
  ));

  if (share1.info.width !== share2.info.width || share1.info.height !== share2.info.height) {
    throw new Error('Shares must have the same dimensions');
  }

  const combinedImage = Buffer.alloc(share1.data.length);
  for (let i = 0; i < share1.data.length; i++) {
    combinedImage[i] = share1.data[i] ^ share2.data[i];
  }

  return sharp(combinedImage, { raw: share1.info }).png().toBuffer();
};

// Function to extract a message from a PNG image
const extractMessageFromPng = async (imageBuffer) => {
  const img = await sharp(imageBuffer).raw().toBuffer({ resolveWithObject: true });
  let extractedBytes = Buffer.alloc(4); // Assuming the candidate ID is a 32-bit integer

  for (let i = 0; i < 32; i++) {
    const pixelIndex = i * 4;
    const bit = img.data[pixelIndex] & 1;
    extractedBytes[Math.floor(i / 8)] |= bit << (7 - (i % 8));
  }

  const candidateId = extractedBytes.readUInt32BE(0);
  console.log('Extracted candidate ID:', candidateId);
  return candidateId.toString();
};

// Route to get candidates for voting dropdown
router.get('/candidates', async (req, res) => {
  try {
    const candidates = await pool.query('SELECT id, cname, party, symbol FROM candidate');
    res.json(candidates.rows);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route to fetch voting statistics
router.get('/stats', async (req, res) => {
  try {
    //const currentElection = await pool.query('SELECT id, end_date, result_date FROM elections WHERE end_date < NOW() ORDER BY end_date DESC LIMIT 1');
    // const currentElection = await pool.query('SELECT id, end_date, result_date FROM elections WHERE end_date > NOW() OR result_date > NOW() ORDER BY end_date DESC LIMIT 1');
    // if (currentElection.rows.length === 0) {
    //   return res.status(404).json({ message: 'No finished election found' });
    // }
    // Get the latest election
    const currentElection = await pool.query('SELECT id, end_date, result_date FROM elections ORDER BY end_date DESC LIMIT 1');
    
    // If there's no election, return an error
    if (currentElection.rows.length === 0) {
      return res.status(404).json({ message: 'No elections found' });
    }
    const electionId = currentElection.rows[0].id;
    const endDate = currentElection.rows[0].end_date;
    const resultDate = currentElection.rows[0].result_date;
    // Query to count the total number of voters
    const totalVotersQuery = 'SELECT COUNT(*) AS total_voters FROM valid_voters';
    const totalVotersResult = await pool.query(totalVotersQuery);
    const totalVoters = totalVotersResult.rows[0].total_voters;

    // Query to count the number of votes cast
    const votesCastQuery = 'SELECT COUNT(*) AS votes FROM votes WHERE has_voted = true AND election_id = $1';
    const votesCastResult = await pool.query(votesCastQuery, [electionId]);
    const votesCast = votesCastResult.rows[0].votes;

    // Query to retrieve the voting percentages per candidate
    const candidateVotesQuery = `
      SELECT candidate_id, COUNT(*) AS vote_count
      FROM votes
      WHERE has_voted = true AND election_id = $1
      GROUP BY candidate_id
    `;
    const candidateVotesResult = await pool.query(candidateVotesQuery, [electionId]);
    const candidateVotes = candidateVotesResult.rows;

    // Calculate the percentage of votes cast
    const percentageVoted = ((votesCast / totalVoters) * 100).toFixed(2);

    // Send the statistics as a response
    res.status(200).json({
      totalVoters,
      votesCast,
      percentageVoted,
      candidateVotes,
      activeElection: {
        end_date: endDate.toISOString(),
        result_date: resultDate.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching voting stats:', error);
    res.status(500).json({ message: 'Error fetching voting statistics' });
  }
});

// Function to encode a message in a PNG image
const encodeMessageInPng = async (imageBuffer, message) => {
  const img = await sharp(imageBuffer).raw().toBuffer({ resolveWithObject: true });
  const messageBytes = Buffer.from(message, 'utf-8');

  for (let i = 0; i < messageBytes.length; i++) {
    for (let bit = 0; bit < 8; bit++) {
      const pixelIndex = (i * 8 + bit) * 4;
      img.data[pixelIndex] = (img.data[pixelIndex] & 0xFE) | ((messageBytes[i] >> (7 - bit)) & 1);
    }
  }

  return sharp(img.data, { raw: img.info }).png().toBuffer();
};

// Route to post a vote
router.post('/vote', authenticateToken, upload.single('stegoImage'), async (req, res) => {
  const userId = req.user.id;
  const { candidateId , electionId } = req.body;

   // Check if user has already voted
   const checkVote = await pool.query('SELECT has_voted FROM votes WHERE user_id = $1 AND election_id = $2', [userId, electionId]);
   if (checkVote.rows[0].has_voted) {
     return res.status(403).json({ message: 'You have already voted' });
   }

  const stegoImage = req.file;

  if (!stegoImage) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const message = Buffer.alloc(4);
    message.writeUInt32BE(parseInt(candidateId), 0);
    const encodedImageBuffer = await encodeMessageInPng(fs.readFileSync(stegoImage.path), message);
    const [share1, share2] = await splitImage(encodedImageBuffer);

    const share1Path = path.join(uploadsDir, `share1-${userId}-${stegoImage.originalname}`);
    const share2Path = path.join(uploadsDir, `share2-${userId}-${stegoImage.originalname}`);

    await sharp(share1).toFile(share1Path);
    await sharp(share2).toFile(share2Path);

    console.log('Updating vote with the following data:');
    console.log('userId:', userId);
    console.log('electionId:', electionId);
    console.log('share1Path:', share1Path);
    console.log('share2Path:', share2Path);

    await pool.query(
      'UPDATE votes SET share1_path = $3, share2_path = $4, has_voted = true,election_id = $2 WHERE user_id = $1 ',
      [userId, electionId, share1Path, share2Path]
    );

    res.json({ message: 'Vote recorded with visual cryptography!' });
    res.redirect('/dashboard'); // Redirect to dashboard
  } catch (err) {
    console.error('Error processing vote:', err);
    res.status(500).send({ error: 'Server error', details: err.message });
  }
});

// router.get('/hasVoted', authenticateToken, async (req, res) => {
//   const userId = req.user.id;
//   const { electionId } = req.query;

//   try {
//     const result = await pool.query(
//       'SELECT has_voted FROM votes WHERE user_id = $1 AND election_id = $2',
//       [userId, electionId]
//     );
//     if (result.rows.length > 0) {
//       const hasVoted = result.rows[0].has_voted;
//       return res.json({ hasVoted });
//     }
//     return res.json({ hasVoted: false });
//   } catch (err) {
//     console.error('Error fetching voting status:', err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });


router.get('/elections', async (req, res) => {
  try {
    const elections = await pool.query('SELECT id FROM elections');
    res.json(elections.rows);
  } catch (err) {
    res.status(500).send(err);
  }
});
// Route to tally votes

router.get('/tallyVotes', authenticateToken, async (req, res) => {
  try {
    //const currentElection = await pool.query('SELECT id FROM elections WHERE end_date < NOW() ORDER BY end_date DESC LIMIT 1');
    const currentElection = await pool.query('SELECT id, end_date FROM elections ORDER BY end_date DESC LIMIT 1');
    if (currentElection.rows.length === 0) {
      return res.status(404).json({ message: 'No finished election found' });
    }
    const electionId = currentElection.rows[0].id;
    const votes = await pool.query('SELECT share1_path, share2_path FROM votes WHERE has_voted = true AND election_id = $1', [electionId]);
    console.log(`Total votes to process: ${votes.rows.length}`);

    const voteCounts = {};

    for (const vote of votes.rows) {
      const share1Path = vote.share1_path;
      const share2Path = vote.share2_path;

      try {
        console.log(`Processing vote - Share1: ${share1Path}, Share2: ${share2Path}`);

        const share1Buffer = await fs.promises.readFile(share1Path);
        const share2Buffer = await fs.promises.readFile(share2Path);

        const combinedImage = await combineShares([share1Buffer, share2Buffer]);
        const candidateId = await extractMessageFromPng(combinedImage);

        console.log(`Extracted candidateId: ${candidateId}`);

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
module.exports = router;