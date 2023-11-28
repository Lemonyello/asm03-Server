const Order = require("../../models/order");
const Product = require("../../models/product");
const { sendMail } = require("./mail");
const { url } = require("../../variables");

exports.createOrder = async (req, res, next) => {
  try {
    const failItems = [];

    for (const prod of req.body.products) {
      const p = await Product.findById(prod._id);

      if (p.quantity < prod.quantity) failItems.push(prod._id);
    }

    if (failItems.length)
      return res
        .status(400)
        .json({ failItems, msg: "Some products don't have enough in stock." });

    const order = new Order(req.body);

    for (const prod of req.body.products) {
      const p = await Product.findById(prod._id);

      p.quantity -= prod.quantity;

      await p.save();
    }

    const { _id } = await order.save();

    const savedOrder = await Order.findById(_id)
      .populate("userId products._id")
      .exec();

    sendMail(savedOrder);

    res.status(200).json({ msg: "Create order successfully." });
  } catch (err) {
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

exports.getOrder = async (req, res, next) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId).populate("products._id").exec();

    order.products.map((prod) => {
      const product = prod._id;
      product.img1 = product.img1.includes("funix")
        ? product.img1
        : url + "/images/" + product.img1;
      product.img2 = product.img2.includes("funix")
        ? product.img2
        : url + "/images/" + product.img2;
      product.img3 = product.img3.includes("funix")
        ? product.img3
        : url + "/images/" + product.img3;
      product.img4 = product.img4.includes("funix")
        ? product.img4
        : url + "/images/" + product.img4;

      return prod;
    });

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};
