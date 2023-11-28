const Product = require("../../models/product");
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

exports.getProduct = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId);

    const relatedProds = await Product.find({
      category: product.category,
      _id: {
        $ne: productId,
      },
    });

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

    res.status(200).json({
      product,
      relatedProds: relatedProds.map((product) => {
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
      }),
    });
  } catch (error) {
    next(error);
  }
};

exports.getQuantity = async (req, res, next) => {
  try {
    const { productId, amountToBuy } = req.body;

    const product = await Product.findById(productId);

    if (product.quantity < amountToBuy)
      res.status(400).json({ msg: "There are not enough products in stock." });

    res.status(200).send();
  } catch (error) {
    next(error);
  }
};
