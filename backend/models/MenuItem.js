const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["Starters", "Mains", "Drinks", "Desserts"],
    },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);