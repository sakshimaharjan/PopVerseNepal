import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import {
  FiMenu,
  FiX,
  FiShoppingCart,
  FiUser,
  FiSearch,
  FiLogOut,
  FiSettings,
  FiHome,
  FiPackage,
  FiGrid,
  FiInfo,
  FiMessageSquare,
} from "react-icons/fi"
import { useAuth } from "./AuthContext"
import { useCart } from "./CartContext"

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { currentUser, logout } = useAuth()
  const { cart } = useCart()

  // Calculate cart count directly from the cart context
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)

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

  // Get user's first name
  const firstName = currentUser?.name ? currentUser.name.split(" ")[0] : ""

  // Default profile picture if none exists
  const defaultProfilePic = `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}&background=6366F1&color=fff`

  // Use profile picture if available, otherwise use default
  const profilePicture = currentUser?.profilePicture || defaultProfilePic

  // For debugging
  useEffect(() => {
    if (currentUser) {
      console.log("Current user in Navbar:", currentUser)
      console.log("Profile picture URL:", profilePicture)
    }
  }, [currentUser, profilePicture])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "py-2 bg-white shadow-lg" : "py-3 bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src="../../logo.png" alt="PopVerseNepal Logo" className="h-12 md:h-16 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6 text-base font-medium">
            <Link to="/" className="text-gray-700 hover:text-indigo-600 transition-colors flex items-center gap-1">
              <FiHome size={18} />
              <span>Home</span>
            </Link>
            <Link
              to="/products"
              className="text-gray-700 hover:text-indigo-600 transition-colors flex items-center gap-1"
            >
              <FiGrid size={18} />
              <span>Products</span>
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-indigo-600 transition-colors flex items-center gap-1">
              <FiInfo size={18} />
              <span>About</span>
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-indigo-600 transition-colors flex items-center gap-1"
            >
              <FiMessageSquare size={18} />
              <span>Contact</span>
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
                  className="flex items-center cursor-pointer gap-2 bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-full hover:bg-indigo-200 transition-colors"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <img
                    src={profilePicture || "/placeholder.svg"}
                    alt={firstName}
                    className="w-6 h-6 rounded-full object-cover"
                    onError={(e) => {
                      console.log("Image load error, falling back to default")
                      e.target.src = defaultProfilePic
                    }}
                  />
                  <span className="text-sm font-medium">{firstName}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <div className="flex items-center gap-2">
                        <FiUser size={16} />
                        <span>Dashboard</span>
                      </div>
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <div className="flex items-center gap-2">
                        <FiSettings size={16} />
                        <span>Edit Profile</span>
                      </div>
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <div className="flex items-center gap-2">
                        <FiPackage size={16} />
                        <span>My Orders</span>
                      </div>
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
        <div className="flex items-center gap-2 md:hidden">
          <Link to="/cart" className="text-gray-700 hover:text-indigo-600 transition-colors relative mr-2">
            <FiShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button className="cursor-pointer hover:text-indigo-600 text-gray-700" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 w-full flex flex-col py-4 shadow-lg">
          <div className="flex flex-col gap-4 px-6">
            <Link
              to="/"
              className="text-gray-700 font-medium hover:text-indigo-600 py-2 transition-colors flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <FiHome size={18} />
              <span>Home</span>
            </Link>
            <Link
              to="/products"
              className="text-gray-700 font-medium hover:text-indigo-600 py-2 transition-colors flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <FiGrid size={18} />
              <span>Products</span>
            </Link>
            <Link
              to="/about"
              className="text-gray-700 font-medium hover:text-indigo-600 py-2 transition-colors flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <FiInfo size={18} />
              <span>About</span>
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 font-medium hover:text-indigo-600 py-2 transition-colors flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <FiMessageSquare size={18} />
              <span>Contact</span>
            </Link>
          </div>

          <div className="border-t border-gray-100 mt-4 pt-4 px-6">
            {currentUser ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 px-2 py-3">
                  <img
                    src={profilePicture || "/placeholder.svg"}
                    alt={firstName}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      console.log("Image load error in mobile menu, falling back to default")
                      e.target.src = defaultProfilePic
                    }}
                  />
                  <div>
                    <p className="font-medium text-gray-800">{currentUser.name}</p>
                    <p className="text-sm text-gray-500">{currentUser.email}</p>
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-indigo-600 py-2 transition-colors flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <FiUser size={18} />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-indigo-600 py-2 transition-colors flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <FiSettings size={18} />
                  <span>Edit Profile</span>
                </Link>
                <Link
                  to="/orders"
                  className="text-gray-700 hover:text-indigo-600 py-2 transition-colors flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <FiPackage size={18} />
                  <span>My Orders</span>
                </Link>
                <button
                  onClick={() => {
                    logout()
                    setIsOpen(false)
                  }}
                  className="text-left text-red-600 hover:text-red-700 py-2 transition-colors flex items-center gap-2"
                >
                  <FiLogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                <Link
                  to="/login"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <FiUser size={18} />
                  <span>Login</span>
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
