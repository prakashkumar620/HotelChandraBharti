const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOtpEmail } = require("../services/emailService");
const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Signup
const signup = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      name, 
      email, 
      phone, 
      password: hashedPassword,
      authMethod: "email"
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Google Signup/Login with Token
const googleAuth = async (req, res) => {
  try {
    const { idToken, name, email } = req.body;

    if (!idToken || !email) {
      return res.status(400).json({ error: "Token and email are required" });
    }

    // Verify the token with Google
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (error) {
      return res.status(401).json({ error: "Invalid Google token" });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    
    if (user) {
      // User exists - check if they signed up with Google
      if (user.authMethod !== "google") {
        return res.status(400).json({ 
          error: "This email is registered with password login. Please use email/password to login." 
        });
      }
      
      if (user.isBlocked) {
        return res.status(403).json({ error: "Your account has been blocked by admin" });
      }
    } else {
      // Create new user with Google
      user = new User({
        name: name || payload.name || email.split("@")[0],
        email: email,
        googleId: payload.sub,
        authMethod: "google",
        phone: null
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        authMethod: user.authMethod,
        role: "user"
      }
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ error: error.message });
  }
};

// FIX: Login should support both Admin and Normal User
// Requirements:
// 1. Admin and User have separate MongoDB models (Admin, User)
// 2. Admin login → role = "admin"
// 3. User login → role = "user"
// 4. JWT token must include role
// 5. Blocked users must not login
// Rewrite the login function below according to the above requirements

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Email doesn't exist" });
    }

    // Check if user signed up with Google
    if (user.authMethod === "google") {
      return res.status(400).json({ 
        error: "This account was created with Google. Please login with Google." 
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({ error: "Your account has been blocked by admin" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Wrong password" });
    }

    const token = jwt.sign({ userId: user._id, email: user.email, role: "user" }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: "user" } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    
    // Use updateOne to avoid validation on other fields
    await User.updateOne(
      { email },
      {
        resetOtp: otp,
        resetOtpExpires: Date.now() + 5 * 60 * 1000 // 5 minutes
      }
    );

    // Send email asynchronously without blocking response
    sendOtpEmail(email, otp).catch((err) => {
      console.error("Failed to send OTP email:", err);
    });

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.resetOtp || !user.resetOtpExpires) {
      return res.status(400).json({ error: "OTP not requested. Please use forgot password first." });
    }

    if (user.resetOtp !== parseInt(otp)) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (Date.now() > user.resetOtpExpires) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Use updateOne to avoid validation on other fields
    await User.updateOne(
      { email },
      {
        password: hashedPassword,
        resetOtp: undefined,
        resetOtpExpires: undefined
      }
    );

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { signup, login, googleAuth, forgotPassword, resetPassword, getUserProfile };
