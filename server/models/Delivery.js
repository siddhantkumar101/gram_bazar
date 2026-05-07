const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    partner: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    status: {
      type: String,
      enum: ["pending", "accepted", "picked_up", "delivered"],
      default: "pending"
    },
    timestamps: {
      acceptedAt: Date,
      pickedUpAt: Date,
      deliveredAt: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Delivery", deliverySchema);
