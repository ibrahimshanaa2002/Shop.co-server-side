const express = require("express");
const {
  addProductToCart,
  getProductsInCart,
  deleteProductFromCart,
  getCartItemCount,
  deleteAllFromTheCartByUserId,
} = require("../controllers/cartControllers");
const { protect } = require("../middlewares/authMiddleWare");
const router = express.Router();

router.post("/addToCart/:productId", protect, addProductToCart);
router.get("/cart", protect, getProductsInCart);
router.delete("/delete/:productId", protect, deleteProductFromCart);
router.get("/cart/item-count", protect, getCartItemCount);
router.delete("/deleteAllFromTheCart",protect,deleteAllFromTheCartByUserId)

module.exports = router;
