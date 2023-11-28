const Product = require("../../models/product");
const fs = require("fs");
const path = require("path");
const { url } = require("../../variables");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    res.status(200).json(
      products.map((product) => {
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

        return product;
      })
    );
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    if (req.files.length < 4) throw new Error("");

    req.files.slice(0, 4).forEach((img, i) => {
      req.body["img" + (i + 1)] = img.path.slice(7);
    });

    const product = new Product(req.body);

    await product.save();

    res.status(200).json({ msg: "Add product successfully." });
  } catch (error) {
    error.httpStatusCode = 1;
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndUpdate(req.body.productId, req.body);

    res.status(200).json({ msg: "Update product successfully." });
  } catch (error) {
    error.httpStatusCode = 1;

    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  const { productId } = req.body;
  try {
    const prod = await Product.findById(productId);

    for (let i = 1; i < 5; i++)
      fs.unlinkSync(
        path.join(
          path.dirname(require.main.filename),
          "images",
          prod["img" + i]
        )
      );

    await Product.findByIdAndDelete(productId);

    res.status(200).json({ msg: "Delete product successfully." });
  } catch (error) {
    next(error);
  }
};
