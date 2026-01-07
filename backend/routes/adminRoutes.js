const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middleware/authMiddleware");
const { verifyCaptcha } = require("../middleware/captchaMiddleware");
const {
  adminLogin,
  createDefaultAdmin,
  getDashboardStats,
  getMenuAdmin,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getUsers,
  blockUser,
  deleteUser,
  getBookings,
  updateBookingStatus,
  deleteBooking,
  getMessages,
  replyToMessage,
  deleteMessage,
  changePassword
} = require("../controllers/adminController");

// Admin auth routes
// Protect admin login with CAPTCHA to prevent automated attempts
router.post("/login", verifyCaptcha, adminLogin);
router.get("/create-default-admin", createDefaultAdmin);

// Dashboard
router.get("/dashboard/stats", adminAuth, getDashboardStats);

// Menu management
router.get("/menu", adminAuth, getMenuAdmin);
router.post("/menu", adminAuth, addMenuItem);
router.put("/menu/:id", adminAuth, updateMenuItem);
router.delete("/menu/:id", adminAuth, deleteMenuItem);

// User management
router.get("/users", adminAuth, getUsers);
router.put("/users/:id/block", adminAuth, blockUser);
router.delete("/users/:id", adminAuth, deleteUser);

// Booking management
router.get("/bookings", adminAuth, getBookings);
router.put("/bookings/:id/status", adminAuth, updateBookingStatus);
router.delete("/bookings/:id", adminAuth, deleteBooking);

// Message management
router.get("/messages", adminAuth, getMessages);
router.put("/messages/:id/reply", adminAuth, replyToMessage);
router.delete("/messages/:id", adminAuth, deleteMessage);

// Settings
router.post("/change-password", adminAuth, changePassword);

module.exports = router;
