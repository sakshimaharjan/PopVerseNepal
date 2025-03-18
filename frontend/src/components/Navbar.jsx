import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white py-4 px-8 shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-primary transition-colors">
          MarvelPopExpress
        </Link>
        <div className="flex gap-8">
          <Link to="/" className="text-gray-700 hover:text-primary transition-colors">Home</Link>
          <Link to="/products" className="text-gray-700 hover:text-primary transition-colors">Products</Link>
          <Link to="/about" className="text-gray-700 hover:text-primary transition-colors">About</Link>
          <Link to="/contact" className="text-gray-700 hover:text-primary transition-colors">Contact</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;