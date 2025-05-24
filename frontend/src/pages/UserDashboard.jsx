import { useState, useEffect } from "react"
import { useAuth } from "../components/AuthContext"
import { useCart } from "../components/CartContext"
import { Link } from "react-router-dom"
import { FiShoppingBag, FiHeart, FiAward, FiPackage, FiClock, FiTruck, FiCheck } from "react-icons/fi"
import axios from "axios"

function UserDashboard() {
  const { currentUser, logout } = useAuth()
  const { cart } = useCart()
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
  })

  useEffect(() => {
    // Fetch user's orders
    const fetchOrders = async () => {
      try {
        setLoading(true)

        // Fetch real orders from the API
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/user`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        const userOrders = response.data

        // Calculate stats from real data
        const totalOrders = userOrders.length
        const pendingOrders = userOrders.filter(
          (order) => order.orderStatus === "processing" || order.orderStatus === "shipped"
        ).length
        const completedOrders = userOrders.filter((order) => order.orderStatus === "delivered").length
        const totalSpent = userOrders.reduce((sum, order) => sum + order.totalAmount, 0)

        setStats({
          totalOrders,
          pendingOrders,
          completedOrders,
          totalSpent,
        })

        // Get recent orders (last 3)
        setRecentOrders(userOrders.slice(0, 3))

        // Get wishlist count from localStorage
        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
        setWishlistCount(wishlist.length)

        setLoading(false)
      } catch (error) {
        console.error("Error fetching user data:", error)
        // If there's an error, set empty data
        setRecentOrders([])
        setStats({
          totalOrders: 0,
          pendingOrders: 0,
          completedOrders: 0,
          totalSpent: 0,
        })
        setLoading(false)
      }
    }

    if (currentUser) {
      fetchOrders()
    } else {
      setLoading(false)
    }
  }, [currentUser])

  const handleLogout = () => {
    logout()
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <FiCheck className="text-green-500" size={18} />
      case "shipped":
        return <FiTruck className="text-blue-500" size={18} />
      case "processing":
        return <FiClock className="text-yellow-500" size={18} />
      default:
        return <FiPackage className="text-gray-500" size={18} />
    }
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Default profile picture if none exists
  const defaultProfilePic = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    currentUser?.name || "User"
  )}&background=6366F1&color=fff`

  // Use profile picture if available, otherwise use default
  const profilePicture = currentUser?.profilePicture || defaultProfilePic

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img 
                  src={profilePicture || "/placeholder.svg"} 
                  alt={currentUser?.name || "User"} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log("Image load error, falling back to default")
                    e.target.src = defaultProfilePic
                  }}
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Hello, {currentUser?.name || "User"}!</h1>
                <p className="text-gray-600 mt-1">Welcome to your dashboard</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 sm:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                  <FiPackage size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                  <FiClock size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Pending Orders</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.pendingOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <FiCheck size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Completed Orders</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.completedOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  <FiAward size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-800">${stats.totalSpent.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
              <h3 className="text-lg font-semibold text-indigo-800 mb-2">Account Details</h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">Name:</span> {currentUser?.name || "User"}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Email:</span> {currentUser?.email || "user@example.com"}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Account Type:</span>{" "}
                  {currentUser?.role === "admin" ? "Administrator" : "Customer"}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Member Since:</span>{" "}
                  {currentUser?.createdAt ? formatDate(currentUser.createdAt) : "N/A"}
                </p>
              </div>
              <div className="mt-4">
                <Link to="/profile" className="text-indigo-600 hover:text-indigo-800 font-medium">
                  Edit Profile →
                </Link>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border border-green-100">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Shopping</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-gray-700 flex items-center gap-2">
                    <FiShoppingBag className="text-green-600" />
                    <span>Cart Items</span>
                  </p>
                  <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    {cart.length} items
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-700 flex items-center gap-2">
                    <FiHeart className="text-green-600" />
                    <span>Wishlist</span>
                  </p>
                  <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    {wishlistCount} items
                  </span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Link to="/cart" className="text-green-600 hover:text-green-800 font-medium">
                  View Cart →
                </Link>
                <span className="text-gray-400">|</span>
                <Link to="/wishlist" className="text-green-600 hover:text-green-800 font-medium">
                  View Wishlist →
                </Link>
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Rewards</h3>
              {/* Calculate rewards tier based on total spent */}
              {(() => {
                let tier = "Bronze";
                let points = Math.floor(stats.totalSpent);
                let nextTier = "Silver";
                let pointsToNext = 250 - points;
                let progress = (points / 250) * 100;
                
                if (points >= 250 && points < 1000) {
                  tier = "Silver";
                  nextTier = "Gold";
                  pointsToNext = 1000 - points;
                  progress = ((points - 250) / 750) * 100;
                } else if (points >= 1000) {
                  tier = "Gold";
                  nextTier = "Platinum";
                  pointsToNext = 2500 - points;
                  progress = ((points - 1000) / 1500) * 100;
                  
                  if (points >= 2500) {
                    tier = "Platinum";
                    nextTier = "Diamond";
                    pointsToNext = 5000 - points;
                    progress = ((points - 2500) / 2500) * 100;
                    
                    if (points >= 5000) {
                      tier = "Diamond";
                      nextTier = "Diamond";
                      pointsToNext = 0;
                      progress = 100;
                    }
                  }
                }
                
                // Cap progress at 100%
                progress = Math.min(progress, 100);
                
                return (
                  <>
                    <p className="text-gray-700 mb-1">Membership Level: {tier}</p>
                    <p className="text-gray-700 mb-4">Points: {points}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-purple-600 h-2.5 rounded-full" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    {tier !== "Diamond" && (
                      <p className="text-xs text-gray-500 mt-1">
                        {pointsToNext} points to {nextTier} level
                      </p>
                    )}
                  </>
                );
              })()}
              <div className="mt-4">
                <Link to="/rewards" className="text-purple-600 hover:text-purple-800 font-medium">
                  View Rewards →
                </Link>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Recent Orders</h2>
              <Link to="/orders" className="text-indigo-600 hover:text-indigo-800 font-medium">
                View All Orders →
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Loading your orders...</p>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No orders yet</h3>
                <p className="mt-1 text-gray-500">Start shopping to see your orders here.</p>
                <div className="mt-6">
                  <Link
                    to="/products"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Browse Products
                  </Link>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order._id.substring(0, 8)}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-500">
                          {order.items.map((item) => 
                            item.product?.name || "Product"
                          ).join(", ")}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}
                          >
                            {getStatusIcon(order.orderStatus)}
                            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${order.totalAmount.toFixed(2)}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm font-medium">
                          <Link to={`/orders/${order._id}`} className="text-indigo-600 hover:text-indigo-900">
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
