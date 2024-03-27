const express = require("express");
const {
  addProduct,
  updatedProduct,
  newArrivals,
  topSelling,
  allProducts,
} = require("../controllers/productController");
const Product = require("../modules/Product");
const router = express.Router();

router.post("/addproduct", addProduct);
router.put("/product/:productId", updatedProduct);
router.delete("/product/:productId", async (req, res) => {
  const productId = req.params.productId;

  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/newArrivals", newArrivals);
router.get("/topSelling", topSelling);
router.get("/allProducts", allProducts);

module.exports = router;
