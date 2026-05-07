const { validationResult } = require("express-validator");
const Order = require("../models/Order");
const Listing = require("../models/Listing");
const Delivery = require("../models/Delivery");
const sendWhatsApp = require("../utils/sendWhatsApp");

const createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, data: errors.array(), message: "Validation error" });

    const { listingId, quantity = 1, deliveryRequested = false } = req.body;
    const listing = await Listing.findById(listingId).populate("seller");
    if (!listing) return res.status(404).json({ success: false, data: {}, message: "Listing not found" });

    const order = await Order.create({
      listing: listing._id,
      buyer: req.user._id,
      seller: listing.seller._id,
      quantity,
      deliveryRequested
    });

    if (deliveryRequested) {
      await Delivery.create({ order: order._id, status: "pending" });
    }

    try {
      await sendWhatsApp(listing.seller.phone, `New GramBazaar order for ${listing.title}. Qty: ${quantity}`);
      order.whatsappNotified = true;
      await order.save();
    } catch (waErr) {
      console.log("[ORDER] WhatsApp notification failed", waErr.message);
    }

    res.status(201).json({ success: true, data: { order }, message: "Order placed" });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ buyer: req.user._id }).populate("listing seller", "title name price");
    res.json({ success: true, data: { orders }, message: "Buyer orders fetched" });
  } catch (error) {
    next(error);
  }
};

const getSellerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ seller: req.user._id }).populate("listing buyer", "title name phone");
    res.json({ success: true, data: { orders }, message: "Seller orders fetched" });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("buyer");
    if (!order) return res.status(404).json({ success: false, data: {}, message: "Order not found" });
    order.status = req.body.status;
    await order.save();
    res.json({ success: true, data: { order }, message: "Order status updated" });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, getSellerOrders, updateOrderStatus };
