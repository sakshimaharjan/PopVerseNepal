import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FiArrowLeft, FiLock, FiCheck, FiDollarSign, FiCreditCard, FiTruck } from "react-icons/fi"
import { useCart } from "../components/CartContext"
import { useAuth } from "../components/AuthContext"
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"
import axios from "axios"

function Checkout() {
  const { cart, cartTotal, clearCart, discount, couponCode } = useCart()
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: currentUser?.email || "",
    firstName: "",
    lastName: "",
    country: "Nepal",
    streetAddress: "",
    apartment: "",
    city: "",
    postalCode: "",
    phone: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery")
  const [formValidated, setFormValidated] = useState(false)
  const [paymentError, setPaymentError] = useState("")

  // Payment settings from localStorage
  const [paymentSettings, setPaymentSettings] = useState({
    enablePaypal: true,
    enableKhalti: true,
    enableCashOnDelivery: true,
    minimumOrderAmount: 10,
    freeShippingThreshold: 100,
  })

  // Load payment settings from localStorage
  useEffect(() => {
    const savedPaymentSettings = localStorage.getItem("payment_settings")
    if (savedPaymentSettings) {
      setPaymentSettings(JSON.parse(savedPaymentSettings))
    }
  }, [])

  // Calculate shipping cost based on settings
  const shippingCost = cartTotal >= paymentSettings.freeShippingThreshold ? 0 : 10

  // Calculate final total
  const finalTotal = cartTotal + shippingCost - discount

  useEffect(() => {
    // Redirect to cart if cart is empty
    if (cart.length === 0 && !orderComplete) {
      navigate("/cart")
    }

    // Redirect to login if not logged in
    if (!currentUser && !orderComplete) {
      navigate("/login?redirect=checkout")
    }

    // Set default payment method based on available options
    if (!paymentSettings.enableCashOnDelivery && paymentMethod === "cash_on_delivery") {
      if (paymentSettings.enablePaypal) {
        setPaymentMethod("paypal")
      } else if (paymentSettings.enableKhalti) {
        setPaymentMethod("khalti")
      }
    }
  }, [cart, currentUser, navigate, orderComplete, paymentSettings, paymentMethod])

  // Check if order meets minimum amount
  useEffect(() => {
    if (cartTotal < paymentSettings.minimumOrderAmount) {
      setPaymentError(
        `Minimum order amount is $${paymentSettings.minimumOrderAmount}. Please add more items to your cart.`,
      )
    } else {
      setPaymentError("")
    }
  }, [cartTotal, paymentSettings.minimumOrderAmount])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Validate form before submission
  const validateForm = () => {
    const requiredFields = ["firstName", "lastName", "email", "streetAddress", "city", "postalCode", "phone"]
    const isValid = requiredFields.every((field) => formData[field] && formData[field].trim() !== "")
    setFormValidated(isValid)
    return isValid
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()

    // Check minimum order amount
    if (cartTotal < paymentSettings.minimumOrderAmount) {
      setPaymentError(
        `Minimum order amount is $${paymentSettings.minimumOrderAmount}. Please add more items to your cart.`,
      )
      return
    }

    // Validate form first
    if (!validateForm()) {
      alert("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      // Create order in database
      const orderData = {
        items: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          streetAddress: formData.streetAddress,
          apartment: formData.apartment,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
        },
        totalAmount: finalTotal,
        discount: discount,
        couponCode: couponCode,
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === "cash_on_delivery" ? "pending" : "completed",
      }

      // Make API call to create order
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      // Generate order ID from response or create a random one
      const newOrderId = response.data._id || "ORD-" + Math.floor(Math.random() * 1000000)
      setOrderId(newOrderId)

      // Clear cart and set order complete
      clearCart()
      setOrderComplete(true)
    } catch (error) {
      console.error("Error creating order:", error)
      alert("There was an error processing your order. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // PayPal transaction handlers
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: finalTotal.toFixed(2),
            currency_code: "USD",
          },
          description: "Purchase from MarvelPopExpress",
        },
      ],
    })
  }

  const onApprove = async (data, actions) => {
    return actions.order.capture().then((details) => {
      // Handle successful payment
      console.log("Payment completed successfully", details)

      // Submit the form to create the order
      handleSubmit()
    })
  }

  // Handle Khalti payment
  const handleKhaltiPayment = () => {
    // Validate form first
    if (!validateForm()) {
      alert("Please fill in all required fields")
      return
    }

    if (window.KhaltiCheckout) {
      const config = {
        // Updated public key - this is the correct test key format
        publicKey: "test_public_key_dc74e0fd57cb46cd93832aee0a390234",
        productIdentity: "1234567890",
        productName: "Marvel Pop Express Order",
        productUrl: window.location.origin,
        amount: finalTotal * 100, // amount in paisa (100 paisa = 1 NPR)
        eventHandler: {
          onSuccess(payload) {
            // Handle successful payment
            console.log("Khalti payment successful:", payload)
            handleSubmit()
          },
          onError(error) {
            console.log("Khalti payment error:", error)
            alert("Payment failed. Please try again.")
            setIsSubmitting(false)
          },
          onClose() {
            console.log("Khalti widget closed")
            setIsSubmitting(false)
          },
        },
      }

      const checkout = new window.KhaltiCheckout(config)
      checkout.show({ amount: finalTotal * 100 })
    } else {
      alert("Payment gateway is loading. Please try again in a moment.")
    }
  }

  // Handle Cash on Delivery
  const handleCashOnDelivery = () => {
    handleSubmit()
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-34">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheck className="text-green-600 text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been received.</p>
            <p className="text-gray-800 font-medium mb-8">Order ID: {orderId}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/orders"
                className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
              >
                View Order Status
              </Link>
              <Link
                to="/products"
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors"
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
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/cart" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800">
            <FiArrowLeft size={16} />
            <span>Back to Cart</span>
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {paymentError && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{paymentError}</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (paymentMethod === "cash_on_delivery") {
                    handleCashOnDelivery()
                  } else if (paymentMethod === "khalti") {
                    handleKhaltiPayment()
                  }
                  // PayPal is handled by its own component
                }}
              >
                {/* Customer Information */}
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Customer Information</h2>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone (Required for delivery)
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Billing Address */}
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Billing Address</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      >
                        <option value="Nepal">Nepal</option>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        id="streetAddress"
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-1">
                        Apartment, Suite, etc. (Optional)
                      </label>
                      <input
                        type="text"
                        id="apartment"
                        name="apartment"
                        value={formData.apartment}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Postal / ZIP Code
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Payment Method</h2>

                  <div className="space-y-4">
                    {/* Khalti Payment Option */}
                    {paymentSettings.enableKhalti && (
                      <div className="flex items-center">
                        <input
                          id="khalti"
                          name="paymentMethod"
                          type="radio"
                          value="khalti"
                          checked={paymentMethod === "khalti"}
                          onChange={() => setPaymentMethod("khalti")}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <label htmlFor="khalti" className="ml-3 block text-sm font-medium text-gray-700">
                          Khalti Digital Wallet
                        </label>
                        <img
                          src="/placeholder.svg?height=30&width=80&text=Khalti"
                          alt="Khalti"
                          className="h-8 ml-auto"
                        />
                      </div>
                    )}

                    {/* PayPal Payment Option */}
                    {paymentSettings.enablePaypal && (
                      <div className="flex items-center">
                        <input
                          id="paypal"
                          name="paymentMethod"
                          type="radio"
                          value="paypal"
                          checked={paymentMethod === "paypal"}
                          onChange={() => setPaymentMethod("paypal")}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700">
                          PayPal
                        </label>
                        <img
                          src="/placeholder.svg?height=30&width=80&text=PayPal"
                          alt="PayPal"
                          className="h-8 ml-auto"
                        />
                      </div>
                    )}

                    {/* Cash on Delivery Option */}
                    {paymentSettings.enableCashOnDelivery && (
                      <div className="flex items-center">
                        <input
                          id="cash_on_delivery"
                          name="paymentMethod"
                          type="radio"
                          value="cash_on_delivery"
                          checked={paymentMethod === "cash_on_delivery"}
                          onChange={() => setPaymentMethod("cash_on_delivery")}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                        />
                        <label htmlFor="cash_on_delivery" className="ml-3 block text-sm font-medium text-gray-700">
                          Cash on Delivery
                        </label>
                        <div className="ml-auto">
                          <FiTruck className="h-8 w-8 text-gray-500" />
                        </div>
                      </div>
                    )}

                    {/* No payment methods available */}
                    {!paymentSettings.enableKhalti &&
                      !paymentSettings.enablePaypal &&
                      !paymentSettings.enableCashOnDelivery && (
                        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-md">
                          No payment methods are currently available. Please contact support.
                        </div>
                      )}

                    {/* Payment Buttons */}
                    <div className="mt-6">
                      {paymentMethod === "khalti" && (
                        <button
                          type="submit"
                          className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                          disabled={isSubmitting || cartTotal < paymentSettings.minimumOrderAmount}
                        >
                          <FiCreditCard size={18} />
                          <span>{isSubmitting ? "Processing..." : "Pay with Khalti"}</span>
                        </button>
                      )}

                      {paymentMethod === "paypal" && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-md">
                          <PayPalScriptProvider
                            options={{
                              "client-id": "sb", // Use sandbox client ID
                              currency: "USD",
                              components: "buttons",
                            }}
                          >
                            <PayPalButtons
                              style={{ layout: "horizontal" }}
                              createOrder={createOrder}
                              onApprove={onApprove}
                              disabled={
                                isSubmitting || !formValidated || cartTotal < paymentSettings.minimumOrderAmount
                              }
                              onClick={() => validateForm()}
                            />
                          </PayPalScriptProvider>
                        </div>
                      )}

                      {paymentMethod === "cash_on_delivery" && (
                        <button
                          type="submit"
                          className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                          disabled={isSubmitting || cartTotal < paymentSettings.minimumOrderAmount}
                        >
                          <FiDollarSign size={18} />
                          <span>{isSubmitting ? "Processing..." : "Place Order (Cash on Delivery)"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-4">
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

                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <p className="font-medium text-gray-900">Total</p>
                  <p className="text-xl font-bold text-indigo-600">${finalTotal.toFixed(2)}</p>
                </div>
              </div>

              {/* Free shipping threshold message */}
              {cartTotal < paymentSettings.freeShippingThreshold && (
                <div className="mt-4 bg-blue-50 text-blue-700 p-3 rounded-md text-sm">
                  Add ${(paymentSettings.freeShippingThreshold - cartTotal).toFixed(2)} more to qualify for free
                  shipping!
                </div>
              )}

              {/* Secure Checkout Message */}
              <div className="mt-6 flex items-center justify-center gap-1 text-sm text-gray-500">
                <FiLock className="w-4 h-4" />
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
