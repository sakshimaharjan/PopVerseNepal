"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { FiHome, FiPackage, FiShoppingBag, FiUsers, FiSettings, FiMenu, FiX, FiLogOut, FiMail } from "react-icons/fi"

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={closeSidebar}></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-indigo-800 text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-indigo-700">
          <Link to="/admin" className="text-xl font-bold">
            Admin Dashboard
          </Link>
          <button className="md:hidden text-white" onClick={closeSidebar}>
            <FiX size={24} />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin"
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  isActive("/admin") ? "bg-indigo-700 text-white" : "text-indigo-100 hover:bg-indigo-700"
                }`}
                onClick={closeSidebar}
              >
                <FiHome size={18} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/products"
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  isActive("/admin/products") ? "bg-indigo-700 text-white" : "text-indigo-100 hover:bg-indigo-700"
                }`}
                onClick={closeSidebar}
              >
                <FiPackage size={18} />
                <span>Products</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/orders"
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  isActive("/admin/orders") ? "bg-indigo-700 text-white" : "text-indigo-100 hover:bg-indigo-700"
                }`}
                onClick={closeSidebar}
              >
                <FiShoppingBag size={18} />
                <span>Orders</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/contacts"
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  isActive("/admin/contacts") ? "bg-indigo-700 text-white" : "text-indigo-100 hover:bg-indigo-700"
                }`}
                onClick={closeSidebar}
              >
                <FiMail size={18} />
                <span>Contact Messages</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/users"
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  isActive("/admin/users") ? "bg-indigo-700 text-white" : "text-indigo-100 hover:bg-indigo-700"
                }`}
                onClick={closeSidebar}
              >
                <FiUsers size={18} />
                <span>Users</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/settings"
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  isActive("/admin/settings") ? "bg-indigo-700 text-white" : "text-indigo-100 hover:bg-indigo-700"
                }`}
                onClick={closeSidebar}
              >
                <FiSettings size={18} />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-indigo-700">
          <Link
            to="/logout"
            className="flex items-center gap-3 px-4 py-3 rounded-md text-indigo-100 hover:bg-indigo-700 transition-colors"
            onClick={closeSidebar}
          >
            <FiLogOut size={18} />
            <span>Logout</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm h-16 flex items-center px-6 z-30">
          <button className="md:hidden text-gray-600 mr-4" onClick={toggleSidebar}>
            <FiMenu size={24} />
          </button>
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-700">Admin User</div>
            <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">A</div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout
