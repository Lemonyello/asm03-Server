const Order = require("../../models/order");
const User = require("../../models/user");

exports.getDashboard = async (req, res, next) => {
  try {
    const date = new Date().toJSON().slice(0, 10);
    const orders = await Order.find().sort({ createdAt: "desc" });

    const users = await User.find({ role: "user" });

    res.status(200).json({
      orders,
      users: users.length,
      earningsMon: orders
        .filter((order) =>
          order.createdAt.toJSON().startsWith(date.slice(0, 8))
        )
        .reduce((sum, order) => sum + order.bill, 0),
      newOrder: orders.filter((order) =>
        order.createdAt.toJSON().startsWith(date)
      ).length,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
