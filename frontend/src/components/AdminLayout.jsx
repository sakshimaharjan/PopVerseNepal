"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  FiHome,
  FiPackage,
  FiShoppingBag,
  FiUsers,
  FiSettings,
  FiMenu,
  FiX,
  FiLogOut,
  FiMail,
  FiAlertTriangle,
} from "react-icons/fi"
import { useAuth } from "./AuthContext"

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!currentUser || !currentUser.name) return "U"

    const nameParts = currentUser.name.split(" ")
    if (nameParts.length > 1) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase()
    }
    return nameParts[0][0].toUpperCase()
  }

  // Default profile picture if none exists
  const defaultProfilePic = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    currentUser?.name || "User",
  )}&background=6366F1&color=fff`

  // Use profile picture if available, otherwise use default
  const profilePicture = currentUser?.profilePicture || defaultProfilePic

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

        {/* User Info in Sidebar */}
        {currentUser && (
          <div className="px-6 py-4 border-b border-indigo-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src={profilePicture || "/placeholder.svg"}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log("Image load error in sidebar, falling back to default")
                    e.target.src = defaultProfilePic
                  }}
                />
              </div>
              <div className="overflow-hidden">
                <p className="text-white font-medium truncate">{currentUser.name}</p>
                <p className="text-indigo-200 text-sm truncate">{currentUser.email}</p>
              </div>
            </div>
          </div>
        )}

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
            <li>
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-indigo-100 hover:bg-indigo-700"
                onClick={closeSidebar}
              >
                <span>← Back to Home</span>
              </Link>
            </li>
            <li>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center gap-3 px-4 cursor-pointer py-3 rounded-md text-indigo-100 hover:bg-indigo-700 transition-colors"
              >
                <FiLogOut size={18} />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
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
            {currentUser && (
              <>
                <div className="text-sm text-gray-700 hidden sm:block">{currentUser.name}</div>
                <div className="h-8 w-8 rounded-full overflow-hidden">
                  <img
                    src={profilePicture || "/placeholder.svg"}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log("Image load error in header, falling back to default")
                      e.target.src = defaultProfilePic
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <FiAlertTriangle size={20} />
              </div>
              <h2 className="text-xl font-bold">Confirm Logout</h2>
            </div>
            <p className="text-gray-600 mb-6">Are you sure you want to logout from the admin panel?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminLayout
