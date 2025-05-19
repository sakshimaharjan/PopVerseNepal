const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");
const bcrypt = require("bcryptjs");

// Cloudinary storage setup for profile pictures
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile-pictures",
    format: async (req, file) => "png",
    public_id: (req, file) => `user-${req.user.id}-${Date.now()}`,
  },
});

const upload = multer({ storage });

// Get current user profile
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Find user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    
    const updatedUser = await user.save();
    
    // Return updated user without password
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profilePicture: updatedUser.profilePicture,
      createdAt: updatedUser.createdAt
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Change password
router.put("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Find user with password
    const user = await User.findById(req.user.id).select("+password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Check if current password matches
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Upload profile picture
router.post("/profile-picture", protect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }
    
    // Get image URL from Cloudinary
    const imageUrl = req.file.path;
    
    // Update user profile with new image URL
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // If user already has a profile picture, delete the old one from Cloudinary
    if (user.profilePicture && user.profilePicture.includes("cloudinary")) {
      try {
        // Extract the public_id from the Cloudinary URL
        const publicId = user.profilePicture.split("/").pop().split(".")[0];
        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(`profile-pictures/${publicId}`);
      } catch (cloudinaryError) {
        console.error("Error deleting old profile picture:", cloudinaryError);
        // Continue with profile update even if image deletion fails
      }
    }
    
    user.profilePicture = imageUrl;
    await user.save();
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
