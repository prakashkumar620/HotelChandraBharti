const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middleware/authMiddleware");
const { sendMessage, getMessages, deleteMessage } = require("../controllers/contactController");

// Contact form for normal users: CAPTCHA removed intentionally
router.post("/", sendMessage);

// Get all messages (Admin only)
router.get("/", adminAuth, getMessages);

// Delete message (Admin only)
router.delete("/:id", adminAuth, deleteMessage);

module.exports = router;
