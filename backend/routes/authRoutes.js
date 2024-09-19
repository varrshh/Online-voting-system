const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const crypto = require('crypto');

const router = express.Router();

// Nodemailer setup to send OTP emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'infosecproject1012@gmail.com',
    pass: 'xgkq jzlv vxww btms' // Use your generated App password
  }
});

// Helper function to send OTP emails
async function sendOtpEmail(userEmail, otp) {
  const mailOptions = {
    from: 'infosecproject1012@gmail.com',
    to: userEmail,
    subject: 'Your One-Time Password (OTP)',
    text: `Your OTP is: ${otp}. It's valid for 5 minutes.`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully.');
  } catch (error) {
    console.error('Error sending OTP email:', error);
  }
}

// POST /auth/register - User Registration
// router.post('/register', async (req, res) => {
//   const { username, password, national_id, email } = req.body;

//   if (!username || !password || !email || !national_id) {
//     return res.status(400).json({ message: 'All fields are required.' });
//   }

//   try {
//     const otpSecret = speakeasy.generateSecret({ length: 20 });

//     if (!validatePassword(password)) {
//       return res.status(400).json({
//         message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.'
//       });
//     }

//     const validVoterQuery = 'SELECT * FROM valid_voters WHERE national_id = $1';
//     const validVoterResult = await pool.query(validVoterQuery, [national_id]);

//     if (validVoterResult.rows.length === 0) {
//       return res.status(400).json({ message: 'Invalid National ID' });
//     }

//     const userExistsQuery = 'SELECT * FROM users WHERE national_id = $1';
//     const userExistsResult = await pool.query(userExistsQuery, [national_id]);

//     if (userExistsResult.rows.length > 0) {
//       return res.status(400).json({ message: 'User already registered' });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const verificationToken = crypto.randomBytes(32).toString('hex');

//     const insertUserQuery = 'INSERT INTO users (username, password, national_id, email, otp_secret, verification_token) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id';
//     await pool.query(insertUserQuery, [username, hashedPassword, national_id, email, otpSecret.base32, verificationToken]);

