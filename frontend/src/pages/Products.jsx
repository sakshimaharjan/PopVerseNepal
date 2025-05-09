"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { FiFilter, FiGrid, FiList, FiShoppingCart, FiEye } from "react-icons/fi"
import { useCart } from "../components/CartContext"

function Products() {
  // State for storing products fetched from the API
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // State for tracking the selected category filter
  const [category, setCategory] = useState("all")

  // State for tracking the selected sorting order (price)
  const [sortOrder, setSortOrder] = useState("default")

  // State for view mode (grid or list)
  const [viewMode, setViewMode] = useState("grid")

  // State for filter sidebar on mobile
  const [showFilters, setShowFilters] = useState(false)

  // Get cart functions
  const { addToCart } = useCart()

  // Fetch products from the API when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        // Request products from the backend API
        const response = await axios.get("http://localhost:3000/api/products")
        // Store the products in the state
        setProducts(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching products:", error)
        setError("Failed to load products. Please try again later.")
        setLoading(false)
      }
    }

    fetchProducts()
  }, []) // Empty dependency array ensures this runs once after the component mounts

  // Update category state based on URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get("category");
    if (categoryParam) {
      setCategory(categoryParam);
    }
  }, []);

  // Filter products based on the selected category
  let filteredProducts =
    category === "all"
      ? products // If "all" is selected, show all products
      : products.filter((product) => product.category === category) // Filter by selected category

  // Sort the filtered products based on the selected sorting order bubble sort
  const bubbleSort = (arr, ascending = true) => {
    const sorted = [...arr]
    const n = sorted.length
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (
          (ascending && sorted[j].price > sorted[j + 1].price) ||
          (!ascending && sorted[j].price < sorted[j + 1].price)
        ) {
          [sorted[j], sorted[j + 1]] = [sorted[j + 1], sorted[j]]
        }
      }
    }
    return sorted
  }

  if (sortOrder === "lowToHigh") {
    filteredProducts = bubbleSort(filteredProducts, true)
  } else if (sortOrder === "highToLow") {
    filteredProducts = bubbleSort(filteredProducts, false)
  }

  // Handle add to cart
  const handleAddToCart = (e, product) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)

    // Show toast notification
    const toast = document.getElementById("toast")
    if (toast) {
      toast.classList.remove("hidden")
      setTimeout(() => {
        toast.classList.add("hidden")
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Our Collection</h1>
          <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto">
            Discover our exclusive collection of Marvel collectibles and more.
          </p>
        </div>

        {/* Mobile Filter Button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            <FiFilter />
            <span>Filters & Sorting</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar - Mobile */}
          {showFilters && (
            <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50">
              <div className="bg-white h-full w-4/5 max-w-sm p-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Filters & Sorting</h2>
                  <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-700">
                    <FiFilter />
                  </button>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
                  <div className="space-y-2">
                    {["all", "marvel", "exclusive"].map((cat) => (
                      <button
                        key={cat}
                        className={`block w-full text-left px-3 py-2 rounded-md ${
                          category === cat
                            ? "bg-indigo-100 text-indigo-800 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          setCategory(cat);
                          setShowFilters(false);
                            setTimeout(() => {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                            }, 0);
                        }}
                      >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Sort By</h3>
                  <div className="space-y-2">
                    {[
                      { value: "default", label: "Default" },
                      { value: "lowToHigh", label: "Price: Low to High" },
                      { value: "highToLow", label: "Price: High to Low" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        className={`block w-full text-left px-3 py-2 rounded-md ${
                          sortOrder === option.value
                            ? "bg-indigo-100 text-indigo-800 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          setSortOrder(option.value)
                          setShowFilters(false)
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters Sidebar - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-6">Filters</h2>

            {/* Categories */}
            <div className="mb-8">
              <h3 className="text-sm font-black text-gray-900 mb-3 ">Categories</h3>
              <div className="space-y-2 ">
                {["all", "marvel", "exclusive"].map((cat) => (
                  <Link
                    key={cat}
                    to={`/products?category=${cat}`}
                    className={`block w-full text-left px-3 py-2 rounded-md cursor-pointer ${
                      category === cat || window.location.search.includes(`category=${cat}`)
                        ? "bg-indigo-100 text-indigo-800 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Link>
                ))}
              </div>
            </div>

            {/* Sort Options */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Sort By</h3>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={(e) => setSortOrder(e.target.value)}
                  value={sortOrder}
                >
                  <option value="default">Default</option>
                  <option value="lowToHigh">Price: Low to High</option>
                  <option value="highToLow">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* View Mode and Results Count */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-500">Showing {filteredProducts.length} results</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md ${viewMode === "grid" ? "bg-indigo-100 text-indigo-800" : "text-gray-500"}`}
                >
                  <FiGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md ${viewMode === "list" ? "bg-indigo-100 text-indigo-800" : "text-gray-500"}`}
                >
                  <FiList size={18} />
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            )}

            {/* Error State */}
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">{error}</div>}

            {/* No Results */}
            {!loading && !error && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try changing your filters or check back later.</p>
              </div>
            )}

            {/* Grid View */}
            {viewMode === "grid" && !loading && !error && filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="group relative">
                    <Link to={`/product/${product._id}`} className="block">
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                        <div className="relative pt-[100%] bg-gray-100">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-contain p-4"
                          />

                          {/* Quick Action Buttons */}
                          <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              onClick={(e) => handleAddToCart(e, product)}
                              className="p-2 bg-white rounded-full text-indigo-600 hover:bg-indigo-600  hover:text-white transition-colors"
                              title="Add to cart"
                            >
                              <FiShoppingCart size={18} />
                            </button>
                            <Link
                              to={`/product/${product._id}`}
                              className="p-2 bg-white rounded-full text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors "
                              title="View details"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FiEye size={18} />
                            </Link>
                          </div>
                        </div>

                        <div className="p-4">
                          <h3 className="text-lg font-medium text-gray-900 mb-1">{product.name}</h3>
                          <p className="text-indigo-600 font-bold">${product.price.toFixed(2)}</p>
                          <p className="text-sm text-gray-500 mt-1 capitalize">{product.category}</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && !loading && !error && filteredProducts.length > 0 && (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <Link to={`/product/${product._id}`} className="flex flex-col sm:flex-row">
                      <div className="w-full sm:w-48 h-48 bg-gray-100 flex-shrink-0">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-contain p-4"
                        />
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">{product.name}</h3>
                          <p className="text-sm text-gray-500 mb-4">{product.description}</p>
                          <p className="text-sm text-gray-500 capitalize">Category: {product.category}</p>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <p className="text-lg font-bold text-indigo-600">${product.price.toFixed(2)}</p>
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                          >
                            <FiShoppingCart size={16} />
                            <span>Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <div
        id="toast"
        className="hidden fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 z-50"
      >
        <FiShoppingCart size={18} />
        <span>Added to cart!</span>
      </div>
    </div>
  )
}

export default Products

