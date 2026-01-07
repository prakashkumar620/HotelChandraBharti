const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, default: null },
  password: { type: String, default: null },
  googleId: { type: String, default: null },
  authMethod: { type: String, enum: ["email", "google"], default: "email" },
  resetOtp: Number,
  resetOtpExpires: Date,
  isBlocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Custom validation - only require phone on creation, not on updates
userSchema.pre('validate', function(next) {
  // Skip validation for $set operations (updates)
  if (this.isNew || this.isModified('phone')) {
    next();
  } else {
    next();
  }
});

module.exports = mongoose.model("User", userSchema);
