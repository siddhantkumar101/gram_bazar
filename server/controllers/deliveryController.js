const Delivery = require("../models/Delivery");
const Order = require("../models/Order");
const sendWhatsApp = require("../utils/sendWhatsApp");

const getPendingDeliveries = async (req, res, next) => {
  try {
    const deliveries = await Delivery.find({ status: "pending" }).populate({
      path: "order",
      populate: [{ path: "listing", select: "title" }, { path: "buyer", select: "phone name" }]
    });
    res.json({ success: true, data: { deliveries }, message: "Pending deliveries fetched" });
  } catch (error) {
    next(error);
  }
};

const acceptDelivery = async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ success: false, data: {}, message: "Delivery not found" });
    delivery.partner = req.user._id;
    delivery.status = "accepted";
    delivery.timestamps.acceptedAt = new Date();
    await delivery.save();
    res.json({ success: true, data: { delivery }, message: "Delivery accepted" });
  } catch (error) {
    next(error);
  }
};

const completeDelivery = async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.params.id).populate({
      path: "order",
      populate: { path: "buyer", select: "phone" }
    });
    if (!delivery) return res.status(404).json({ success: false, data: {}, message: "Delivery not found" });
    delivery.status = "delivered";
    delivery.timestamps.deliveredAt = new Date();
    await delivery.save();

    await Order.findByIdAndUpdate(delivery.order._id, { status: "delivered" });
    try {
      await sendWhatsApp(delivery.order.buyer.phone, "Your GramBazaar delivery has arrived.");
    } catch (err) {
      console.log("[DELIVERY] WhatsApp message failed", err.message);
    }

    req.io.emit("delivery:updated", { deliveryId: delivery._id.toString(), status: "delivered" });
    res.json({ success: true, data: { delivery }, message: "Delivery completed" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPendingDeliveries, acceptDelivery, completeDelivery };
