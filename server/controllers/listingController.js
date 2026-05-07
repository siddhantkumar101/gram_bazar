const { validationResult } = require("express-validator");
const Listing = require("../models/Listing");

const getListings = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;
    if (search) query.title = { $regex: search, $options: "i" };

    const items = await Listing.find(query)
      .populate("seller", "name phone location")
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    const total = await Listing.countDocuments(query);
    res.json({ success: true, data: { items, total, page: Number(page) }, message: "Listings fetched" });
  } catch (error) {
    next(error);
  }
};

const createListing = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, data: errors.array(), message: "Validation error" });
    
    const images = (req.files || []).map((f) => {
      // If Cloudinary is used, f.path contains the URL. If local, we need to construct the URL.
      if (f.path && f.path.startsWith('http')) {
        return f.path;
      }
      // Assuming local server
      const baseUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
      return `${baseUrl}/uploads/${f.filename}`;
    });

    const listing = await Listing.create({ ...req.body, images, seller: req.user._id, location: req.user.location });
    res.status(201).json({ success: true, data: { listing }, message: "Listing created" });
  } catch (error) {
    next(error);
  }
};

const getListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("seller", "name phone location bio ratings");
    if (!listing) return res.status(404).json({ success: false, data: {}, message: "Listing not found" });
    res.json({ success: true, data: { listing }, message: "Listing detail fetched" });
  } catch (error) {
    next(error);
  }
};

const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, data: {}, message: "Listing not found" });
    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, data: {}, message: "Not owner of listing" });
    }
    Object.assign(listing, req.body);
    await listing.save();
    res.json({ success: true, data: { listing }, message: "Listing updated" });
  } catch (error) {
    next(error);
  }
};

const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, data: {}, message: "Listing not found" });
    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, data: {}, message: "Not owner of listing" });
    }
    listing.isActive = false;
    await listing.save();
    res.json({ success: true, data: {}, message: "Listing deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getListings, createListing, getListingById, updateListing, deleteListing };
