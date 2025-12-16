const nodemailer = require("nodemailer");

// Create a test account for ethereal.email if in development
let transporter;

async function createTransporter() {
  if (process.env.NODE_ENV === 'test') {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  // Production/development with Gmail
  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false // Only for development/testing
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 5000, // 5 seconds
    socketTimeout: 10000, // 10 seconds
  });
}

// Initialize transporter
(async () => {
  try {
    transporter = await createTransporter();
    // Verify connection configuration
    await transporter.verify();
    console.log('Email server is ready to take our messages');
  } catch (error) {
    console.error('Email server configuration error:', error.message);
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Email sending will fail. In development, you can use ethereal.email for testing.');
    }
  }
})();

async function sendOtpEmail(to, otp) {
  if (!transporter) {
    throw new Error('Email transporter not initialized');
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"Hotel Chandra Bharti" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. Valid for 5 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Your OTP Code</h2>
        <p>Your one-time password is: <strong>${otp}</strong></p>
        <p>This code is valid for 5 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <hr>
        <p>Best regards,<br>Hotel Chandra Bharti Team</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    
    // In development/test, log the preview URL
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  } catch (error) {
    console.error('Email sending failed:', {
      error: error.message,
      to,
      time: new Date().toISOString()
    });
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

// Export for testing
module.exports = { 
  sendOtpEmail,
  createTransporter,
  getTransporter: () => transporter
};
