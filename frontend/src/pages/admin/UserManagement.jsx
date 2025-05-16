"use client"

import { useState, useEffect } from "react"
import {
  FiRefreshCw,
  FiEdit,
  FiTrash2,
  FiUserPlus,
  FiSearch,
  FiUserCheck,
  FiUserX,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiDownload,
  FiAlertCircle,
} from "react-icons/fi"
import AdminLayout from "../../components/AdminLayout"

// Mock data for users
const MOCK_USERS = [
  {
    _id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    isActive: true,
  },
  {
    _id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "user",
    isActive: true,
  },
  {
    _id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "manager",
    isActive: false,
  },
  {
    _id: "4",
    name: "Alice Williams",
    email: "alice@example.com",
    role: "user",
    isActive: true,
  },
  {
    _id: "5",
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "user",
    isActive: true,
  },
]

function UserManagement() {
  // Load users from localStorage or use mock data
  const loadInitialUsers = () => {
    try {
      const savedUsers = localStorage.getItem("users")
      return savedUsers ? JSON.parse(savedUsers) : MOCK_USERS
    } catch (error) {
      console.error("Error loading users from localStorage:", error)
      return MOCK_USERS
    }
  }

  const [users, setUsers] = useState(loadInitialUsers)
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showEditUserModal, setShowEditUserModal] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  })
  const [formErrors, setFormErrors] = useState({})
  const [error, setError] = useState(null)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const usersPerPage = 10

  // Filters
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users))
  }, [users])

  useEffect(() => {
    applyFiltersAndPagination()
  }, [currentPage, roleFilter, statusFilter, searchTerm, users])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      // Simulate API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // We're just using the local state since the API is not available
      setLoading(false)
    } catch (error) {
      console.error("Error fetching users:", error)
      setError("Failed to load users. Using local data instead.")
      setLoading(false)
    }
  }

  const applyFiltersAndPagination = () => {
    // Apply filters
    let result = [...users]

    // Filter by role
    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter)
    }

    // Filter by status
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active"
      result = result.filter((user) => user.isActive === isActive)
    }

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Update total count and pages
    setTotalUsers(result.length)
    setTotalPages(Math.ceil(result.length / usersPerPage))

    // Apply pagination
    const startIndex = (currentPage - 1) * usersPerPage
    const paginatedUsers = result.slice(startIndex, startIndex + usersPerPage)
    setFilteredUsers(paginatedUsers)

    // Reset to page 1 if current page is now invalid
    if (currentPage > Math.ceil(result.length / usersPerPage) && Math.ceil(result.length / usersPerPage) > 0) {
      setCurrentPage(1)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) errors.name = "Name is required"
    if (!formData.email.trim()) errors.email = "Email is required"
    if (!formData.email.includes("@")) errors.email = "Email is invalid"

    // Only validate password for new users
    if (!currentUser && !formData.password) errors.password = "Password is required"
    if (!currentUser && formData.password && formData.password.length < 6)
      errors.password = "Password must be at least 6 characters"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) return

    try {
      if (currentUser) {
        // Update existing user
        const userData = {
          ...currentUser,
          name: formData.name,
          email: formData.email,
          role: formData.role,
        }

        // Only update password if provided
        if (formData.password) {
          userData.password = formData.password
        }

        setUsers(users.map((user) => (user._id === currentUser._id ? userData : user)))
        setShowEditUserModal(false)
        alert("User updated successfully")
      } else {
        // Create new user
        const newUser = {
          _id: Date.now().toString(), // Generate a temporary ID
          name: formData.name,
          email: formData.email,
          password: formData.password, // In a real app, this would be hashed
          role: formData.role,
          isActive: true,
        }

        setUsers([...users, newUser])
        setShowAddUserModal(false)
        alert("User created successfully")
      }

      resetForm()
    } catch (error) {
      console.error("Error saving user:", error)
      setError("Error saving user. Please try again.")
    }
  }

  const handleEdit = (user) => {
    setCurrentUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // Don't set password for editing
      role: user.role || "user",
    })
    setShowEditUserModal(true)
  }

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return
    }

    try {
      // Update local state
      setUsers(users.filter((user) => user._id !== userId))
      alert("User deleted successfully")
    } catch (error) {
      console.error("Error deleting user:", error)
      setError("Error deleting user. Please try again.")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "user",
    })
    setFormErrors({})
    setCurrentUser(null)
  }

  const openAddUserModal = () => {
    resetForm()
    setShowAddUserModal(true)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    applyFiltersAndPagination()
  }

  const exportUsers = () => {
    // In a real app, you would generate a CSV file
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Name,Email,Role,Status\n" +
      users.map((user) => `${user.name},${user.email},${user.role},${user.isActive ? "Active" : "Inactive"}`).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "users.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return "U"

    const nameParts = name.split(" ")
    if (nameParts.length > 1) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase()
    }
    return nameParts[0][0].toUpperCase()
  }

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "manager":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Management</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <FiFilter size={16} />
              <span>Filters</span>
            </button>
            <button
              onClick={exportUsers}
              className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <FiDownload size={16} />
              <span>Export</span>
            </button>
            <button
              onClick={fetchUsers}
              className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <FiRefreshCw size={16} />
              <span>Refresh</span>
            </button>
            <button
              onClick={openAddUserModal}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              <FiUserPlus size={16} />
              <span>Add User</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded flex items-center">
            <FiAlertCircle className="mr-2" />
            {error}
          </div>
        )}

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="user">User</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <form onSubmit={handleSearchSubmit} className="flex">
                  <input
                    type="text"
                    placeholder="Search by name or email"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700">
                    <FiSearch size={16} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar (if filters are hidden) */}
        {!showFilters && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <button type="submit" className="sr-only">
                Search
              </button>
            </form>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                              {getUserInitials(user.name)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role)}`}
                          >
                            {user.role || "user"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`flex items-center gap-1 text-sm ${
                              user.isActive !== false ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {user.isActive !== false ? (
                              <>
                                <FiUserCheck size={16} />
                                <span>Active</span>
                              </>
                            ) : (
                              <>
                                <FiUserX size={16} />
                                <span>Inactive</span>
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:text-red-900">
                            <FiTrash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 0 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * usersPerPage + 1}</span> to{" "}
                    <span className="font-medium">{Math.min(currentPage * usersPerPage, totalUsers)}</span> of{" "}
                    <span className="font-medium">{totalUsers}</span> users
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiChevronLeft size={16} />
                    </button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      // Show at most 5 page buttons
                      let pageNum = i + 1
                      if (totalPages > 5) {
                        if (currentPage > 3) {
                          pageNum = currentPage - 3 + i
                        }
                        if (currentPage > totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        }
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-1 border rounded-md text-sm font-medium ${
                            currentPage === pageNum
                              ? "bg-indigo-600 text-white border-indigo-600"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    formErrors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    formErrors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    formErrors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.password && <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    formErrors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    formErrors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password (Leave blank to keep current password)
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    formErrors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.password && <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditUserModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default UserManagement
