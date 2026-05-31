const Order = require('../models/Order');
const Product = require('../models/Product');

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, address } = req.body;
    if (!items || !items.length) return res.status(400).json({ message: 'No items in order' });

    let total = 0;
    const processed = [];

    for (const item of items) {
      if (!item.product || !item.qty || item.qty <= 0) {
        return res.status(400).json({ message: 'Each order item must include a valid product ID and quantity' });
      }
      const prod = await Product.findById(item.product);
      if (!prod) return res.status(400).json({ message: 'Invalid product in order' });
      processed.push({ product: prod._id, name: prod.name, qty: item.qty, price: prod.price });
      total += prod.price * item.qty;
    }

    const order = await Order.create({ user: userId, items: processed, total, address });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate('items.product', 'name price image')
      .sort({ createdAt: -1 })
      .lean();
    res.json(orders);
  } catch (err) {
    console.error('getOrderHistory error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.userId })
      .populate('items.product', 'name price image')
      .lean();
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error('getOrder error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