//     res.status(201).json({ message: 'User registered successfully. Please verify your account before logging in.' });
//   } catch (error) {
//     console.error('Error registering user:', error);
//     res.status(500).json({ message: 'Server error during registration' });
//   }
// });
// POST /auth/register - User Registration
router.post('/register', async (req, res) => {
  const { username, password, national_id, email } = req.body;

  if (!username || !password || !email || !national_id) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const otpSecret = speakeasy.generateSecret({ length: 20 });
    
    console.log('Generated OTP Secret:', otpSecret.base32); // Log the generated OTP secret

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const insertUserQuery = 'INSERT INTO users (username, password, national_id, email, otp_secret, verification_token) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id';
    //await pool.query(insertUserQuery, [username, hashedPassword, national_id, email, otpSecret.base32, verificationToken]);
    const userResult = await pool.query(insertUserQuery, [
      username,
      hashedPassword,
      national_id,
      email,
      otpSecret.base32,
      verificationToken
    ]);

    const userId = userResult.rows[0].id; // Get the newly created user's ID
    // Insert initial vote record for user with has_voted = false
    const insertVoteQuery = `
      INSERT INTO votes (user_id, encrypted_vote, vote_time, has_voted)
      VALUES ($1, NULL, NULL, false)
    `;
    await pool.query(insertVoteQuery, [userId]);

    res.status(201).json({ message: 'User registered successfully. Please verify your account before logging in.' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});
//"JJ5D6JRYKNUDSJTUHY5CUNBSERTGSVDG"
// POST /auth/login - User Login with OTP
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const userQuery = 'SELECT * FROM users WHERE username = $1';
    const userResult = await pool.query(userQuery, [username]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const otp = speakeasy.totp({
      secret: user.otp_secret,
      encoding: 'base32',
      step: 300 // OTP valid for 5 minutes
    });

    await pool.query('UPDATE users SET otp = $1, otp_generated_at = NOW() WHERE id = $2', [otp, user.id]);

    await sendOtpEmail(user.email, otp);
 // Include user_id in the JWT token
  const token = jwt.sign({ id: user.id, username: user.username }, 'd112b53441301142acc130612a2c67207fd87488cdf804d511bc6721a06d8001c6358a7e7c71d4a0b768bbc47d3e64b630e653976b517859f543d868115ee224', { expiresIn: '1h' });
    res.status(200).json({ message: 'OTP sent to your email', userId: user.id ,token});
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});



const otplib = require('otplib');


// POST /auth/verify-otp - Verify OTP
// router.post('/verify-otp', async (req, res) => {
//   const { userId, otp } = req.body;

//   try {
//     // Fetch the user from the database using their ID
//     const userQuery = 'SELECT * FROM users WHERE id = $1';
//     const userResult = await pool.query(userQuery, [userId]);

//     if (userResult.rows.length === 0) {
//       return res.status(400).json({ message: 'User not found' });
//     }

//     const user = userResult.rows[0];

//     // Log the OTP secret and the provided OTP for debugging
//     console.log('OTP Secret from DB:', user.otp_secret);
//     console.log('OTP provided by user:', otp);

//     // Validate OTP using otplib (Authenticator)
//     const isValidOtp = otplib.authenticator.verify({
//       secret: user.otp_secret,  // The secret used to generate the OTP
//       token: otp,               // The OTP provided by the user
//     });

//     // If the OTP is invalid, return an error
//     if (!isValidOtp) {
//       console.log('Invalid OTP');
//       return res.status(400).json({ message: 'Invalid OTP' });
//     }

//     // Optional: Check if the OTP has expired (based on your use case)
//     const otpGeneratedAt = user.otp_generated_at;
//     const otpAge = Date.now() - new Date(otpGeneratedAt).getTime();
//     console.log('OTP Generated At:', new Date(otpGeneratedAt).getTime());
//     console.log('OTP Age (ms):', otpAge);

//     // If OTP is older than 5 minutes, mark it as expired
//     if (otpAge > 5 * 60 * 1000) {
//       console.log('OTP expired');
//       return res.status(400).json({ message: 'OTP expired' });
//     }

//     // Generate a JWT token after successful OTP verification
//     const token = jwt.sign(
//       { id: user.id, username: user.username },
//       process.env.JWT_SECRET || 'd112b53441301142acc130612a2c67207fd87488cdf804d511bc6721a06d8001c6358a7e7c71d4a0b768bbc47d3e64b630e653976b517859f543d868115ee224',  // Use your JWT secret
//       { expiresIn: '1h' }  // Token expiration time
//     );

//     // Clear the OTP after successful login
//     await pool.query('UPDATE users SET otp = NULL WHERE id = $1', [user.id]);

//     // Send the JWT token back to the client
//     res.status(200).json({ token });
//   } catch (error) {
//     console.error('Error verifying OTP:', error);
//     res.status(500).json({ message: 'Server error during OTP verification' });
//   }
// });
router.post('/verify-otp', async (req, res) => {
  const { userId, otp } = req.body;

  try {
    // Retrieve user details
    const userQuery = 'SELECT * FROM users WHERE id = $1';
    const userResult = await pool.query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = userResult.rows[0];

    // Log both the OTP secret and provided OTP for debugging
    console.log('OTP Secret from DB:', user.otp_secret);   // Base32 secret from DB
    console.log('OTP provided by user:', otp);             // OTP entered by the user

    // Increase time window to accommodate for time differences
    const isValidOtp = otplib.authenticator.check(otp, user.otp_secret, { window: 3 }); // Increase window size to 3
    
    // if (!isValidOtp) {
    //   console.log('Invalid OTP is');
    //   return res.status(400).json({ message: 'Invalid OTP' });
    // }

    // Check if the OTP has expired (validity of 5 minutes)
    const otpGeneratedAt = user.otp_generated_at;
    const otpAge = Date.now() - new Date(otpGeneratedAt).getTime();
    if (otpAge > 5 * 60 * 1000) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Generate a JWT token after OTP verification
    const token = jwt.sign({ id: user.id, username: user.username }, 'd112b53441301142acc130612a2c67207fd87488cdf804d511bc6721a06d8001c6358a7e7c71d4a0b768bbc47d3e64b630e653976b517859f543d868115ee224', { expiresIn: '1h' });

    // Clear OTP from the database after successful login
    await pool.query('UPDATE users SET otp = NULL WHERE id = $1', [user.id]);

    // Send the JWT token back to the client
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
});


module.exports = router;




