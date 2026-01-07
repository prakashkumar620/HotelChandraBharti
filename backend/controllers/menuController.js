const MenuItem = require("../models/MenuItem");

// Get all menu items
exports.getMenu = async (req, res) => {
  try {
    const menu = await MenuItem.find().sort({ category: 1, name: 1 });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get menu by category
exports.getMenuByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const menu = await MenuItem.find({ category, isAvailable: true });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add menu item (admin only)
exports.addItem = async (req, res) => {
  try {
    const { name, description, category, price, priceHalf, priceFull, image } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ error: "Name, category, and price are required" });
    }

    const item = await MenuItem.create({
      name,
      description,
      category,
      price,
      priceHalf,
      priceFull,
      image
    });

    res.status(201).json({ message: "Menu item added successfully", item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Edit menu item (admin only)
exports.editItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findByIdAndUpdate(id, req.body, { new: true });

    if (!item) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.json({ message: "Menu item updated successfully", item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete menu item (admin only)
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
