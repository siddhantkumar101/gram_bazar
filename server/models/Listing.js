const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ["Vegetables", "Grains", "Dairy", "Tools", "Services", "Animals", "Clothes", "Other"],
      default: "Other"
    },
    images: [{ type: String }],
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    location: {
      village: String,
      district: String,
      state: String
    },
    deliveryAvailable: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", listingSchema);
