import { createContext, useState, useContext, useEffect } from "react"

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [discount, setDiscount] = useState(0)
  const [couponCode, setCouponCode] = useState("")

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    const savedDiscount = localStorage.getItem("discount")
    const savedCouponCode = localStorage.getItem("couponCode")

    if (savedCart) setCart(JSON.parse(savedCart))
    if (savedDiscount) setDiscount(Number.parseFloat(savedDiscount))
    if (savedCouponCode) setCouponCode(savedCouponCode)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  // Save discount and coupon code to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("discount", discount.toString())
    localStorage.setItem("couponCode", couponCode)
  }, [discount, couponCode])

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id)

      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      } else {
        return [...prevCart, { ...product, quantity }]
      }
    })
  }

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId)
      return
    }

    setCart((prevCart) => prevCart.map((item) => (item._id === productId ? { ...item, quantity } : item)))
  }

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId))
  }

  // Clear cart
  const clearCart = () => {
    setCart([])
    setDiscount(0)
    setCouponCode("")
  }

  // Apply coupon code
  const applyCoupon = (code) => {
    // Validate coupon code
    if (code.toLowerCase() === "marvel10") {
      // Apply 10% discount
      const discountAmount = cartTotal * 0.1
      setDiscount(discountAmount)
      setCouponCode(code)
      return true
    }

    // Invalid coupon code
    setDiscount(0)
    setCouponCode("")
    return false
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        cartTotal,
        discount,
        couponCode,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
