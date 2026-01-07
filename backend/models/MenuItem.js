const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, enum: ["Veg", "Non-Veg", "Drinks", "Desserts", "Appetizers"], required: true },
  price: { type: Number, required: true },
  priceHalf: { type: Number },
  priceFull: { type: Number },
  image: { type: String },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("MenuItem", menuSchema);
