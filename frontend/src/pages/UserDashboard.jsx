import { useState, useEffect } from "react"
import { useAuth } from "../components/AuthContext"
import { Link } from "react-router-dom"

function UserDashboard() {
  const { currentUser, logout } = useAuth()
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const mockOrders = [
      { id: "1", date: "2025-04-01", status: "Delivered", total: 59.99 },
      { id: "2", date: "2025-03-28", status: "Processing", total: 29.99 },
      { id: "3", date: "2025-03-15", status: "Shipped", total: 49.99 },
    ]

    setTimeout(() => {
      setRecentOrders(mockOrders)
      setLoading(false)
    }, 500)
  }, [])

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Hello, {currentUser?.name}!</h1>
              <p className="text-gray-600 mt-1">Welcome to your dashboard</p>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 sm:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Logout
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
              <h3 className="text-lg font-semibold text-indigo-800 mb-2">Account Details</h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">Name:</span> {currentUser?.name}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Email:</span> {currentUser?.email}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Account Type:</span>{" "}
                  {currentUser?.role === "admin" ? "Administrator" : "Customer"}
                </p>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border border-green-100">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Wishlist</h3>
              <p className="text-gray-700 mb-4">You have 5 items in your wishlist</p>
              <Link to="/products" className="text-green-600 hover:text-green-800 font-medium">
                View Products →
              </Link>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Rewards</h3>
              <p className="text-gray-700 mb-1">Membership Level: Silver</p>
              <p className="text-gray-700 mb-4">Points: 250</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: "25%" }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">250/1000 points to Gold level</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Orders</h2>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Loading your orders...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="py-3 px-4 text-left">Order ID</th>
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-left">Total</th>
                      <th className="py-3 px-4 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-200">
                        <td className="py-3 px-4">{order.id}</td>
                        <td className="py-3 px-4">{order.date}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === "Delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "Processing"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">${order.total.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <Link to={`/orders/${order.id}`} className="text-indigo-600 hover:text-indigo-800">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard

