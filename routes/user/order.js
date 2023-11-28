const express = require("express");
const ctrlOrder = require("../../controllers/user/order");

const router = express.Router();

router.post("/create", ctrlOrder.createOrder);

router.get("/orders/:userId", ctrlOrder.getOrders);

router.get("/order/:orderId", ctrlOrder.getOrder);

module.exports = router;
