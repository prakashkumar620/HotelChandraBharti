const Booking = require("../models/Booking");
const User = require("../models/User");
const { sendBookingStatusEmail } = require("../services/emailService");

// Create Booking
const createBooking = async (req, res) => {
  try {
    const { userId, bookingType, name, email, phone, guests, bookingDate, bookingTime, specialRequests, contactMethod } = req.body;

    if (!bookingType || !name || !email || !phone || !guests || !bookingDate || !bookingTime) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    if (!["table", "room", "hall"].includes(bookingType)) {
      return res.status(400).json({ error: "Invalid booking type" });
    }

    const newBooking = new Booking({
      userId,
      bookingType,
      name,
      email,
      phone,
      guests,
      bookingDate: new Date(bookingDate),
      bookingTime,
      specialRequests,
      contactMethod
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking created successfully. Admin will confirm shortly.", booking: newBooking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get User Bookings
const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({ userId }).sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Booking
const getBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id).populate("userId", "name email phone");
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Booking Status (Accept, Reject, Cancel)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["confirmed", "rejected", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
    
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Send email notification to user
    try {
      await sendBookingStatusEmail(booking.email, {
        name: booking.name,
        status: status,
        bookingType: booking.bookingType,
        bookingDate: booking.bookingDate,
        bookingTime: booking.bookingTime,
        guests: booking.guests
      });
    } catch (emailError) {
      console.error("Email notification failed:", emailError);
      // Don't fail the request if email fails
    }

    res.json({ message: `Booking ${status} successfully`, booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel Booking (User can cancel their own booking)
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndUpdate(id, { status: "cancelled" }, { new: true });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBooking,
  updateBookingStatus,
  cancelBooking
};
