const mongoose = require("mongoose");

const RatingModel = mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String },
    rating: { type: Number, default: 0, required: true },
  },
  {
    timestamps: true,
  }
);

const Rating = mongoose.model("Rating", RatingModel);
module.exports = Rating;
