import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { FiSearch, FiX, FiArrowRight } from "react-icons/fi"
import axios from "axios"

function Search() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [allProducts, setAllProducts] = useState([])
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1)
  const searchInputRef = useRef(null)
  const searchResultsRef = useRef(null)
  const navigate = useNavigate()

  // Fetch all products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`)
        setAllProducts(response.data)
      } catch (error) {
        console.error("Error fetching products for search:", error)
      }
    }

    fetchProducts()
  }, [])

  // Handle search input changes
  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.trim() === "") {
      setSearchResults([])
      return
    }

    setLoading(true)

    // Perform search on local data
    const results = performSearch(query)
    setSearchResults(results)
    setSelectedResultIndex(-1)
    setLoading(false)
  }

  // Search algorithm implementation
  const performSearch = (query) => {
    if (!query || query.trim() === "") return []

    const searchTerms = query.toLowerCase().trim().split(/\s+/)

    // Search through products
    return allProducts
      .filter((product) => {
        // Check if product matches any search term
        return searchTerms.some((term) => {
          const nameMatch = product.name?.toLowerCase().includes(term)
          const descMatch = product.description?.toLowerCase().includes(term)
          const categoryMatch = product.category?.toLowerCase().includes(term)

          return nameMatch || descMatch || categoryMatch
        })
      })
      .sort((a, b) => {
        // Sort by relevance (exact name matches first)
        const aNameExact = a.name.toLowerCase().includes(query.toLowerCase())
        const bNameExact = b.name.toLowerCase().includes(query.toLowerCase())

        if (aNameExact && !bNameExact) return -1
        if (!aNameExact && bNameExact) return 1

        // Then sort by name length (shorter names first as they're more likely to be exact matches)
        return a.name.length - b.name.length
      })
      .slice(0, 5) // Limit to 5 results for better UX
  }

  // Toggle search input visibility
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    if (!isSearchOpen) {
      // Focus the input when opening
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    } else {
      // Clear search when closing
      setSearchQuery("")
      setSearchResults([])
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (searchResults.length === 0) return

    // Arrow down
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedResultIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : prev))
    }

    // Arrow up
    else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedResultIndex((prev) => (prev > 0 ? prev - 1 : 0))
    }

    // Enter key
    else if (e.key === "Enter") {
      e.preventDefault()
      if (selectedResultIndex >= 0 && selectedResultIndex < searchResults.length) {
        navigateToProduct(searchResults[selectedResultIndex])
      } else if (searchQuery.trim() !== "") {
        // If no result is selected but there's a query, navigate to search results page
        navigateToSearchResults()
      }
    }

    // Escape key
    else if (e.key === "Escape") {
      e.preventDefault()
      toggleSearch()
    }
  }

  // Navigate to product page
  const navigateToProduct = (product) => {
    navigate(`/product/${product._id}`)
    toggleSearch()
  }

  // Navigate to search results page
  const navigateToSearchResults = () => {
    navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
    toggleSearch()
  }

  // Handle click outside to close search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSearchOpen && !event.target.closest(".search-container") && !event.target.closest(".search-button")) {
        setIsSearchOpen(false)
        setSearchQuery("")
        setSearchResults([])
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isSearchOpen])

  // Highlight matching text in search results
  const highlightMatch = (text, query) => {
    if (!query || !text) return text

    const parts = text.split(new RegExp(`(${query})`, "gi"))

    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-indigo-100 text-indigo-800 font-medium">
          {part}
        </span>
      ) : (
        part
      ),
    )
  }

  return (
    <div className="relative">
      {/* Search Button */}
      <button
        className="search-button text-gray-700 hover:text-indigo-600 transition-colors p-1.5 rounded-full hover:bg-indigo-50 cursor-pointer"
        onClick={toggleSearch}
        aria-label="Search"
      >
        <FiSearch size={20} />
      </button>

      {/* Search Input and Results */}
      {isSearchOpen && (
       <div className="search-container fixed inset-0 z-50 bg-black/30 backdrop-blur-md flex items-start justify-center pt-24 px-4 md:px-0 md:pt-32">
          <div className="absolute top-6 right-6 z-50">
            <button
              onClick={toggleSearch}
              className="bg-white cursor-pointer hover:bg-gray-100 text-gray-800 border border-gray-300 rounded-full p-2 shadow"
              aria-label="Close search"
            >
              <FiX size={20} />
            </button>
          </div>
          <div className="w-full max-w-2xl bg-gray-100 rounded-xl shadow-2xl overflow-hidden animate-fadeIn border border-gray-300">
            <div className="relative">
              {/* Search Input */}
              <div className="flex items-center">
                <FiSearch className="ml-4 text-indigo-500" size={20} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for products..."
                  className="w-full py-4 px-3 outline-none text-gray-700 text-lg"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                />
                {searchQuery ? (
                  <button onClick={() => setSearchQuery("")} className="mr-2 text-gray-400 hover:text-gray-600 p-2">
                    <FiX size={20} />
                  </button>
                ) : null}
              </div>

              {/* Search Results */}
              <div ref={searchResultsRef} className="max-h-[60vh] overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center text-gray-500">
                    <div className="inline-block animate-spin h-6 w-6 border-t-2 border-b-2 border-indigo-600 rounded-full"></div>
                    <p className="mt-2">Searching products...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div>
                    <ul className="divide-y divide-gray-100">
                      {searchResults.map((product, index) => (
                        <li
                          key={product._id}
                          className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                            index === selectedResultIndex ? "bg-indigo-50" : ""
                          }`}
                          onClick={() => navigateToProduct(product)}
                          onMouseEnter={() => setSelectedResultIndex(index)}
                        >
                          <div className="flex items-center p-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
                              <img
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                className="w-full h-full object-contain p-2"
                              />
                            </div>
                            <div className="ml-4 flex-1 min-w-0">
                              <p className="font-medium text-gray-900 text-lg">
                                {highlightMatch(product.name, searchQuery)}
                              </p>
                              <div className="flex items-center mt-1">
                                <span className="text-indigo-600 font-bold">${product.price?.toFixed(2)}</span>
                                {product.category && (
                                  <span className="ml-3 text-sm text-gray-500 capitalize bg-gray-100 px-2 py-0.5 rounded-full">
                                    {product.category}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                      <button
                        onClick={navigateToSearchResults}
                        className="w-full flex items-center cursor-pointer justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-colors font-medium"
                      >
                        <span>See all results</span>
                        <FiArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                ) : searchQuery.trim() !== "" ? (
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                      <FiSearch size={24} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No results found</h3>
                    <p className="text-gray-500 mb-4">We couldn't find any products matching "{searchQuery}"</p>
                    <button
                      onClick={navigateToSearchResults}
                      className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                    >
                      <span>Browse all products</span>
                      <FiArrowRight size={16} />
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Search ;
