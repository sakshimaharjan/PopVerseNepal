"use client"

import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"
import { FiShoppingCart, FiHeart, FiShare2, FiArrowLeft, FiCheck } from "react-icons/fi"
import { useCart } from "../components/CartContext"

function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [showNotification, setShowNotification] = useState(false)

  const { addToCart } = useCart()

  // Mock additional images for the product
  const additionalImages = [
    "/placeholder.png?height=400&width=400",
    "/placeholder.png?height=400&width=400",
    "/placeholder.png?height=400&width=400",
  ]

  const api = import.meta.env.API_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${api}/api/products/${id}`)
        setProduct(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching product details:", error)
        setError("Failed to load product details. Please try again later.")
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  // Handle quantity change
  const increaseQuantity = () => setQuantity(quantity + 1)
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  // Add to Cart
  const handleAddToCart = () => {
    addToCart(product, quantity)
    setShowNotification(true)
    setTimeout(() => {
      setShowNotification(false)
    }, 3000)
  }

  // Go back to products page
  const goBack = () => {
    navigate("/products")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
          <button
            onClick={goBack}
            className="mt-4 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
          >
            <FiArrowLeft size={16} />
            <span>Back to products</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6">
          <button onClick={goBack} className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 cursor-pointer">
            <FiArrowLeft size={16} />
            <span>Back to products</span>
          </button>
        </nav>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
                />
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  className={`aspect-square border-2 rounded-md overflow-hidden ${activeImage === 0 ? "border-indigo-600" : "border-transparent"}`}
                  onClick={() => setActiveImage(0)}
                >
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={`${product.name} thumbnail 1`}
                    className="w-full h-full object-contain p-1"
                  />
                </button>
                {additionalImages.map((img, index) => (
                  <button
                    key={index}
                    className={`aspect-square border-2 rounded-md overflow-hidden ${activeImage === index + 1 ? "border-indigo-600" : "border-transparent"}`}
                    onClick={() => setActiveImage(index + 1)}
                  >
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`${product.name} thumbnail ${index + 2}`}
                      className="w-full h-full object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <div className="mb-2">
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full capitalize">
                  {product.category}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < 4 ? "text-yellow-400" : "text-gray-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-500">4.0 (24 reviews)</span>
              </div>

              <p className="text-3xl font-bold text-indigo-600 mb-4">${product.price.toFixed(2)}</p>

              <div className="prose prose-sm text-gray-700 mb-6">
                <p>{product.description}</p>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1 text-green-600">
                  <FiCheck size={16} />
                  <span className="font-medium">In Stock</span>
                </div>
                <span className="text-sm text-gray-500">Ships in 1-2 business days</span>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center">
                  <button
                    onClick={decreaseQuantity}
                    className="w-10 h-10 rounded-l-md border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <div className="w-16 h-10 border-t border-b border-gray-300 flex items-center justify-center">
                    {quantity}
                  </div>
                  <button
                    onClick={increaseQuantity}
                    className="w-10 h-10 rounded-r-md border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FiShoppingCart size={18} />
                  <span>Add to Cart</span>
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 cursor-pointer">
                  <FiHeart size={18} />
                  <span>Add to Wishlist</span>
                </button>
              </div>

              {/* Share */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="flex items-center gap-2 text-gray-500 hover:text-indigo-600">
                  <FiShare2 size={16} />
                  <span>Share this product</span>
                </button>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="border-t border-gray-200 px-6 py-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h2>
              <div className="prose prose-indigo max-w-none">
                <p>{product.description}</p>
                <ul>
                  <li>High-quality collectible</li>
                  <li>Official Marvel merchandise</li>
                  <li>Limited edition</li>
                  <li>Perfect for collectors and fans</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Added to Cart Notification */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-3 rounded-md shadow-lg flex items-center gap-3 z-50 animate-fade-in">
          <FiCheck size={20} />
          <div>
            <p className="font-medium">Added to cart!</p>
            <p className="text-sm">
              {quantity} × {product.name}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductPage

