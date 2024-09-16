const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'infosecproject1012@gmail.com',
    pass: 'vosztzlkfnzdehlc'
  },
  logger: true,  // Enable logging
  debug: true,   // Enable debug output
});

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

module.exports = sendOtpEmail;
