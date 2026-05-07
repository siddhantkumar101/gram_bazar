const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const { getPendingDeliveries, acceptDelivery, completeDelivery } = require("../controllers/deliveryController");

const router = express.Router();

router.get("/pending", protect, authorize("delivery_partner", "admin"), getPendingDeliveries);
router.patch("/:id/accept", protect, authorize("delivery_partner", "admin"), acceptDelivery);
router.patch("/:id/complete", protect, authorize("delivery_partner", "admin"), completeDelivery);

module.exports = router;
