const express = require("express");
const { body } = require("express-validator");
const {
  getListings,
  createListing,
  getListingById,
  updateListing,
  deleteListing
} = require("../controllers/listingController");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.get("/", getListings);
router.post(
  "/",
  protect,
  authorize("seller", "admin"),
  upload.array("images", 4),
  [body("title").notEmpty(), body("description").notEmpty(), body("price").isFloat({ min: 0 })],
  createListing
);
router.get("/:id", getListingById);
router.put("/:id", protect, updateListing);
router.delete("/:id", protect, deleteListing);

module.exports = router;
