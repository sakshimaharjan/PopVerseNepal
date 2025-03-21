import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FiMenu, FiX, FiShoppingCart, FiUser } from 'react-icons/fi';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white py-8 px-6 shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-primary transition-colors">
          MarvelPopExpress
        </Link>
        
        <div className="hidden md:flex gap-6 text-l">
          <Link to="/" className="text-gray-700 font-semibold hover:text-primary transition">Home</Link>
          <Link to="/products" className="text-gray-700 font-semibold hover:text-primary transition">Products</Link>
          <Link to="/about" className="text-gray-700 font-semibold hover:text-primary transition">About</Link>
          <Link to="/contact" className="text-gray-700 font-semibold hover:text-primary transition">Contact</Link>
          <Link to="/cart" className="text-gray-700 hover:text-primary transition"><FiShoppingCart size={22} /></Link>
          <Link to="/login" className="text-gray-700 hover:text-primary transition"><FiUser size={22} /></Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX size={26} /> : <FiMenu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md absolute top-16 left-0 w-full flex flex-col items-center py-4 gap-4">
          <Link to="/" className="text-gray-700 font-semibold hover:text-primary transition" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/products" className="text-gray-700 font-semibold hover:text-primary transition" onClick={() => setIsOpen(false)}>Products</Link>
          <Link to="/about" className="text-gray-700 font-semibold hover:text-primary transition" onClick={() => setIsOpen(false)}>About</Link>
          <Link to="/contact" className="text-gray-700 font-semibold hover:text-primary transition" onClick={() => setIsOpen(false)}>Contact</Link>
          <Link to="/cart" className="text-gray-700 hover:text-primary transition" onClick={() => setIsOpen(false)}><FiShoppingCart size={22} /></Link>
          <Link to="/login" className="text-gray-700 hover:text-primary transition" onClick={() => setIsOpen(false)}><FiUser size={22} /></Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
