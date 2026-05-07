const User = require("../models/User");
const Listing = require("../models/Listing");
const Order = require("../models/Order");

const getPublicProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ success: false, data: {}, message: "User not found" });
    const listings = await Listing.find({ seller: user._id, isActive: true });
    const avgRating =
      user.ratings.length > 0
        ? user.ratings.reduce((sum, item) => sum + item.value, 0) / user.ratings.length
        : 0;
    res.json({ success: true, data: { user, listings, avgRating }, message: "Public profile fetched" });
  } catch (error) {
    next(error);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-password");
    res.json({ success: true, data: { user }, message: "Profile updated" });
  } catch (error) {
    next(error);
  }
};

const rateUser = async (req, res, next) => {
  try {
    const { value } = req.body;
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ success: false, data: {}, message: "User not found" });

    const deliveredOrder = await Order.findOne({
      buyer: req.user._id,
      seller: targetUser._id,
      status: "delivered"
    });
    if (!deliveredOrder) return res.status(400).json({ success: false, data: {}, message: "No delivered order found" });

    targetUser.ratings.push({ from: req.user._id, value });
    await targetUser.save();
    res.json({ success: true, data: { ratings: targetUser.ratings }, message: "Rating added" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPublicProfile, updateMe, rateUser };
