const express = require("express")
const router = express.Router()
const { getRecommendations } = require("../models/recommendation")

// Route to get recommendations for a specific product
router.get("/products/:productId/recommendations", async (req, res) => {
  try {
    const { productId } = req.params

    // Get recommendations from the model
    const recommendations = await getRecommendations(productId)

    // Return recommendations as JSON
    res.status(200).json(recommendations)
  } catch (error) {
    console.error("Error in recommendation route:", error)
    res.status(500).json({ message: "Failed to get recommendations", error: error.message })
  }
})

module.exports = router