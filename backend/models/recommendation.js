const Product = require("./Product")

async function getRecommendations(productId) {
  try {
    //get the current product
    const currentProduct = await Product.findById(productId)
    if (!currentProduct) {
      throw new Error("Product not found")
    }

    //get all other products
    const allProducts = await Product.find({ _id: { $ne: productId } })
    if (allProducts.length === 0) {
      return []
    }

    //weights
    const weightCategory = 0.6
    const weightPrice = 0.4

    //calculate similarity scores
    const recommendations = []

    for (let i = 0; i < allProducts.length; i++) {
      const product = allProducts[i]

      let categoryMatch = 0
      if (product.category === currentProduct.category) {
        categoryMatch = 1
      }

      // compute max price
      let maxPrice = currentProduct.price
      if (product.price > maxPrice) {
        maxPrice = product.price
      }

      //calculate price similarity [formula: 1 - (diff / maxPrice)]
      let priceSimilarity = 0
      if (maxPrice > 0) {
        const priceDiff = product.price - currentProduct.price
        const absPriceDiff = priceDiff >= 0 ? priceDiff : -priceDiff
        priceSimilarity = 1 - (absPriceDiff / maxPrice)
      }

      //calculate total similarity score
      const similarityScore = (weightCategory * categoryMatch) + (weightPrice * priceSimilarity)

      //store product and score
      recommendations.push({
        product: product.toObject(),
        similarityScore: similarityScore,
      })
    }

    //sort recommendations by similarityScore descending using bubble sort
    for (let i = 0; i < recommendations.length - 1; i++) {
      for (let j = 0; j < recommendations.length - 1 - i; j++) {
        if (recommendations[j].similarityScore < recommendations[j + 1].similarityScore) {
          // Swap
          const temp = recommendations[j]
          recommendations[j] = recommendations[j + 1]
          recommendations[j + 1] = temp
        }
      }
    }

    // 6. Manually select top 4 recommendations
    const topRecommendations = []
    const limit = recommendations.length < 4 ? recommendations.length : 4
    for (let i = 0; i < limit; i++) {
      topRecommendations.push(recommendations[i])
    }

    // Return top recommendations array with product and score
    return topRecommendations

  } catch (error) {
    console.error("Error in recommendation model:", error)
    throw error
  }
}

module.exports = { getRecommendations }