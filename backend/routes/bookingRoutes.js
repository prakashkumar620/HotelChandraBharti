const express = require("express");
const router = express.Router();
const { userAuth, adminAuth } = require("../middleware/authMiddleware");
const {
  createBooking,
  getUserBookings,
  getBooking,
  updateBookingStatus,
  cancelBooking
} = require("../controllers/bookingController");

// Create booking
router.post("/", createBooking);

// Get user bookings (protected)
router.get("/user/:userId", userAuth, getUserBookings);

// Get single booking
router.get("/:id", getBooking);

// Update booking status (Admin only) - Accept, Reject, Cancel
router.put("/:id/status", adminAuth, updateBookingStatus);

// Cancel booking (User)
router.put("/:id/cancel", userAuth, cancelBooking);

module.exports = router;
