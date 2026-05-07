const express = require("express");
const { body } = require("express-validator");
const { protect, authorize } = require("../middleware/auth");
const { createOrder, getMyOrders, getSellerOrders, updateOrderStatus } = require("../controllers/orderController");

const router = express.Router();

router.post("/", protect, [body("listingId").notEmpty()], createOrder);
router.get("/my", protect, getMyOrders);
router.get("/seller", protect, authorize("seller", "admin"), getSellerOrders);
router.patch("/:id/status", protect, authorize("seller", "admin"), updateOrderStatus);

module.exports = router;
