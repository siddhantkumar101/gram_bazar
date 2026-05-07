const express = require("express");
const { body } = require("express-validator");
const { register, login, logout, me } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", [body("name").notEmpty(), body("phone").notEmpty(), body("password").isLength({ min: 6 })], register);
router.post("/login", [body("phone").notEmpty(), body("password").notEmpty()], login);
router.post("/logout", logout);
router.get("/me", protect, me);

module.exports = router;
