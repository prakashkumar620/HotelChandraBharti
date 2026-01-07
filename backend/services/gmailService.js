const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false // Only for development/testing
  }
});

// Verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('❌ Email server connection error:', error.message);
  } else {
    console.log('✅ Email server is ready to take our messages');
  }
});

async function sendOtpEmail(to, otp) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Your Password Reset OTP - Hotel Chandra Bharti',
    text: `Your OTP is ${otp}. Valid for 5 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
          <h2 style="color: #2c3e50;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password. Use the following OTP to proceed:</p>
          <div style="background-color: #e9ecef; padding: 15px; margin: 20px 0; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px;">
            ${otp}
          </div>
          <p>This OTP is valid for 5 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 14px; color: #6c757d;">
            Best regards,<br>
            <strong>Hotel Chandra Bharti Team</strong>
          </p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', to);
    return info;
  } catch (error) {
    console.error('Email sending failed:', {
      to,
      error: error.message,
      time: new Date().toISOString()
    });
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

module.exports = { sendOtpEmail };
