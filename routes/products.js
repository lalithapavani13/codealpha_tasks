const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const filter = {};
    const category = req.query.category ? String(req.query.category).trim().toLowerCase() : undefined;
    if (category) {
      filter.category = category;
    }
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    res.status(500).json({ message: "Unable to retrieve products" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Failed to fetch product:', error);
    res.status(500).json({ message: 'Unable to retrieve product' });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, shortDescription, description, category, price, image, stock } = req.body;

    if (!name || price == null || !category) {
      return res.status(400).json({ message: "Name, category and price are required." });
    }

    const newProduct = new Product({
      name,
      shortDescription,
      description,
      category: String(category).trim().toLowerCase(),
      price,
      image,
      stock,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Failed to create product:", error);
    res.status(500).json({ message: "Unable to create product" });
  }
});

module.exports = router;
