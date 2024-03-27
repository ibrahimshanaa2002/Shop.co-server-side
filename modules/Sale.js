const mongoose = require("mongoose");

const SaleSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Sale = mongoose.model("Sale", SaleSchema);

module.exports = Sale;
