const express = require('express');
const { protect } = require('../middleware/auth');
const { placeOrder, getOrderHistory, getOrder } = require('../controllers/orderController');

const router = express.Router();

router.post('/', protect, placeOrder);
router.get('/', protect, getOrderHistory);
router.get('/:id', protect, getOrder);

module.exports = router;
