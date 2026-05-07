const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quantity: { type: Number, default: 1, min: 1 },
    deliveryRequested: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "accepted", "picked_up", "delivered", "cancelled"],
      default: "pending"
    },
    whatsappNotified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
