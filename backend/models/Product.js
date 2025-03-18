const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  isExclusive: { type: Boolean, default: false },
  image: { type: String }  // This stores the image path
});

module.exports = mongoose.model('Product', productSchema);