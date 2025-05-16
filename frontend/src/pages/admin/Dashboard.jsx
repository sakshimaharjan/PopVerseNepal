import { useState, useEffect } from "react"
import {
  FiPackage,
  FiShoppingBag,
  FiDollarSign,
  FiUsers,
  FiRefreshCw,
  FiEye,
  FiX,
  FiTruck,
  FiCheck,
} from "react-icons/fi"
import AdminLayout from "../../components/AdminLayout"
import PolarChart from "./PolarChart"
import BarChart from "./BarChart"
import axios from "axios"

function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
    activeUsers: 0,
  })

  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch products
        const productsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`)
        const products = productsResponse.data

        // Fetch orders
        const ordersResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/admin`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        const orders = ordersResponse.data

        // Calculate revenue (only from delivered orders with completed payment)
        const totalRevenue = orders
          .filter((order) => order.orderStatus === "delivered" && order.paymentStatus === "completed")
          .reduce((sum, order) => sum + order.totalAmount, 0)

        // Update stats
        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          revenue: totalRevenue,
          activeUsers: 25, // Placeholder value
        })

        // Set recent orders (last 5)
        setRecentOrders(orders.slice(0, 5))
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const refreshData = () => {
    // Reload the data
    window.location.reload()
  }

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Function to get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Function to get payment method display name
  const getPaymentMethodName = (method) => {
    switch (method) {
      case "paypal":
        return "PayPal"
      case "khalti":
        return "Khalti"
      case "cash_on_delivery":
        return "Cash on Delivery"
      default:
        return method
    }
  }

  // Function to get payment status badge color
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // View order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order)
    setShowOrderDetails(true)
  }

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    if (!window.confirm(`Are you sure you want to mark this order as ${status}?`)) {
      return
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/orders/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      )

      // Update local state
      setRecentOrders(recentOrders.map((order) => (order._id === orderId ? { ...order, orderStatus: status } : order)))

      // Update selected order if it's the one being viewed
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: status })
      }

      alert(`Order status updated to ${status}`)
    } catch (error) {
      console.error("Error updating order status:", error)
      alert("Error updating order status. Please try again.")
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            onClick={refreshData}
            className="flex items-center gap-2 cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            <FiRefreshCw size={16} />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 mr-4">
                <FiPackage className="text-indigo-500 text-xl" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500 font-medium">Total Products</h3>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <FiShoppingBag className="text-green-500 text-xl" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500 font-medium">Total Orders</h3>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 mr-4">
                <FiDollarSign className="text-purple-500 text-xl" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500 font-medium">Revenue</h3>
                <div className="text-2xl font-bold">${stats.revenue.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <FiUsers className="text-blue-500 text-xl" />
              </div>
              <div>
                <h3 className="text-sm text-gray-500 font-medium">Active Users</h3>
                <div className="text-2xl font-bold">{stats.activeUsers}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading orders...</p>
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500">No orders found</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
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
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order._id.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getPaymentMethodName(order.paymentMethod)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.orderStatus)}`}
                        >
                          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                          title="View Details"
                        >
                          <FiEye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Sales by Character</h2>
            <div className="h-80">
              <PolarChart />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Top Selling Products</h2>
            <div className="h-80">
              <BarChart />
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Order Details</h2>
                <button onClick={() => setShowOrderDetails(false)} className="text-gray-500 hover:text-gray-700">
                  <FiX size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Order Information</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Order ID:</span> #{selectedOrder._id}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      <span className="font-medium">Date:</span> {formatDate(selectedOrder.createdAt)}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      <span className="font-medium">Status:</span>
                      <span
                        className={`ml-1 px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(selectedOrder.orderStatus)}`}
                      >
                        {selectedOrder.orderStatus.charAt(0).toUpperCase() + selectedOrder.orderStatus.slice(1)}
                      </span>
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      <span className="font-medium">Payment Method:</span>{" "}
                      {getPaymentMethodName(selectedOrder.paymentMethod)}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      <span className="font-medium">Payment Status:</span>
                      <span
                        className={`ml-1 px-2 py-0.5 text-xs font-medium rounded-full ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}
                      >
                        {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Customer Information</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Name:</span> {selectedOrder.shippingAddress.firstName}{" "}
                      {selectedOrder.shippingAddress.lastName}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      <span className="font-medium">Email:</span> {selectedOrder.user?.email || "N/A"}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      <span className="font-medium">Phone:</span> {selectedOrder.shippingAddress.phone || "N/A"}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      <span className="font-medium">Address:</span> {selectedOrder.shippingAddress.streetAddress}
                    </p>
                    {selectedOrder.shippingAddress.apartment && (
                      <p className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">Apartment:</span> {selectedOrder.shippingAddress.apartment}
                      </p>
                    )}
                    <p className="text-sm text-gray-700 mt-1">
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode},{" "}
                      {selectedOrder.shippingAddress.country}
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-medium mb-2">Order Items</h3>
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                          {item.product?.name || "Product"}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{item.quantity}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t border-gray-200">
                    <tr>
                      <td colSpan="3" className="px-4 py-2 text-sm font-medium text-gray-700 text-right">
                        Subtotal:
                      </td>
                      <td className="px-4 py-2 text-sm font-medium text-gray-700">
                        ${selectedOrder.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="px-4 py-2 text-sm font-medium text-gray-700 text-right">
                        Shipping:
                      </td>
                      <td className="px-4 py-2 text-sm font-medium text-gray-700">$0.00</td>
                    </tr>
                    <tr>
                      <td colSpan="3" className="px-4 py-2 text-sm font-bold text-gray-900 text-right">
                        Total:
                      </td>
                      <td className="px-4 py-2 text-sm font-bold text-gray-900">
                        ${selectedOrder.totalAmount.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <h3 className="text-lg font-medium mb-2">Update Order Status</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateOrderStatus(selectedOrder._id, "processing")}
                  className="flex items-center gap-1 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200"
                  disabled={selectedOrder.orderStatus === "processing"}
                >
                  <FiPackage size={16} />
                  <span>Processing</span>
                </button>
                <button
                  onClick={() => updateOrderStatus(selectedOrder._id, "shipped")}
                  className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
                  disabled={selectedOrder.orderStatus === "shipped"}
                >
                  <FiTruck size={16} />
                  <span>Shipped</span>
                </button>
                <button
                  onClick={() => updateOrderStatus(selectedOrder._id, "delivered")}
                  className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200"
                  disabled={selectedOrder.orderStatus === "delivered"}
                >
                  <FiCheck size={16} />
                  <span>Delivered</span>
                </button>
                <button
                  onClick={() => updateOrderStatus(selectedOrder._id, "cancelled")}
                  className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                  disabled={selectedOrder.orderStatus === "cancelled"}
                >
                  <FiX size={16} />
                  <span>Cancelled</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default Dashboard
