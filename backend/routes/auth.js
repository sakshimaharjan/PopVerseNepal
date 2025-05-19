const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const { protect, admin } = require("../middleware/authMiddleware")

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  })
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body

    // Check if user exists
    const userExists = await User.findOne({ email })

    if (userExists) {
      const error = new Error("User already exists")
      error.status = 400
      throw error
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    })

    if (user) {
      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        token: generateToken(user._id),
      })
    } else {
      const error = new Error("Invalid user data")
      error.status = 400
      throw error
    }
  } catch (error) {
    next(error)
  }
})

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Check for user email
    const user = await User.findOne({ email }).select("+password")

    if (!user) {
      const error = new Error("Invalid credentials")
      error.status = 401
      throw error
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      const error = new Error("Invalid credentials")
      error.status = 401
      throw error
    }

    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      token: generateToken(user._id),
    })
  } catch (error) {
    next(error)
  }
})

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get("/profile", protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      })
    } else {
      const error = new Error("User not found")
      error.status = 404
      throw error
    }
  } catch (error) {
    next(error)
  }
})

// Get user count (admin only)
router.get("/users/count", protect, admin, async (req, res) => {
  try {
    const count = await User.countDocuments()
    console.log(`User count: ${count}`)
    res.json({ count })
  } catch (error) {
    console.error("Error getting user count:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
