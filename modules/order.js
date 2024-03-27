// Order.js

const mongoose = require("mongoose");
const Product = require("./Product");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user who placed the order
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // References to the products ordered
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    phoneNumber: { type: Number, required: true },
    streetAddress: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: Number, required: true },
    size: { type: Array, required: true },
    color: { type: Array },
    email: { type: String },
    name: { type: String },
    quantity: { type: Number },
  },
  { timestamps: true }
);
orderSchema.pre("save", async function (next) {
  try {
    const order = this;
    const products = await Product.find({ _id: { $in: order.products } });

    // Update totalQuantitySold for each product
    products.forEach((product) => {
      const orderedQuantity = order.quantity || 1; // Assuming each order line has a quantity, defaulting to 1
      product.totalQuantitySold += orderedQuantity;
      product.save();
    });

    next();
  } catch (error) {
    next(error);
  }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
