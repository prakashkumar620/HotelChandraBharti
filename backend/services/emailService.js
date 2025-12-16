const nodemailer = require("nodemailer");

let transporter;

async function createTransporter() {
  // Development/Test environment with ethereal.email
  if (process.env.NODE_ENV !== 'production') {
    try {
      const testAccount = await nodemailer.createTestAccount();
      const devTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('Using ethereal.email for email in development');
      return devTransporter;
    } catch (error) {
      console.warn('Failed to create ethereal test account, falling back to Gmail');
    }
  }

  // Production with Gmail or other SMTP service
  const config = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      // Do not fail on invalid certs
      rejectUnauthorized: process.env.NODE_ENV === 'production' ? true : false
    },
    // Timeouts
    connectionTimeout: 30000, // 30 seconds
    greetingTimeout: 30000,   // 30 seconds
    socketTimeout: 60000,     // 60 seconds
    // Debug
    debug: process.env.NODE_ENV !== 'production',
    logger: process.env.NODE_ENV !== 'production'
  };

  // If service is specified, it will override host/port
  if (process.env.EMAIL_SERVICE) {
    config.service = process.env.EMAIL_SERVICE;
    delete config.host;
    delete config.port;
  }

  console.log('Creating email transporter with config:', {
    ...config,
    auth: { ...config.auth, pass: '***' } // Don't log password
  });

  return nodemailer.createTransport(config);
}

// Initialize transporter with retry logic
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds

async function initializeEmailService(retryCount = 0) {
  try {
    console.log(`Initializing email service (attempt ${retryCount + 1}/${MAX_RETRIES})`);
    
    // Create new transporter
    const newTransporter = await createTransporter();
    
    // Test the connection
    await newTransporter.verify();
    
    // If we get here, connection is good
    transporter = newTransporter;
    console.log('✅ Email server is ready to take our messages');
    return true;
    
  } catch (error) {
    console.error(`❌ Email service initialization failed (attempt ${retryCount + 1}):`, error.message);
    
    if (retryCount < MAX_RETRIES - 1) {
      console.log(`Retrying in ${RETRY_DELAY/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return initializeEmailService(retryCount + 1);
    } else {
      console.error('❌ Max retries reached. Email service is not available.');
      if (process.env.NODE_ENV !== 'production') {
        console.warn('In development, you can use ethereal.email for testing.');
      }
      return false;
    }
  }
}

// Start the email service
initializeEmailService().then(success => {
  if (!success) {
    console.warn('Email service is not available. Some features may not work.');
  }
});

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
