const Product = require("./Product")

/**
 * Simple Content-Based Recommendation
 * - Compares categorical features directly (exact match)
 * - Compares numerical features with normalized difference
 * - Combines results using fixed weights
 */
async function getRecommendations(productId) {
  try {
    // 1. Get the current product
    const currentProduct = await Product.findById(productId)
    if (!currentProduct) {
      throw new Error("Product not found")
    }

    // 2. Get all other products
    const allProducts = await Product.find({ _id: { $ne: productId } })
    if (allProducts.length === 0) {
      return []
    }

    // 3. Feature weights (adjust if needed)
    const weightCategory = 0.6
    const weightPrice = 0.4

    // 4. Calculate similarity for each product
    const recommendations = allProducts.map((product) => {
      // Categorical: category match
      const categoryMatch = (product.category === currentProduct.category) ? 1 : 0

      // Numerical: price similarity (normalized)
      let priceSimilarity = 0
      const maxPrice = Math.max(product.price || 0, currentProduct.price || 0)
      if (maxPrice > 0) {
        priceSimilarity = 1 - (Math.abs((product.price || 0) - (currentProduct.price || 0)) / maxPrice)
      }

      // Final similarity score
      const similarityScore = (categoryMatch * weightCategory) + (priceSimilarity * weightPrice)

      return {
        ...product.toObject(),
        similarityScore
      }
    })

    // 5. Sort and return top 4
    return recommendations
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 4)

  } catch (error) {
    console.error("Error in recommendation model:", error)
    throw error
  }
}

module.exports = { getRecommendations }