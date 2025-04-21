import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FiPackage, FiTruck, FiCheck, FiClock, FiDownload, FiArrowLeft } from "react-icons/fi"
import { useAuth } from "../components/AuthContext"
import axios from "axios"

function Orders() {
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await axios.get("http://localhost:3000/api/orders/user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        // Transform the API response to match our component's expected format
        const formattedOrders = response.data.map((order) => ({
          id: order._id,
          date: order.createdAt,
          status: order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1),
          total: order.totalAmount,
          items: order.items.map((item) => ({
            id: item.product?._id || item.product,
            name: item.product?.name || "Product",
            image: item.product?.image || "/placeholder.svg?height=80&width=80",
            price: item.price,
            quantity: item.quantity,
          })),
          tracking: order.trackingNumber || null,
          deliveryDate: order.estimatedDeliveryDate || null,
          paymentMethod: order.paymentMethod,
        }))

        setOrders(formattedOrders)
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [currentUser])

  // Helper function to get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <FiCheck className="text-green-500" size={18} />
      case "Shipped":
        return <FiTruck className="text-blue-500" size={18} />
      case "Processing":
        return <FiClock className="text-yellow-500" size={18} />
      default:
        return <FiPackage className="text-gray-500" size={18} />
    }
  }

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "Shipped":
        return "bg-blue-100 text-blue-800"
      case "Processing":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Function to generate and download invoice
  const downloadInvoice = (order) => {
    alert(`Downloading invoice for order ${order.id}...`)
    // In a real application, this would generate a PDF invoice
  }

  // Function to track order
  const trackOrder = (order) => {
    alert(`Tracking order ${order.id}...`)
    // In a real application, this would open a tracking page or modal
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800">
            <FiArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <FiPackage className="mx-auto h-16 w-16 text-gray-400" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">No orders yet</h2>
            <p className="mt-2 text-gray-500">When you place orders, they will appear here.</p>
            <div className="mt-6">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
              >
                <span>Start Shopping</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 p-4 sm:p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">Order #{order.id.substring(0, 8)}</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-base font-medium text-gray-900 mb-4">Items</h3>
                  <ul className="divide-y divide-gray-200">
                    {order.items.map((item, index) => (
                      <li key={`${item.id || index}`} className="py-4 flex items-center">
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={item.image || "/placeholder.svg?height=80&width=80"}
                            alt={item.name}
                            className="w-full h-full object-contain p-2"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            ${item.price.toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 p-4 sm:p-6 border-t border-gray-200">
                  <div className="flex justify-between">
                    <div>
                      {order.tracking && (
                        <div className="text-sm">
                          <span className="text-gray-500">Tracking Number: </span>
                          <span className="font-medium">{order.tracking}</span>
                        </div>
                      )}
                      {order.deliveryDate && (
                        <div className="text-sm mt-1">
                          <span className="text-gray-500">
                            {order.status === "Delivered" ? "Delivered on: " : "Estimated Delivery: "}
                          </span>
                          <span className="font-medium">{new Date(order.deliveryDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="text-sm mt-1">
                        <span className="text-gray-500">Payment Method: </span>
                        <span className="font-medium capitalize">
                          {order.paymentMethod?.replace(/_/g, " ") || "Not specified"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-lg font-bold text-indigo-600">${order.total.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:justify-end">
                    {order.status === "Delivered" || order.status === "Shipped" ? (
                      <button
                        onClick={() => downloadInvoice(order)}
                        className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <FiDownload size={16} />
                        <span>Invoice</span>
                      </button>
                    ) : null}
                    {order.status !== "Delivered" && order.status !== "Cancelled" && (
                      <button
                        onClick={() => trackOrder(order)}
                        className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        <FiTruck size={16} />
                        <span>Track Order</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
