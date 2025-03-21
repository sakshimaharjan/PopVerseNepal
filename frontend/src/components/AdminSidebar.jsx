import { Link } from 'react-router-dom';

function AdminSidebar() {

  return (
    <aside className="fixed left-0 mt-25 top-0 bottom-0 w-34 bg-gray-900 text-white p-4 transition-all duration-300 md:w-64 sm:w-16">
      <Link to="/admin" className="flex items-center text-xs lg:text-xl font-bold mb-8 md:justify-start">
        <span className="md:hidden">📊Admin Panel</span>
        <span className="hidden md:block">Admin Panel</span>
      </Link>
      
      <nav className="space-y-2">
        <Link to="/admin" className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg p-3 transition-colors md:justify-start">
          <span className="mr-3 md:mr-0">📊</span>
          <span className="hidden md:inline">Dashboard</span>
        </Link>
        <Link to="/admin/products" className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg p-3 transition-colors md:justify-start">
          <span className="mr-3 md:mr-0">📦</span>
          <span className="hidden md:inline">Products</span>
        </Link>
        <Link to="/admin/orders" className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg p-3 transition-colors md:justify-start">
          <span className="mr-3 md:mr-0">🛍️</span>
          <span className="hidden md:inline">Orders</span>
        </Link>
        <Link to="/admin/customers" className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg p-3 transition-colors md:justify-start">
          <span className="mr-3 md:mr-0">👥</span>
          <span className="hidden md:inline">Customers</span>
        </Link>
        <Link to="/admin/settings" className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg p-3 transition-colors md:justify-start">
          <span className="mr-3 md:mr-0">⚙️</span>
          <span className="hidden md:inline">Settings</span>
        </Link>
        <Link to="/" className="flex items-center text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg p-3 transition-colors md:justify-start">
          <span className="mr-3 md:mr-0">←</span>
          <span className="hidden md:inline">Back to Home</span>
        </Link>
      </nav>
    </aside>
  );
}

export default AdminSidebar;