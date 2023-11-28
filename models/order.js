const { default: mongoose } = require("mongoose");
const { Schema } = require("mongoose");

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    products: [
      {
        _id: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    payStatus: {
      type: String,
      required: true,
    },
    deliveryStatus: {
      type: String,
      required: true,
    },
    bill: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
