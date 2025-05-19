// Don't redefine the Product model - just require it
const Product = require("./Product") // Make sure the path matches your actual file (case-sensitive)

/**
 * Content-Based Filtering with TF-IDF and Cosine Similarity
 *
 * This algorithm works by:
 * 1. Creating feature vectors for each product
 * 2. Calculating TF-IDF weights for categorical features
 * 3. Normalizing numerical features
 * 4. Computing cosine similarity between products
 * 5. Ranking and returning the most similar products
 */
async function getRecommendations(productId) {
  try {
    // Get the current product
    const currentProduct = await Product.findById(productId)

    if (!currentProduct) {
      throw new Error("Product not found")
    }

    // Get all products (excluding current one)
    const allProducts = await Product.find({ _id: { $ne: productId } })

    // If no other products, return empty array
    if (allProducts.length === 0) {
      return []
    }

    // Step 1: Extract features from all products
    const productsWithFeatures = extractFeatures([currentProduct, ...allProducts])

    // Step 2: Calculate TF-IDF for categorical features
    const productsWithTfIdf = calculateTfIdf(productsWithFeatures)

    // Step 3: Normalize numerical features
    const normalizedProducts = normalizeNumericalFeatures(productsWithTfIdf)

    // Step 4: Calculate similarity scores between current product and all others
    const currentProductVector = normalizedProducts[0] // Current product is first in the array
    const otherProductsWithSimilarity = normalizedProducts.slice(1).map((product) => {
      const similarity = calculateCosineSimilarity(currentProductVector.vector, product.vector)
      return {
        ...product.product.toObject(),
        similarityScore: similarity,
      }
    })

    // Step 5: Sort by similarity score (highest first)
    const sortedRecommendations = otherProductsWithSimilarity.sort((a, b) => b.similarityScore - a.similarityScore)

    // Return top 4 recommendations
    return sortedRecommendations.slice(0, 4)
  } catch (error) {
    console.error("Error in recommendation model:", error)
    throw error
  }
}

/**
 * Extract relevant features from products
 * @param {Array} products - Array of product objects
 * @returns {Array} - Products with extracted features
 */
function extractFeatures(products) {
  return products.map((product) => {
    // Extract categorical features
    const categoricalFeatures = {
      category: product.category || "",
      isExclusive: product.isExclusive ? "exclusive" : "standard", // Convert boolean to string category
      // Add more categorical features as needed
    }

    // Extract numerical features
    const numericalFeatures = {
      price: product.price || 0,
      // Add more numerical features as needed (e.g., rating, stock)
    }

    return {
      product,
      categoricalFeatures,
      numericalFeatures,
    }
  })
}

/**
 * Calculate TF-IDF weights for categorical features
 * @param {Array} products - Products with extracted features
 * @returns {Array} - Products with TF-IDF vectors
 */
function calculateTfIdf(products) {
  // Get all unique categorical feature keys
  const categoricalKeys = Object.keys(products[0].categoricalFeatures)

  // Calculate document frequency (DF) for each term
  const documentFrequency = {}

  categoricalKeys.forEach((key) => {
    // Get all unique values for this feature
    const uniqueValues = new Set()
    products.forEach((product) => {
      uniqueValues.add(product.categoricalFeatures[key])
    })

    // For each unique value, count how many products have it
    uniqueValues.forEach((value) => {
      const termKey = `${key}_${value}`
      documentFrequency[termKey] = products.filter((product) => product.categoricalFeatures[key] === value).length
    })
  })

  // Calculate TF-IDF for each product
  return products.map((product) => {
    const tfidfVector = {}

    // Process each categorical feature
    categoricalKeys.forEach((key) => {
      const value = product.categoricalFeatures[key]
      if (value) {
        const termKey = `${key}_${value}`
        // TF is 1 (term is present) or 0 (term is absent)
        const tf = 1
        // IDF = log(total documents / document frequency)
        const idf = Math.log(products.length / documentFrequency[termKey])
        // TF-IDF = TF * IDF
        tfidfVector[termKey] = tf * idf
      }
    })

    return {
      product: product.product,
      tfidfVector,
      numericalFeatures: product.numericalFeatures,
    }
  })
}

/**
 * Normalize numerical features to range [0,1]
 * @param {Array} products - Products with TF-IDF vectors
 * @returns {Array} - Products with normalized features and combined vectors
 */
function normalizeNumericalFeatures(products) {
  // Get all numerical feature keys
  const numericalKeys = Object.keys(products[0].numericalFeatures)

  // Find min and max for each numerical feature
  const minMax = {}
  numericalKeys.forEach((key) => {
    const values = products.map((product) => product.numericalFeatures[key])
    minMax[key] = {
      min: Math.min(...values),
      max: Math.max(...values),
    }
  })

  // Normalize each product's numerical features
  return products.map((product) => {
    const normalizedNumerical = {}

    numericalKeys.forEach((key) => {
      const value = product.numericalFeatures[key]
      const { min, max } = minMax[key]

      // Handle case where min equals max (avoid division by zero)
      if (min === max) {
        normalizedNumerical[key] = 1
      } else {
        // Min-max normalization: (value - min) / (max - min)
        normalizedNumerical[key] = (value - min) / (max - min)
      }
    })

    // Combine TF-IDF vector and normalized numerical features
    const combinedVector = {
      ...product.tfidfVector,
      ...normalizedNumerical,
    }

    return {
      product: product.product,
      vector: combinedVector,
    }
  })
}

/**
 * Calculate cosine similarity between two vectors
 * @param {Object} vectorA - First feature vector
 * @param {Object} vectorB - Second feature vector
 * @returns {Number} - Similarity score between 0 and 1
 */
function calculateCosineSimilarity(vectorA, vectorB) {
  // Get all unique keys from both vectors
  const allKeys = new Set([...Object.keys(vectorA), ...Object.keys(vectorB)])

  // Calculate dot product
  let dotProduct = 0
  let magnitudeA = 0
  let magnitudeB = 0

  allKeys.forEach((key) => {
    const valueA = vectorA[key] || 0
    const valueB = vectorB[key] || 0

    dotProduct += valueA * valueB
    magnitudeA += valueA * valueA
    magnitudeB += valueB * valueB
  })

  // Calculate magnitudes
  magnitudeA = Math.sqrt(magnitudeA)
  magnitudeB = Math.sqrt(magnitudeB)

  // Handle zero magnitudes
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0
  }

  // Return cosine similarity
  return dotProduct / (magnitudeA * magnitudeB)
}

module.exports = {
  getRecommendations,
}
