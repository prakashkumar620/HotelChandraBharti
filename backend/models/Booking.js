const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bookingType: { type: String, enum: ["table", "room", "hall"], required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  guests: { type: Number, required: true },
  bookingDate: { type: Date, required: true },
  bookingTime: { type: String, required: true },
  specialRequests: { type: String },
  status: { type: String, enum: ["pending", "confirmed", "rejected", "cancelled"], default: "pending" },
  contactMethod: { type: String, enum: ["whatsapp", "email", "phone"], default: "email" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
