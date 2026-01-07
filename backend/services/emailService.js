const nodemailer = require("nodemailer");

let transporter;

// Create transporter for Gmail
const createTransporter = () => {
  console.log("Creating Gmail transporter with user:", process.env.EMAIL_USER);
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Initialize transporter
const initializeTransporter = () => {
  if (!transporter) {
    transporter = createTransporter();
    // Verify transporter connection
    transporter.verify((error, success) => {
      if (error) {
        console.error("Email transporter verification failed:", error);
      } else {
        console.log("✅ Email transporter is ready:", success);
      }
    });
  }
  return transporter;
};

// Send OTP Email
const sendOtpEmail = async (to, otp) => {
  try {
    console.log("📧 Sending OTP email to:", to);
    const emailTransporter = initializeTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: "Your OTP Code - Hotel Chandra Bharti",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
            <h2 style="color: #2c3e50;">Your OTP Code</h2>
            <p>Hello,</p>
            <p>Your one-time password for Hotel Chandra Bharti is:</p>
            <div style="background-color: #e9ecef; padding: 15px; margin: 20px 0; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 3px;">
              ${otp}
            </div>
            <p>This code is valid for 5 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 14px; color: #6c757d;">
              Best regards,<br>
              <strong>Hotel Chandra Bharti Team</strong>
            </p>
          </div>
        </div>
      `,
    };

    const info = await emailTransporter.sendMail(mailOptions);
    console.log("✅ OTP email sent successfully:", info.response);
    return info;
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    throw error;
  }
};

// Send Booking Confirmation Email
const sendBookingEmail = async (to, bookingDetails) => {
  try {
    const emailTransporter = initializeTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: "Booking Confirmation - Hotel Chandra Bharti",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
            <h2 style="color: #2c3e50;">Booking Confirmation</h2>
            <p>Hello ${bookingDetails.name},</p>
            <p>Your booking request has been submitted successfully. Our team will confirm your booking shortly.</p>
            <div style="background-color: #e9ecef; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p><strong>Booking Details:</strong></p>
              <p>Type: ${bookingDetails.bookingType}</p>
              <p>Date: ${new Date(bookingDetails.bookingDate).toLocaleDateString()}</p>
              <p>Time: ${bookingDetails.bookingTime}</p>
              <p>Guests: ${bookingDetails.guests}</p>
            </div>
            <p>You will receive a confirmation email once admin approves your booking.</p>
            <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 14px; color: #6c757d;">
              Best regards,<br>
              <strong>Hotel Chandra Bharti Team</strong>
            </p>
          </div>
        </div>
      `,
    };

    const info = await emailTransporter.sendMail(mailOptions);
    console.log("Booking confirmation email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending booking email:", error);
    throw error;
  }
};

// Send Contact Form Reply
const sendContactReply = async (to, reply) => {
  try {
    const emailTransporter = initializeTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: "Re: Your Message - Hotel Chandra Bharti",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
            <h2 style="color: #2c3e50;">We've Responded to Your Message</h2>
            <p>Hello,</p>
            <p>Thank you for contacting Hotel Chandra Bharti. Here's our response:</p>
            <div style="background-color: #e9ecef; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p>${reply}</p>
            </div>
            <p>If you have any further questions, please don't hesitate to contact us.</p>
            <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 14px; color: #6c757d;">
              Best regards,<br>
              <strong>Hotel Chandra Bharti Team</strong>
            </p>
          </div>
        </div>
      `,
    };

    const info = await emailTransporter.sendMail(mailOptions);
    console.log("Contact reply email sent:", info.response);
    return info;
  } catch (error) {
    console.error("Error sending contact reply:", error);
    throw error;
  }
};

// Send Booking Status Email (Confirmed, Rejected, Cancelled)
const sendBookingStatusEmail = async (to, bookingDetails) => {
  try {
    const emailTransporter = initializeTransporter();
    
    const statusMessages = {
      confirmed: { title: "✅ Booking Confirmed", color: "#28a745" },
      rejected: { title: "❌ Booking Rejected", color: "#dc3545" },
      cancelled: { title: "⛔ Booking Cancelled", color: "#fd7e14" }
    };

    const statusInfo = statusMessages[bookingDetails.status];

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: `${statusInfo.title} - Hotel Chandra Bharti`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
            <h2 style="color: ${statusInfo.color};">${statusInfo.title}</h2>
            <p>Hello ${bookingDetails.name},</p>
            <p>Your booking request has been <strong>${bookingDetails.status}</strong> by our admin team.</p>
            <div style="background-color: #e9ecef; padding: 15px; margin: 20px 0; border-radius: 5px;">
              <p><strong>Booking Details:</strong></p>
              <p>Type: ${bookingDetails.bookingType}</p>
              <p>Date: ${new Date(bookingDetails.bookingDate).toLocaleDateString()}</p>
              <p>Time: ${bookingDetails.bookingTime}</p>
              <p>Guests: ${bookingDetails.guests}</p>
            </div>
            ${bookingDetails.status === "confirmed" 
              ? "<p><strong>Thank you for choosing Hotel Chandra Bharti! We look forward to hosting you.</strong></p>" 
              : bookingDetails.status === "rejected"
              ? "<p>If you have any questions, please contact us.</p>"
              : "<p>Your booking has been cancelled. If you'd like to make another reservation, feel free to contact us.</p>"
            }
            <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 14px; color: #6c757d;">
              Best regards,<br>
              <strong>Hotel Chandra Bharti Team</strong>
            </p>
          </div>
        </div>
      `,
    };

    const info = await emailTransporter.sendMail(mailOptions);
    console.log("✅ Booking status email sent:", info.response);
    return info;
  } catch (error) {
    console.error("❌ Error sending booking status email:", error);
    throw error;
  }
};

module.exports = {
  sendOtpEmail,
  sendBookingEmail,
  sendContactReply,
  sendBookingStatusEmail,
};
