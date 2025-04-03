"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { FiPackage, FiTruck, FiCheck, FiClock, FiDownload, FiArrowLeft } from "react-icons/fi"
import { useAuth } from "../components/AuthContext"

function Orders() {
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(true)

  // Demo orders data
  const [orders, setOrders] = useState([
    {
      id: "ORD-2025-1001",
      date: "2025-04-01",
      status: "Delivered",
      total: 89.97,
      items: [
        {
          id: "prod-1",
          name: "Funko Pop! Marvel: Spider-Man No Way Home",
          image: "/placeholder.svg?height=80&width=80",
          price: 29.99,
          quantity: 1,
        },
        {
          id: "prod-2",
          name: "Funko Pop! Marvel: Venom",
          image: "/placeholder.svg?height=80&width=80",
          price: 29.99,
          quantity: 2,
        },
      ],
      tracking: "USP123456789",
      deliveryDate: "2025-04-05",
    },
    {
      id: "ORD-2025-0892",
      date: "2025-03-15",
      status: "Shipped",
      total: 59.98,
      items: [
        {
          id: "prod-3",
          name: "Funko Pop! Marvel: Deadpool",
          image: "/placeholder.svg?height=80&width=80",
          price: 29.99,
          quantity: 2,
        },
      ],
      tracking: "USP987654321",
      deliveryDate: "2025-03-20",
    },
    {
      id: "ORD-2025-0764",
      date: "2025-02-28",
      status: "Processing",
      total: 119.96,
      items: [
        {
          id: "prod-4",
          name: "Funko Pop! Marvel: Captain America",
          image: "/placeholder.svg?height=80&width=80",
          price: 29.99,
          quantity: 1,
        },
        {
          id: "prod-5",
          name: "Funko Pop! Marvel: Iron Man",
          image: "/placeholder.svg?height=80&width=80",
          price: 29.99,
          quantity: 1,
        },
        {
          id: "prod-6",
          name: "Funko Pop! Marvel: Thor",
          image: "/placeholder.svg?height=80&width=80",
          price: 29.99,
          quantity: 2,
        },
      ],
    },
  ])

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

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
      default:
        return "bg-gray-100 text-gray-800"
    }
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
                      <h2 className="text-lg font-medium text-gray-900">Order #{order.id}</h2>
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
                    {order.items.map((item) => (
                      <li key={item.id} className="py-4 flex items-center">
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={item.image || "/placeholder.svg"}
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
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-lg font-bold text-indigo-600">${order.total.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:justify-end">
                    <button className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
                      <FiDownload size={16} />
                      <span>Invoice</span>
                    </button>
                    {order.status !== "Delivered" && (
                      <button className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
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

