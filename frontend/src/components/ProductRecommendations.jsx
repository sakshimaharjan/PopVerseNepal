import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { FiShoppingCart } from "react-icons/fi"

function ProductRecommendations({ productId, addToCart, setShowNotification }) {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${productId}/recommendations`)
        setRecommendations(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching recommendations:", error)
        setError("Failed to load recommendations")
        setLoading(false)
      }
    }

    if (productId) {
      fetchRecommendations()
    }
  }, [productId])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customers Also Bought</h2>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customers Also Bought</h2>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>
        </div>
      </div>
    )
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Customers Also Bought</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recommendations.map((item) => (
            <div key={item._id} className="group relative">
              <Link to={`/product/${item._id}`} className="block">
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md">
                  <div className="relative pt-[100%] bg-gray-100">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="absolute inset-0 w-full h-full object-contain p-4"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                    <p className="text-indigo-600 font-bold mt-1">${item.price.toFixed(2)}</p>
                  </div>
                </div>
              </Link>
              <button
                onClick={() => {
                  addToCart(item, 1)
                  setShowNotification(true)
                  setTimeout(() => {
                    setShowNotification(false)
                  }, 3000)
                }}
                className="mt-2 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors text-sm flex items-center justify-center gap-1 cursor-pointer"
              >
                <FiShoppingCart size={14} />
                <span>Add to Cart</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductRecommendations
