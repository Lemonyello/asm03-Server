const express = require("express");
const ctrlProduct = require("../../controllers/user/products");

const router = express.Router();

router.get("/products", ctrlProduct.getProducts);

router.get("/get/:productId", ctrlProduct.getProduct);

router.post("/quantity", ctrlProduct.getQuantity);

module.exports = router;
