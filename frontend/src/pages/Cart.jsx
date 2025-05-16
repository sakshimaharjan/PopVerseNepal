import { useState } from "react"
import { Link } from "react-router-dom"
import { FiShoppingCart, FiTrash2, FiMinus, FiPlus, FiArrowRight } from "react-icons/fi"
import { useCart } from "../components/CartContext"

function Cart() {
  const { cart, updateQuantity, removeFromCart, cartTotal, applyCoupon, discount, couponCode } = useCart()
  const [coupon, setCoupon] = useState("")
  const [couponError, setCouponError] = useState("")
  const [couponSuccess, setCouponSuccess] = useState("")

  // Calculate shipping cost (free shipping over $100)
  const shippingCost = cartTotal >= 100 ? 0 : 10

  // Calculate final total
  const finalTotal = cartTotal + shippingCost - discount

  // Handle coupon application
  const handleApplyCoupon = () => {
    if (!coupon) {
      setCouponError("Please enter a coupon code")
      setCouponSuccess("")
      return
    }

    const success = applyCoupon(coupon)

    if (success) {
      setCouponSuccess(`Coupon "${coupon}" applied successfully!`)
      setCouponError("")
    } else {
      setCouponError("Invalid coupon code")
      setCouponSuccess("")
    }
  }

  // Empty cart message
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <FiShoppingCart className="mx-auto h-16 w-16 text-gray-400" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="mt-2 text-gray-500">Looks like you haven't added any items to your cart yet.</p>
            <div className="mt-6">
              <Link
                to="/products"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <li key={item._id} className="p-6">
                    <div className="flex flex-col sm:flex-row">
                      <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      <div className="flex-1 sm:ml-6 mt-4 sm:mt-0">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                            <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                          </div>
                          <p className="text-lg font-medium text-gray-900">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="p-2 text-gray-600 hover:text-indigo-600 cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <FiMinus size={16} />
                            </button>
                            <span className="px-4 py-2 text-gray-900">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="p-2 text-gray-600 hover:text-indigo-600 cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <FiPlus size={16} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                            aria-label="Remove item"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-medium">${cartTotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Shipping</p>
                  <p className="font-medium">{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</p>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <p>Discount {couponCode && `(${couponCode})`}</p>
                    <p className="font-medium">-${discount.toFixed(2)}</p>
                  </div>
                )}

                <div className="border-t pt-4 flex justify-between">
                  <p className="font-medium text-gray-900">Total</p>
                  <p className="text-xl font-bold text-indigo-600">${finalTotal.toFixed(2)}</p>
                </div>
              </div>

              {/* Coupon Code */}
              <div className="mb-6">
                <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Code
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="coupon"
                    className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 mr-1 border"
                    placeholder="Enter coupon code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-r-md hover:bg-gray-300 cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                <p className="mt-3 text-gray-500 text-xs">Apply "marvel10" for 10% off</p>
                {couponError && <p className="mt-2 text-sm text-red-600">{couponError}</p>}
                {couponSuccess && <p className="mt-2 text-sm text-green-600">{couponSuccess}</p>}
              </div>

              {/* Free shipping threshold message */}
              {cartTotal < 100 && (
                <div className="mb-6 bg-blue-50 text-blue-700 p-3 rounded-md text-sm">
                  Add ${(100 - cartTotal).toFixed(2)} more to qualify for free shipping!
                </div>
              )}

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 flex items-center justify-center cursor-pointer"
              >
                Proceed to Checkout
                <FiArrowRight className="ml-2" />
              </Link>

              {/* Continue Shopping */}
              <div className="mt-4 text-center">
                <Link to="/products" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
