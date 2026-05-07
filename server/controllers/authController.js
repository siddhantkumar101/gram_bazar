const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const generateTokens = require("../utils/generateToken");

const cookieOptions = {
  httpOnly: true,
  secure: true, // Always true for cross-site cookies
  sameSite: "none" // Required for Vercel -> Render cross-site requests
};

const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, data: errors.array(), message: "Validation error" });

    const { name, phone, password, role, location } = req.body;
    const existing = await User.findOne({ phone });
    if (existing) return res.status(409).json({ success: false, data: {}, message: "Phone already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, phone, password: hashed, role, location });
    const { accessToken, refreshToken } = generateTokens(user._id.toString());
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(201).json({ success: true, data: { user }, message: "Registered successfully (mock OTP verified)" });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, data: errors.array(), message: "Validation error" });

    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.status(401).json({ success: false, data: {}, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, data: {}, message: "Invalid credentials" });

    const { accessToken, refreshToken } = generateTokens(user._id.toString());
    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ success: true, data: { user }, message: "Login successful" });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ success: true, data: {}, message: "Logged out" });
};

const me = async (req, res) => {
  res.json({ success: true, data: { user: req.user }, message: "Current user" });
};

module.exports = { register, login, logout, me };
