const asyncHandler = require("express-async-handler");
const Product = require("../modules/Product");
const Sale = require("../modules/Sale");

// addproduct
const addProduct = asyncHandler(async (req, res) => {
  try {
    // Split color and size strings into arrays
    const colors = req.body.color.map((colorString) =>
      colorString.split(" ").map((color) => color.trim())
    );
    const sizes = req.body.size.map((sizeString) =>
      sizeString.split(" ").map((size) => size.trim())
    );

    const newProduct = new Product({
      ...req.body,
      color: colors.flat(),
      size: sizes.flat(),
    });

    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// updateProduct

const updatedProduct = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const updateFields = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateFields,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// arrivals
const newArrivals = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(16);

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// top selling
const topSelling = asyncHandler(async (req, res) => {
  try {
    // Find products sorted by totalQuantitySold in descending order
    const topSellingProducts = await Product.find()
      .sort({ totalQuantitySold: -1 })
      .limit(16);

    res.status(200).json(topSellingProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const allProducts = asyncHandler(async (req, res) => {
  const productId = req.params;

  try {
    const products = await Product.find();

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = {
  addProduct,
  updatedProduct,
  newArrivals,
  topSelling,
  allProducts,
};
