const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const defaultSeasons = ["winter", "summer", "spring", "fall"];

const seasonEnum = {
  values: defaultSeasons,
  message: `Invalid season. Must be one of: ${defaultSeasons.join(", ")}.`,
};

const ProductModel = mongoose.Schema(
  {
    title: { type: String },
    desc: { type: String },
    img: { type: String },
    category: { type: String },//ma wslt
    size: { type: Array },
    season: {
      type: String,
      enum: seasonEnum,
      default: () => defaultSeasons[0],
      required: true,
    },
    color: { type: Array },
    style: { type: String },
    newprice: { type: Number },
    oldprice: { type: Number },
    quantity: { type: Number },//ma st3mlnaha haleyyan
    availableQuantity:{type:Number},//mas st3malnaha haleyan . msln 50 w talab 2 bsero yn2so
    sex: {
      type: String,
      enum: ["Men", "Women", "Kids"],
      required: true,
    },
    totalQuantitySold: { type: Number, default: 0 },// ma st3malnaha bs ymkn n3taza bl top sellings
  },
  {
    timestamps: true,
  }
);


const Product = mongoose.model("Product", ProductModel);
module.exports = Product;
