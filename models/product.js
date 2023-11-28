const { Schema, default: mongoose } = require("mongoose");

const productSchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  img1: {
    type: String,
    required: true,
  },
  img2: String,
  img3: String,
  img4: String,
  long_desc: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  short_desc: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
