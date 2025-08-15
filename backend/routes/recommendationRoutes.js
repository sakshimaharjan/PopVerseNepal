const express = require("express");
const router = express.Router();
const { getRecommendations } = require("../models/recommendation");
const { protect } = require("../middleware/authMiddleware");

router.get(
  "/products/:productId/recommendations",
  protect, // ensures req.user is available
  async (req, res) => {
    try {
      const { productId } = req.params;
      const userId = req.user._id; // now req.user is set
      const recommendations = await getRecommendations(productId, userId);
      res.status(200).json(recommendations);
    } catch (error) {
      console.error("Error in recommendation route:", error);
      res.status(500).json({
        message: "Failed to get recommendations",
        error: error.message,
      });
    }
  }
);

module.exports = router;