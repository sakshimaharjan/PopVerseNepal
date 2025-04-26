const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Protect routes - verify token
const protect = async (req, res, next) => {
  let token

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1]
      console.log("Token received:", token ? "Valid token" : "No token")

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      console.log("Token decoded successfully")

      // Get user from token
      req.user = await User.findById(decoded.id).select("-password")

      if (!req.user) {
        console.log("User not found with token ID")
        return res.status(401).json({ message: "User not found" })
      }

      console.log(`User authenticated: ${req.user.email}, isAdmin: ${req.user.isAdmin}`)
      next()
    } catch (error) {
      console.error("Error in auth middleware:", error)
      res.status(401).json({ message: "Not authorized, token failed" })
    }
  } else {
    console.log("No authorization token found in request")
    res.status(401).json({ message: "Not authorized, no token" })
  }
}

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    console.log("Admin access granted")
    next()
  } else {
    console.log("Admin access denied for user:", req.user ? req.user.email : "unknown")
    res.status(403).json({ message: "Not authorized as admin" })
  }
}

module.exports = { protect, admin }
