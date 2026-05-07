const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    value: { type: Number, min: 1, max: 5, required: true }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["buyer", "seller", "delivery_partner", "admin"], default: "buyer" },
    location: {
      village: String,
      district: String,
      state: String
    },
    profilePic: String,
    ratings: [ratingSchema],
    bio: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
