const mongoose = require("mongoose");

const productScheme = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    image: { type: String, default: "" },
    category: {
      type: String,
      enum: ["Men", "Women", "Kids"],
    },
    sizes: [{ type: String }],
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productScheme);
