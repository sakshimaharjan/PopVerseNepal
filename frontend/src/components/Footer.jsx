import { FaFacebook, FaTwitter, FaInstagram, FaTiktok } from "react-icons/fa"
import { FiSend } from "react-icons/fi"

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-700 pt-16 pb-8 border-t border-gray-200">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <h2 className="text-xl font-bold mb-4">
              <span className="text-indigo-600">Pop</span>Verse<span className="text-indigo-600">Nepal</span>
            </h2>
            <p className="text-gray-600 mb-6">Discover the perfect, stylish Funko Pops for your collection.</p>
            <div className="flex space-x-5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-indigo-600 transition-colors"
              >
                <FaFacebook className="text-xl" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-indigo-600 transition-colors"
              >
                <FaTwitter className="text-xl" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-indigo-600 transition-colors"
              >
                <FaInstagram className="text-xl" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-indigo-600 transition-colors"
              >
                <FaTiktok className="text-xl" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-4 uppercase">Categories</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors inline-block">
                  Exclusive Edition
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors inline-block">
                  Limited Edition
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors inline-block">
                  Marvel Collection
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors inline-block">
                  Special Offers
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-4 uppercase">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors inline-block">
                  Help & Support
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors inline-block">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors inline-block">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors inline-block">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4 uppercase">Newsletter</h3>
            <p className="text-gray-600 mb-4">Stay updated with our latest offers and products.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="w-full p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
              <button className="bg-indigo-600 text-white p-3 rounded-r-md hover:bg-indigo-700 transition-colors flex items-center justify-center">
                <FiSend />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">By subscribing, you agree to our Privacy Policy.</p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} PopVerseNepal - All Rights Reserved
        </div>
      </div>
    </footer>
  )
}

export default Footer

