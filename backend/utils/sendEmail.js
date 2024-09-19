

const nodemailer = require('nodemailer');

// Email-sending utility function
const sendEmail = async (recipient, subject, message) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'infosecproject1012@gmail.com',
      pass:'xgkq jzlv vxww btms',
    },
  });

  const mailOptions = {
    from: 'infosecproject1012@gmail.com',
    to: recipient,
    subject: subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;

