const express = require("express");
const ctrlOrder = require("../../controllers/admin/order");

const router = express.Router();

router.get("/dashboard", ctrlOrder.getDashboard);

module.exports = router;
