const express = require("express");
const router = express.Router();
const { userAuth } = require("../middleware/authMiddleware");
const { verifyCaptcha } = require("../middleware/captchaMiddleware");
const {
  signup,
  login,
  googleAuth,
  forgotPassword,
  resetPassword,
  getUserProfile
} = require("../controllers/authController");

// Public routes with CAPTCHA verification
router.post("/signup", verifyCaptcha, signup);
router.post("/login", verifyCaptcha, login);
router.post("/google-auth", googleAuth);
router.post("/forgot-password", verifyCaptcha, forgotPassword);
router.post("/reset-password", resetPassword);

// Protected routes
router.get("/profile", userAuth, getUserProfile);

module.exports = router;

