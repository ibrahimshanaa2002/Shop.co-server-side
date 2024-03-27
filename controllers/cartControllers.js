const asyncHandler = require("express-async-handler");
const Cart = require("../modules/Cart");
const Product = require("../modules/Product");

const addProductToCart = asyncHandler(async (req, res) => {
  const { color, size, quantity } = req.body;
  let { productId } = req.params;

  try {
    // Remove any additional characters from productId
    productId = productId.replace(":", "");

    // Get the user ID from the request
    const userId = req.user._id;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Create a new cart item
    const cartItem = new Cart({
      productId,
      userId,
      quantity,
      size,
      color,
    });

    // Save the cart item to the database
    await cartItem.save();

    // Return success response
    return res
      .status(200)
      .json({ message: "Product added to cart successfully", cartItem });
  } catch (error) {
    // Handle any errors
    console.error("Error adding product to cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get products added to cart by a user
const getProductsInCart = asyncHandler(async (req, res) => {
  try {
    // Get the user ID from the request
    const userId = req.user._id;

    // Find all cart items associated with the user ID and populate the product details
    const cartItems = await Cart.find({ userId }).populate({
      path: "productId",
      select: "title price img newprice", // Select the fields you need
    });

    // Extract product details from cart items
    const productsInCart = cartItems.map((cartItem) => {
      return {
        _id: cartItem.productId._id,
        title: cartItem.productId.title,
        price: cartItem.productId.price,
        img: cartItem.productId.img, // Include the img field
        newprice: cartItem.productId.newprice, // Include the newprice field
        quantity: cartItem.quantity,
        size: cartItem.size,
        color: cartItem.color,
      };
    });

    // Return the products in the cart
    return res.status(200).json({ productsInCart });
  } catch (error) {
    // Handle any errors
    console.error("Error fetching products from cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const deleteProductFromCart = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    // Remove any additional characters from productId
    const cleanedProductId = productId.replace(":", "");

    // Find the cart item to delete
    const cartItem = await Cart.findOneAndDelete({
      productId: cleanedProductId,
      userId,
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    return res
      .status(200)
      .json({ message: "Product removed from cart successfully" });
  } catch (error) {
    console.error("Error deleting product from cart:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const getCartItemCount = asyncHandler(async (req, res) => {
  try {
    // Get the user ID from the request
    const userId = req.user._id;

    // Find all cart items associated with the user ID
    const cartItems = await Cart.find({ userId });

    // Count the number of items in the cart
    const itemCount = cartItems.reduce(
      (total, cartItem) => total + cartItem.quantity,
      0
    );

    // Return the count of items in the cart
    return res.status(200).json({ itemCount });
  } catch (error) {
    // Handle any errors
    console.error("Error fetching cart items:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
const deleteAllFromTheCartByUserId = async (req, res) => {
  try {
    // Extract user ID from the request object (assuming it's available after authentication)
    const userId = req.user._id; // Assuming the user ID is stored in req.user after authentication

    // Delete all cart items related to the user ID
    await Cart.deleteMany({ userId: userId });

    // Send a success response
    res.status(200).json({ success: true, message: 'All items removed from the cart successfully.' });
  } catch (error) {
    // Handle errors
    console.error('Error deleting cart items:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

module.exports = {
  addProductToCart,
  getProductsInCart,
  deleteProductFromCart,
  getCartItemCount,
  deleteAllFromTheCartByUserId
};
