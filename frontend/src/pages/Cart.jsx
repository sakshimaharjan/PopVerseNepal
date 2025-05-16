import { useState } from "react"
import { Link } from "react-router-dom"
import { FiTrash2, FiPlus, FiMinus, FiCreditCard } from "react-icons/fi"
import { useCart } from "../components/CartContext"

const Cart = () => {
  const { cart, cartTotal, discount, couponCode, updateQuantity, removeFromCart, clearCart, applyCoupon } = useCart()
  const [couponInput, setCouponInput] = useState("")
  const [couponError, setCouponError] = useState("")

  const shippingCost = cartTotal > 100 ? 0 : 10
  const total = cartTotal - discount + shippingCost

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) {
      setCouponError("Please enter a coupon code")
      return
    }
    
    const success = applyCoupon(couponInput)
    if (success) {
      setCouponError("")
    } else {
      setCouponError("Invalid coupon code. Try MARVEL10 or POPVERSE2025")
    }
  }

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="flex flex-col md:flex-row shadow-md my-10">
        <div className="w-full md:w-3/4 bg-white px-4 md:px-10 py-10">
          <div className="flex justify-between border-b pb-8">
            <h1 className="font-semibold text-2xl">Shopping Cart</h1>
            <h2 className="font-semibold text-2xl">{cart.length} Items</h2>
          </div>
          <div className="flex mt-10 mb-5 md:flex">
            <h3 className="font-semibold text-gray-600 text-xs uppercase w-2/5">Product Details</h3>
            <h3 className="font-semibold text-gray-600 text-xs uppercase w-1/5 text-center">Quantity</h3>
            <h3 className="font-semibold text-gray-600 text-xs uppercase w-1/5 text-center">Price</h3>
            <h3 className="font-semibold text-gray-600 text-xs uppercase w-1/5 text-center">Total</h3>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Your cart is empty.</p>
              <Link to="/products" className="text-indigo-600 hover:text-indigo-800 mt-4 inline-block">
                Continue Shopping
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item._id} className="flex flex-col md:flex-row items-center hover:bg-gray-100 -mx-8 px-6 py-5 border-b">
                <div className="flex w-full md:w-2/5">
                  <div className="w-20">
                    <img src={item.image || "/placeholder.svg"} alt={item.name} className="h-24 object-contain" />
                  </div>
                  <div className="flex flex-col justify-between ml-4 flex-grow">
                    <span className="font-bold text-sm">{item.name}</span>
                    {item.brand && <span className="text-red-500 text-xs">{item.brand}</span>}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="inline-flex items-center gap-2 text-red-600 hover:text-red-800 cursor-pointer text-xs"
                    >
                      <FiTrash2 size={16} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
                <div className="flex justify-center w-full md:w-1/5 my-4 md:my-0">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="cursor-pointer"
                  >
                    <FiMinus size={16} />
                  </button>

                  <input className="mx-2 border text-center w-8" type="text" value={item.quantity} readOnly />

                  <button 
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="cursor-pointer"
                  >
                    <FiPlus size={16} />
                  </button>
                </div>
                <span className="text-center w-full md:w-1/5 font-semibold text-sm">${item.price.toFixed(2)}</span>
                <span className="text-center w-full md:w-1/5 font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))
          )}

          <Link to="/products" className="flex font-semibold text-indigo-600 text-sm mt-10">
            <svg className="fill-current mr-2 text-indigo-600 w-4" viewBox="0 0 448 512">
              <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
            </svg>
            Continue Shopping
          </Link>
        </div>

        <div id="summary" className="w-full md:w-1/4 px-8 py-10 bg-gray-50">
          <h1 className="font-semibold text-2xl border-b pb-8">Order Summary</h1>
          <div className="flex justify-between mt-10 mb-5">
            <span className="font-semibold text-sm uppercase">Items {cart.length}</span>
            <span className="font-semibold text-sm">${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-5">
            <span className="font-semibold text-sm uppercase">Shipping</span>
            <span className="font-semibold text-sm">
              {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
            </span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between mb-5 text-green-600">
              <span className="font-semibold text-sm uppercase">Discount {couponCode && `(${couponCode})`}</span>
              <span className="font-semibold text-sm">-${discount.toFixed(2)}</span>
            </div>
          )}
          
          <div className="py-5">
            <label htmlFor="coupon" className="font-semibold inline-block mb-3 text-sm uppercase">
              Coupon Code
            </label>
            <div className="flex">
              <input
                type="text"
                id="coupon"
                placeholder="Enter your coupon code"
                className="p-2 text-sm w-full border"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
              />
              <button
                onClick={handleApplyCoupon}
                className="bg-gray-200 text-gray-700 px-4 py-2 hover:bg-gray-300 transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>
            {couponError && <div className="text-red-500 text-xs mt-1">{couponError}</div>}
            {discount > 0 && <div className="text-green-500 text-xs mt-1">Coupon applied successfully!</div>}
          </div>
          
          <div className="border-t mt-8">
            <div className="flex font-semibold justify-between py-6 text-sm uppercase">
              <span>Total cost</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <FiCreditCard size={18} />
              <span>Proceed to Checkout</span>
            </Link>
          </div>
          
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="w-full mt-4 text-red-600 hover:text-red-800 flex items-center justify-center gap-2 cursor-pointer"
            >
              <FiTrash2 size={16} />
              <span>Clear Cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Cart
