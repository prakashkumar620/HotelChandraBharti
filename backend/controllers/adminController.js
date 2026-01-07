const Admin = require("../models/Admin");
const MenuItem = require("../models/MenuItem");
const User = require("../models/User");
const Message = require("../models/Message");
const Booking = require("../models/Booking");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      // Return 404 to indicate "not an admin" - lets frontend try user login
      return res.status(404).json({ error: "Admin not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid admin credentials" });
    }

    const token = jwt.sign({ adminId: admin._id, email: admin.email, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create Default Admin (if no admin exists)
const createDefaultAdmin = async (req, res) => {
  try {
    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const defaultEmail = "durgaprasadsaw@gmail.com";
    const defaultPassword = "durgapummi";
    const defaultName = "Hotel Admin";

    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    const newAdmin = new Admin({
      name: defaultName,
      email: defaultEmail,
      password: hashedPassword,
      role: "owner"
    });

    await newAdmin.save();
    res.status(201).json({
      message: "Default admin created successfully",
      email: defaultEmail,
      password: defaultPassword
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Dashboard Stats
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalMessages = await Message.countDocuments();
    const todayBookings = await Booking.countDocuments({
      bookingDate: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999))
      }
    });

    res.json({
      totalUsers,
      totalBookings,
      todayBookings,
      totalMessages
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Menu (Admin)
const getMenuAdmin = async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add Menu Item
const addMenuItem = async (req, res) => {
  try {
    const { name, description, category, price, priceHalf, priceFull, image } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ error: "Name, category, and price are required" });
    }

    const newItem = new MenuItem({
      name,
      description,
      category,
      price,
      priceHalf,
      priceFull,
      image
    });

    await newItem.save();
    res.status(201).json({ message: "Menu item added successfully", item: newItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Menu Item
const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedItem = await MenuItem.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.json({ message: "Menu item updated successfully", item: updatedItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Menu Item
const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await MenuItem.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Block/Unblock User
const blockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    const user = await User.findByIdAndUpdate(id, { isBlocked }, { new: true });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: `User ${isBlocked ? "blocked" : "unblocked"} successfully`, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Bookings
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("userId", "name email phone").sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Booking Status
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "rejected", "cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json({ message: "Booking status updated", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Booking
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBooking = await Booking.findByIdAndDelete(id);
    if (!deletedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Messages
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Message Reply
const replyToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyMessage } = req.body;

    const message = await Message.findByIdAndUpdate(
      id,
      { replyMessage, isReplied: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json({ message: "Reply sent successfully", data: message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Message
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMessage = await Message.findByIdAndDelete(id);
    if (!deletedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }
    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Change Admin Password
const changePassword = async (req, res) => {
  try {
    const { adminId, oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "New passwords do not match" });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
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
};
