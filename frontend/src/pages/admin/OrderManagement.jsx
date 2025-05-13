"use client"

import { useState, useEffect } from "react"
import { FiFilter, FiRefreshCw, FiEye, FiPackage, FiTruck, FiCheck, FiX, FiDownload } from "react-icons/fi"
import AdminLayout from "../../components/AdminLayout"
import axios from "axios"

function OrderManagement() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders/admin`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      setOrders(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching orders:", error)
      setLoading(false)
    }
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

  // Filter orders based on selected filter
  const filteredOrders = filter === "all" ? orders : orders.filter((order) => order.orderStatus === filter)

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
      setOrders(orders.map((order) => (order._id === orderId ? { ...order, orderStatus: status } : order)))

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

  // Generate invoice (simplified version without jsPDF)
  const generateInvoice = (order) => {
    // Create a printable invoice in a new window
    const invoiceWindow = window.open("", "_blank")

    if (!invoiceWindow) {
      alert("Please allow popups to generate the invoice")
      return
    }

    const invoiceContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice #INV-${order._id.substring(0, 8)}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .invoice-header { text-align: center; margin-bottom: 30px; }
          .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .invoice-details div { width: 45%; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f2f2f2; }
          .total-row { font-weight: bold; }
          .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #666; }
          @media print {
            .no-print { display: none; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <h1>MarvelPopExpress</h1>
          <h2>INVOICE</h2>
          <p>Invoice #: INV-${order._id.substring(0, 8)}</p>
          <p>Date: ${formatDate(order.createdAt)}</p>
        </div>
        
        <div class="invoice-details">
          <div>
            <h3>Bill To:</h3>
            <p>${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br>
            ${order.shippingAddress.streetAddress}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
            ${order.shippingAddress.country}</p>
          </div>
          <div>
            <h3>Order Details:</h3>
            <p>Order #: ${order._id}<br>
            Payment Method: ${getPaymentMethodName(order.paymentMethod)}<br>
            Payment Status: ${order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}</p>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items
              .map(
                (item) => `
              <tr>
                <td>${item.product?.name || "Product"}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            `,
              )
              .join("")}
            <tr>
              <td colspan="3" style="text-align: right;">Subtotal:</td>
              <td>$${order.totalAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" style="text-align: right;">Shipping:</td>
              <td>$0.00</td>
            </tr>
            <tr class="total-row">
              <td colspan="3" style="text-align: right;">Total:</td>
              <td>$${order.totalAmount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="footer">
          <p>Thank you for your business!</p>
          <p>MarvelPopExpress - Your premier destination for Marvel collectibles</p>
        </div>
        
        <div class="no-print" style="text-align: center; margin-top: 30px;">
          <button onclick="window.print();" style="padding: 10px 20px; background: #4338ca; color: white; border: none; border-radius: 4px; cursor: pointer;">Print Invoice</button>
        </div>
      </body>
      </html>
    `

    invoiceWindow.document.open()
    invoiceWindow.document.write(invoiceContent)
    invoiceWindow.document.close()
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Order Management</h1>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            <FiRefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-500" />
            <span className="text-gray-700 font-medium">Filter by Status:</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === "all" ? "bg-indigo-100 text-indigo-800" : "bg-gray-100 text-gray-800"
              }`}
            >
              All Orders
            </button>
            <button
              onClick={() => setFilter("processing")}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === "processing" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
              }`}
            >
              Processing
            </button>
            <button
              onClick={() => setFilter("shipped")}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === "shipped" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
              }`}
            >
              Shipped
            </button>
            <button
              onClick={() => setFilter("delivered")}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === "delivered" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
              }`}
            >
              Delivered
            </button>
            <button
              onClick={() => setFilter("cancelled")}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === "cancelled" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
              }`}
            >
              Cancelled
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                      Payment
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
                  {filteredOrders.map((order) => (
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">{getPaymentMethodName(order.paymentMethod)}</span>
                          <span
                            className={`mt-1 px-2 py-0.5 text-xs font-medium rounded-full inline-block w-fit ${getPaymentStatusColor(order.paymentStatus)}`}
                          >
                            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.orderStatus)}`}
                        >
                          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="View Details"
                          >
                            <FiEye size={18} />
                          </button>
                          {(order.orderStatus === "delivered" || order.orderStatus === "shipped") && (
                            <button
                              onClick={() => generateInvoice(order)}
                              className="text-green-600 hover:text-green-900"
                              title="Generate Invoice"
                            >
                              <FiDownload size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

export default OrderManagement
