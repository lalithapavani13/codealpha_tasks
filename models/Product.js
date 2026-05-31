const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    shortDescription: { type: String },
    description: { type: String },
    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      enum: ['electronics', 'fashion', 'home'],
    },
    price: { type: Number, required: true },
    image: { type: String },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
