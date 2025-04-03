"use client"

import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { FiMenu, FiX, FiShoppingCart, FiUser, FiSearch } from "react-icons/fi"

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

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

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "py-4 bg-white shadow-lg" : "py-6 bg-white/95"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-indigo-600 transition-colors">
          <span className="text-indigo-600">Pop</span>Verse<span className="text-indigo-600">Nepal</span>
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
              <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>
            <Link to="/login" className="text-gray-700 hover:text-indigo-600 transition-colors">
              <FiUser size={20} />
            </Link>
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

          <div className="border-t border-gray-100 mt-4 pt-4 px-6 flex justify-around">
            <button className="text-gray-700 hover:text-indigo-600 transition-colors p-2">
              <FiSearch size={20} />
            </button>
            <Link
              to="/cart"
              className="text-gray-700 hover:text-indigo-600 transition-colors p-2 relative"
              onClick={() => setIsOpen(false)}
            >
              <FiShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>
            <Link
              to="/login"
              className="text-gray-700 hover:text-indigo-600 transition-colors p-2"
              onClick={() => setIsOpen(false)}
            >
              <FiUser size={20} />
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar

