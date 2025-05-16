import { useState } from "react"
import { FiDownload, FiPrinter } from "react-icons/fi"

function Invoice({ order, onClose }) {
  const [logoUrl, setLogoUrl] = useState("/logo.png")

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Get payment method display name
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

  // Print invoice
  const printInvoice = () => {
    window.print()
  }

  // Download invoice as PDF
  const downloadInvoice = () => {
    window.print()
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto print:shadow-none">
      {/* Print-only styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>

      {/* Invoice Header */}
      <div className="flex justify-between items-start mb-8 border-b pb-6">
        <div className="flex items-center">
          <img src={logoUrl || "/placeholder.svg"} alt="MarvelPopExpress Logo" className="h-16 mr-4" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">MarvelPopExpress</h1>
            <p className="text-gray-500">Your premier destination for Marvel collectibles</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold text-indigo-600">INVOICE</h2>
          <p className="text-gray-600 mt-1">#{order._id.substring(0, 8)}</p>
          <p className="text-gray-600">Date: {formatDate(order.createdAt)}</p>
        </div>
      </div>

      {/* Billing & Shipping Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Bill To:</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="font-medium">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </p>
            <p>{order.shippingAddress.streetAddress}</p>
            {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
            <p className="mt-2">{order.shippingAddress.phone}</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Details:</h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-medium">#{order._id.substring(0, 8)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Order Date:</span>
              <span className="font-medium">{formatDate(order.createdAt)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium">{getPaymentMethodName(order.paymentMethod)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Status:</span>
              <span
                className={`font-medium ${order.paymentStatus === "completed" ? "text-green-600" : "text-yellow-600"}`}
              >
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Items:</h3>
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {order.items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src={item.product?.image || "/placeholder.svg?height=40&width=40"}
                        alt={item.product?.name || "Product"}
                        className="h-full w-full object-contain p-1"
                      />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{item.product?.name || "Product"}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-right text-sm text-gray-500">${item.price.toFixed(2)}</td>
                <td className="py-4 px-4 text-right text-sm text-gray-500">{item.quantity}</td>
                <td className="py-4 px-4 text-right text-sm font-medium text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Summary */}
      <div className="flex justify-end mb-8">
        <div className="w-full md:w-64">
          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">${order.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-medium">$0.00</span>
            </div>

            {/* Display discount if present */}
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount {order.couponCode && `(${order.couponCode})`}:</span>
                <span className="font-medium">-${order.discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="font-bold text-gray-800">Total:</span>
              <span className="font-bold text-indigo-600">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Thank You Note */}
      <div className="text-center border-t pt-6 mb-6">
        <p className="text-gray-600 mb-1">Thank you for your business!</p>
        <p className="text-sm text-gray-500">If you have any questions about this invoice, please contact us at</p>
        <p className="text-sm text-gray-500">support@marvelpopexpress.com or call at +977 9876543210</p>
      </div>

      {/* Invoice Actions - Only visible when not printing */}
      <div className="flex justify-center gap-4 mt-8 no-print">
        <button
          onClick={printInvoice}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          <FiPrinter size={16} />
          <span>Print Invoice</span>
        </button>
        <button
          onClick={downloadInvoice}
          className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
        >
          <FiDownload size={16} />
          <span>Download PDF</span>
        </button>
      </div>
    </div>
  )
}

export default Invoice
