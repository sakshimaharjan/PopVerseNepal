"use client"

import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { FiMenu, FiX, FiShoppingCart, FiUser, FiSearch, FiLogOut } from "react-icons/fi"
import { useAuth } from "./AuthContext"

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { currentUser, logout } = useAuth()

  // Get cart items count from localStorage
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")
      setCartCount(cart.reduce((total, item) => total + item.quantity, 0))
    }

    // Initial count
    updateCartCount()

    // Listen for cart updates
    window.addEventListener("cartUpdated", updateCartCount)

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "py-4 bg-white shadow-lg" : "py-6 bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-indigo-600 transition-colors">
          {/* <span className="text-indigo-600">Pop</span>Verse<span className="text-indigo-600">Nepal</span> */}
                <a href=""><img src="/logo.png" alt="Logo" className="h-20 object-contain"/></a>
              </Link>

              <div className="hidden md:flex items-center gap-8">
                <div className="flex gap-6 text-base font-medium">
                <Link to="/" className="text-gray-700 hover:text-indigo-600 transition-colors">
                  Home
                </Link>
                <Link to="/products" className="text-gray-700 hover:text-indigo-600 transition-colors">
                  Products
                </Link>
                <Link to="/about" className="text-gray-700 hover:text-indigo-600 transition-colors">
                  About
                </Link>
                <Link to="/contact" className="text-gray-700 hover:text-indigo-600 transition-colors">
                  Contact
                </Link>
                </div>

                <div className="flex items-center gap-4">
                <button className="text-gray-700 hover:text-indigo-600 transition-colors">
                  <FiSearch size={20} />
                </button>
                <Link to="/cart" className="text-gray-700 hover:text-indigo-600 transition-colors relative">
                  <FiShoppingCart size={20} />
                  {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                  )}
                </Link>

                {currentUser ? (
                  <div className="relative">
                  <button
                    className="flex items-center gap-2 bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-full hover:bg-indigo-200 transition-colors"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <FiUser size={18} />
                    <span className="text-sm font-medium">{currentUser.name.split(" ")[0]}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <div className="flex items-center gap-2">
                      <FiLogOut size={16} />
                      <span>Logout</span>
                      </div>
                    </button>
                    </div>
                  )}
                  </div>
                ) : (
                  <Link
                  to="/login"
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-1.5 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                  <FiUser size={18} />
                  <span className="text-sm font-medium">Login</span>
                  </Link>
                )}
                </div>
              </div>

              {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 w-full flex flex-col py-4 shadow-lg">
          <div className="flex flex-col gap-4 px-6">
            <Link
              to="/"
              className="text-gray-700 font-medium hover:text-indigo-600 py-2 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-gray-700 font-medium hover:text-indigo-600 py-2 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/about"
              className="text-gray-700 font-medium hover:text-indigo-600 py-2 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 font-medium hover:text-indigo-600 py-2 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </div>

          <div className="border-t border-gray-100 mt-4 pt-4 px-6">
            {currentUser ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 px-2 py-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{currentUser.name}</p>
                    <p className="text-sm text-gray-500">{currentUser.email}</p>
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-indigo-600 py-2 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/orders"
                  className="text-gray-700 hover:text-indigo-600 py-2 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  My Orders
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setIsOpen(false)
                  }}
                  className="text-left text-red-600 hover:text-red-700 py-2 transition-colors flex items-center gap-2"
                >
                  <FiLogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                <Link
                  to="/login"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

