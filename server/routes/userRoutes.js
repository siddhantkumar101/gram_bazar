const express = require("express");
const { body } = require("express-validator");
const { protect } = require("../middleware/auth");
const { getPublicProfile, updateMe, rateUser } = require("../controllers/userController");

const router = express.Router();

router.patch("/me", protect, updateMe);
router.get("/:id", getPublicProfile);
router.post("/:id/rate", protect, [body("value").isInt({ min: 1, max: 5 })], rateUser);

module.exports = router;
