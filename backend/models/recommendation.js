const Product = require("./Product");
const Order = require("./Order"); // Make sure you have this model

async function getRecommendations(productId, userId) {
  try {
    // Only recommend if user exists and has at least 1 order
    if (!userId) return [];

    const hasPurchased = await Order.exists({ user: userId });
    if (!hasPurchased) return [];

    const currentProduct = await Product.findById(productId);
    if (!currentProduct) throw new Error("Product not found");

    const allProducts = await Product.find({ _id: { $ne: productId } });
    if (allProducts.length === 0) return [];

    // Build vocabulary of all words in current product and all other products
    const vocabulary = {};
    let vocabIndex = 0;

    function addWordsToVocab(name) {
      const words = name.toLowerCase().split(/\W+/).filter(Boolean);
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (!(word in vocabulary)) {
          vocabulary[word] = vocabIndex;
          vocabIndex++;
        }
      }
    }

    addWordsToVocab(currentProduct.name);
    for (let i = 0; i < allProducts.length; i++) {
      addWordsToVocab(allProducts[i].name);
    }

    const vocabSize = vocabIndex;

    // Create term frequency vector for a given name
    function getTermFrequencyVector(name) {
      const vector = new Array(vocabSize).fill(0);
      const words = name.toLowerCase().split(/\W+/).filter(Boolean);
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const index = vocabulary[word];
        if (index !== undefined) {
          vector[index] = vector[index] + 1;
        }
      }
      return vector;
    }

    // Normalize price to [0,1] based on min and max price among all products including current
    let minPrice = currentProduct.price;
    let maxPrice = currentProduct.price;
    for (let i = 0; i < allProducts.length; i++) {
      if (allProducts[i].price < minPrice) minPrice = allProducts[i].price;
      if (allProducts[i].price > maxPrice) maxPrice = allProducts[i].price;
    }
    const priceRange = maxPrice - minPrice;

    function normalizePrice(price) {
      if (priceRange === 0) return 0;
      return (price - minPrice) / priceRange;
    }

    // Calculate dot product of two vectors
    function dotProduct(vecA, vecB) {
      let product = 0;
      for (let i = 0; i < vecA.length; i++) {
        product += vecA[i] * vecB[i];
      }
      return product;
    }

    // Calculate magnitude of a vector
    function magnitude(vec) {
      let sumSquares = 0;
      for (let i = 0; i < vec.length; i++) {
        sumSquares += vec[i] * vec[i];
      }
      return Math.sqrt(sumSquares);
    }

    // Calculate cosine similarity between two vectors
    function cosineSimilarity(vecA, vecB) {
      const dot = dotProduct(vecA, vecB);
      const magA = magnitude(vecA);
      const magB = magnitude(vecB);
      if (magA === 0 || magB === 0) return 0;
      return dot / (magA * magB);
    }

    // Prepare current product vectors
    const currentNameVector = getTermFrequencyVector(currentProduct.name);
    const currentPriceNorm = normalizePrice(currentProduct.price);

    const recommendations = [];

    for (let i = 0; i < allProducts.length; i++) {
      const product = allProducts[i];
      const productNameVector = getTermFrequencyVector(product.name);
      const productPriceNorm = normalizePrice(product.price);

      // Calculate name similarity
      const nameSim = cosineSimilarity(currentNameVector, productNameVector);

      // Calculate price similarity as 1 - absolute difference in normalized price
      const priceSim = 1 - Math.abs(currentPriceNorm - productPriceNorm);

      // Combine similarities (average)
      const similarityScore = (nameSim + priceSim) / 2;

      recommendations.push({
        product: product.toObject(),
        similarityScore,
      });
    }

    // Sort descending by similarityScore
    for (let i = 0; i < recommendations.length - 1; i++) {
      for (let j = 0; j < recommendations.length - i - 1; j++) {
        if (recommendations[j].similarityScore < recommendations[j + 1].similarityScore) {
          const temp = recommendations[j];
          recommendations[j] = recommendations[j + 1];
          recommendations[j + 1] = temp;
        }
      }
    }

    return recommendations.slice(0, 4);
  } catch (error) {
    console.error("Error in recommendation model:", error);
    throw error;
  }
}

module.exports = { getRecommendations };