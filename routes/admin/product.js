const express = require("express");
const ctrlProduct = require("../../controllers/admin/product");

const router = express.Router();

router.get("/products", ctrlProduct.getProducts);

router.post("/create", ctrlProduct.createProduct);

router.patch("/edit", ctrlProduct.updateProduct);

router.delete("/delete", ctrlProduct.deleteProduct);

module.exports = router;
