const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middleware/authMiddleware");
const { getMenu, getMenuByCategory, addItem, editItem, deleteItem } = require("../controllers/menuController");

// Public routes
router.get("/", getMenu);
router.get("/category/:category", getMenuByCategory);

// Admin routes
router.post("/", adminAuth, addItem);
router.put("/:id", adminAuth, editItem);
router.delete("/:id", adminAuth, deleteItem);

module.exports = router;
