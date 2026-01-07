const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const { sendOtpEmail } = require("./services/emailService");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const menuRoutes = require("./routes/menuRoutes");
const contactRoutes = require("./routes/contactRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/menu", menuRoutes);
app.use("/contact", contactRoutes);
app.use("/bookings", bookingRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ message: "Server is running" });
});

// Create default admin
app.get("/create-admin", async (req, res) => {
  try {
    const Admin = require("./models/Admin");
    const bcrypt = require("bcryptjs");
    
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return res.json({ message: "Admin already exists", admin: existingAdmin });
    }

    const hashedPassword = await bcrypt.hash("durgapummi", 10);
    const newAdmin = new Admin({
      name: "Hotel Admin",
      email: "durgaprasadsaw@gmail.com",
      password: hashedPassword,
      role: "owner",
      phone: "9876543210"
    });

    await newAdmin.save();
    res.status(201).json({
      message: "Default admin created successfully",
      admin: { id: newAdmin._id, name: newAdmin.name, email: newAdmin.email, role: newAdmin.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create test user for debugging
app.get("/create-test-user", async (req, res) => {
  try {
    const User = require("./models/User");
    const bcrypt = require("bcryptjs");
    
    const existingUser = await User.findOne({ email: "testuser@gmail.com" });
    if (existingUser) {
      return res.json({ message: "Test user already exists", user: { id: existingUser._id, name: existingUser.name, email: existingUser.email } });
    }

    const hashedPassword = await bcrypt.hash("testuser123", 10);
    const newUser = new User({
      name: "Test User",
      email: "testuser@gmail.com",
      phone: "9876543210",
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({
      message: "Test user created successfully",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
      credentials: { email: "testuser@gmail.com", password: "testuser123" }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test email endpoint
app.get("/test-email/:email", async (req, res) => {
  try {
    const testOtp = 123456;
    await sendOtpEmail(req.params.email, testOtp);
    res.json({ message: "Test email sent successfully!", email: req.params.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test login endpoint (NO CAPTCHA required - for development/testing)
app.post("/test-login", (req, res) => {
  try {
    console.log("✓ /test-login called");
    res.json({ status: "ok", message: "Test endpoint working" });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}\n`);
  console.log(`📋 AVAILABLE ENDPOINTS:`);
  console.log(`────────────────────────────────────────────`);
  console.log(`🔧 SETUP:`);
  console.log(`  - Create Admin: http://localhost:${PORT}/create-admin`);
  console.log(`  - Create Test User: http://localhost:${PORT}/create-test-user`);
  console.log(`\n🧪 TESTING (NO CAPTCHA REQUIRED):`);
  console.log(`  - Test Login (POST): http://localhost:${PORT}/test-login`);
  console.log(`    Body: {"email":"testuser@gmail.com","password":"testuser123"}`);
  console.log(`  - Test Email: http://localhost:${PORT}/test-email/your-email@gmail.com`);
  console.log(`\n✅ NORMAL ENDPOINTS (CAPTCHA REQUIRED):`);
  console.log(`  - Auth Login: POST /auth/login`);
  console.log(`  - Auth Signup: POST /auth/signup`);
  console.log(`  - Admin Login: POST /admin/login`);
  console.log(`────────────────────────────────────────────\n`);
});
