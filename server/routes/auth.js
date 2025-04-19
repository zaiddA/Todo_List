const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");

// Register user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 1, // Default to client role
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update user details
router.put("/updatedetails", protect, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update password
router.put("/updatepassword", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Logout user
router.get("/logout", (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res
    .status(200)
    .json({ success: true, message: "User logged out successfully" });
});

// Get current logged in user
router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.status(200).json({ success: true, data: user });
});

// Helper function to create and send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "30d" }
  );

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
};

module.exports = router;
