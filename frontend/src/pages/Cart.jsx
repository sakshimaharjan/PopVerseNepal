"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FiTrash2, FiArrowLeft, FiShoppingBag, FiCreditCard } from "react-icons/fi"
import { useCart } from "../components/CartContext"
import { useAuth } from "../components/AuthContext"

function Cart() {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)
  const [discount, setDiscount] = useState(0)

  // Calculate shipping cost
  const shippingCost = cartTotal > 100 ? 0 : 10

  // Calculate final total
  const finalTotal = cartTotal + shippingCost - discount

  // Handle coupon application
  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "marvel10") {
      setDiscount(cartTotal * 0.1)
      setCouponApplied(true)
    } else {
      alert("Invalid coupon code")
    }
  }

  // Handle checkout
  const handleCheckout = () => {
    if (!currentUser) {
      navigate("/login?redirect=checkout")
    } else {
      navigate("/checkout")
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <FiShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="mt-2 text-gray-500">Looks like you haven't added any products to your cart yet.</p>
            <div className="mt-6">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
              >
                <FiArrowLeft size={16} />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <li key={item._id} className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              <Link to={`/product/${item._id}`} className="hover:text-indigo-600">
                                {item.name}
                              </Link>
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 capitalize">{item.category}</p>
                          </div>
                          <p className="text-lg font-medium text-indigo-600 mt-2 sm:mt-0">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Selector */}
                          <div className="flex items-center">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="w-8 h-8 rounded-l-md border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                            >
                              -
                            </button>
                            <div className="w-12 h-8 border-t border-b border-gray-300 flex items-center justify-center">
                              {item.quantity}
                            </div>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="w-8 h-8 rounded-r-md border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-gray-500 hover:text-red-600 flex items-center gap-1"
                          >
                            <FiTrash2 size={16} />
                            <span className="text-sm">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Cart Actions */}
              <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
                <Link to="/products" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800">
                  <FiArrowLeft size={16} />
                  <span>Continue Shopping</span>
                </Link>
                <button
                  onClick={() => clearCart()}
                  className="inline-flex items-center gap-2 text-red-600 hover:text-red-800"
                >
                  <FiTrash2 size={16} />
                  <span>Clear Cart</span>
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-medium">${cartTotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Shipping</p>
                  <p className="font-medium">{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</p>
                </div>

                {couponApplied && (
                  <div className="flex justify-between text-green-600">
                    <p>Discount</p>
                    <p className="font-medium">-${discount.toFixed(2)}</p>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <p className="font-medium text-gray-900">Total</p>
                  <p className="text-xl font-bold text-indigo-600">${finalTotal.toFixed(2)}</p>
                </div>
              </div>

              {/* Coupon Code */}
              {!couponApplied && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code</label>
                  <div className="flex">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter code"
                    />
                    <button
                      onClick={applyCoupon}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-r-md hover:bg-gray-300 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Try "MARVEL10" for 10% off</p>
                </div>
              )}

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <FiCreditCard size={18} />
                <span>Proceed to Checkout</span>
              </button>

              {/* Secure Checkout Message */}
              <div className="mt-4 flex items-center justify-center gap-1 text-sm text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

