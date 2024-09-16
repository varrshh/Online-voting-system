const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const crypto = require('crypto');
require('dotenv').config();  // Load environment variables
const router = express.Router();
//vosz tzlk fnzd ehlc
// Nodemailer setup to send OTP emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'infosecproject1012@gmail.com',
    pass: 'vosztzlkfnzdehlc'
  },
  logger: true,  // Enable logging
  debug: true,   // Enable debug output
});

// Helper function to validate password strength
function validatePassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  return regex.test(password);
}

// Helper function to send verification email
const sendVerificationEmail = (email, token) => {
  const verificationLink = `http://localhost:5000/api/auth/verify/${token}`;
  
  const mailOptions = {
    from: 'infosecproject1012@gmail.com',
    to: email,
    subject: 'Account Verification',
    text: `Click the following link to verify your account: ${verificationLink}`
  };

  return transporter.sendMail(mailOptions);
};

// POST /auth/register - User Registration with National ID validation
router.post('/register', async (req, res) => {
  const { username, password, national_id, email } = req.body;  // Added email here
  console.log('Request Body:', req.body);  // Log the request body
  if (!username || !password || !email || !national_id) {
    console.log('Missing fields:', req.body);  // Log missing fields
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const otpSecret = speakeasy.generateSecret({ length: 20 });
    if (!username || !password || !email || !national_id) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    // Step 1: Validate the password strength
    if (!validatePassword(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.'
      });
    }
    
    const validVoterQuery = 'SELECT * FROM valid_voters WHERE national_id = $1';
    const validVoterResult = await pool.query(validVoterQuery, [national_id]);

    if (validVoterResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid National ID' });
    }

    const userExistsQuery = 'SELECT * FROM users WHERE national_id = $1';
    const userExistsResult = await pool.query(userExistsQuery, [national_id]);

    if (userExistsResult.rows.length > 0) {
      return res.status(400).json({ message: 'User already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Step 5: Generate the email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const insertUserQuery = 'INSERT INTO users (username, password, national_id, email, otp_secret, verification_token) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id';
    await pool.query(insertUserQuery, [username, hashedPassword, national_id, email, otpSecret.base32, verificationToken]);

    // Step 7: Send verification email
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      message: 'User registered successfully. Please verify your account before logging in.'
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error regisyer' });
  }
});

// POST /api/auth/login - User login with MFA
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

    // const mailOptions = {
    //   from: 'infosecproject1012@gmail.com',
    //   to: user.email,
    //   subject: 'Your One-Time Password (OTP)',
    //   text: `Your OTP code is: ${otp}. It is valid for 5 minutes.`
    // };

    //await transporter.sendMail(mailOptions);

    await pool.query('UPDATE users SET otp = $1, otp_generated_at = NOW() WHERE id = $2', [otp, user.id]);

    res.status(200).json({ message: 'OTP sent to your email', userId: user.id });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error login' });
  }
});

// POST /auth/verify-otp - Verify the OTP
router.post('/verify-otp', async (req, res) => {
  const { userId, otp } = req.body;

  try {
    // Fetch user from database
    const userQuery = 'SELECT * FROM users WHERE id = $1';
    const userResult = await pool.query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = userResult.rows[0];

    // Validate OTP using speakeasy
    const isValidOtp = speakeasy.totp.verify({
      secret: user.otp_secret,
      encoding: 'base32',
      token: otp,
      window: 1,  // Adjusts for slight time drift
    });

    if (!isValidOtp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check if the OTP has expired (validity of 5 minutes)
    const otpGeneratedAt = user.otp_generated_at;
    const otpAge = Date.now() - new Date(otpGeneratedAt).getTime();
    if (otpAge > 5 * 60 * 1000) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Generate a JWT token after OTP verification
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Clear OTP from the database after successful login
    await pool.query('UPDATE users SET otp = NULL WHERE id = $1', [user.id]);

    // Send the JWT token back to the client
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
});

// GET /verify/:token - Email Verification Route
router.get('/verify/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const userQuery = 'SELECT * FROM users WHERE verification_token = $1';
    const userResult = await pool.query(userQuery, [token]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired verification token.' });
    }

    const user = userResult.rows[0];

    await pool.query('UPDATE users SET is_verified = true, verification_token = NULL WHERE id = $1', [user.id]);

    // Optional: Redirect the user to the login page after successful verification
    res.redirect('/login');  // Redirect user to login page after verification (Optional)
    
    // Alternatively, you can send a success message if you're not using redirects
    // res.status(200).json({ message: 'Account verified successfully. You can now log in.' });
  } catch (error) {
    console.error('Error verifying account:', error);
    res.status(500).json({ message: 'Server error during email verification' });
  }
});

module.exports = router;
