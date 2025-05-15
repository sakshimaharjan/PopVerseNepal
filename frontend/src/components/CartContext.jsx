import { createContext, useState, useEffect, useContext } from "react"
import { useAuth } from "./AuthContext"

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [cartTotal, setCartTotal] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [couponCode, setCouponCode] = useState("")
  const { currentUser } = useAuth()

  // Load cart from localStorage on initial render and when user changes
  useEffect(() => {
    const loadCart = () => {
      if (currentUser) {
        // If user is logged in, load their specific cart
        const userCartKey = `cart_${currentUser._id}`
        const savedCart = localStorage.getItem(userCartKey)
        if (savedCart) {
          setCart(JSON.parse(savedCart))
        } else {
          // If no cart exists for this user, start with empty cart
          setCart([])
        }

        // Load discount info
        const userDiscountKey = `discount_${currentUser._id}`
        const savedDiscount = localStorage.getItem(userDiscountKey)
        if (savedDiscount) {
          const discountData = JSON.parse(savedDiscount)
          setDiscount(discountData.amount)
          setCouponCode(discountData.code)
        }
      } else {
        // For non-logged in users, use a guest cart
        const guestCart = localStorage.getItem("guest_cart")
        if (guestCart) {
          setCart(JSON.parse(guestCart))
        } else {
          setCart([])
        }

        // Load guest discount info
        const guestDiscount = localStorage.getItem("guest_discount")
        if (guestDiscount) {
          const discountData = JSON.parse(guestDiscount)
          setDiscount(discountData.amount)
          setCouponCode(discountData.code)
        }
      }
    }

    loadCart()
  }, [currentUser]) // Re-run when user changes

  // Update localStorage and calculate total whenever cart changes
  useEffect(() => {
    if (cart.length > 0) {
      // Save cart to the appropriate storage key based on user status
      if (currentUser) {
        localStorage.setItem(`cart_${currentUser._id}`, JSON.stringify(cart))
      } else {
        localStorage.setItem("guest_cart", JSON.stringify(cart))
      }

      // Calculate total
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
      setCartTotal(total)

      // Dispatch custom event for components like Navbar to update
      window.dispatchEvent(new Event("cartUpdated"))
    } else {
      // If cart is empty, remove the storage item
      if (currentUser) {
        localStorage.removeItem(`cart_${currentUser._id}`)
      } else {
        localStorage.removeItem("guest_cart")
      }
      setCartTotal(0)
      window.dispatchEvent(new Event("cartUpdated"))
    }
  }, [cart, currentUser])

  // Save discount info whenever it changes
  useEffect(() => {
    if (discount > 0) {
      const discountData = { amount: discount, code: couponCode }
      if (currentUser) {
        localStorage.setItem(`discount_${currentUser._id}`, JSON.stringify(discountData))
      } else {
        localStorage.setItem("guest_discount", JSON.stringify(discountData))
      }
    } else {
      if (currentUser) {
        localStorage.removeItem(`discount_${currentUser._id}`)
      } else {
        localStorage.removeItem("guest_discount")
      }
    }
  }, [discount, couponCode, currentUser])

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      // Check if product already exists in cart
      const existingItemIndex = prevCart.findIndex((item) => item._id === product._id)

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex].quantity += quantity
        return updatedCart
      } else {
        // Add new item to cart
        return [...prevCart, { ...product, quantity }]
      }
    })
  }

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId))
  }

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart((prevCart) => prevCart.map((item) => (item._id === productId ? { ...item, quantity } : item)))
  }

  // Clear cart
  const clearCart = () => {
    setCart([])
    setDiscount(0)
    setCouponCode("")
  }

  // Apply coupon
  const applyCoupon = (code) => {
    if (code.toLowerCase() === "marvel10" || code.toLowerCase() === "popverse2025") {
      const discountAmount = cartTotal * 0.1
      setDiscount(discountAmount)
      setCouponCode(code)
      return true
    }
    return false
  }

  // Remove coupon
  const removeCoupon = () => {
    setDiscount(0)
    setCouponCode("")
  }

  // Transfer guest cart to user cart when logging in
  const mergeGuestCart = () => {
    const guestCart = localStorage.getItem("guest_cart")
    if (guestCart && currentUser) {
      const parsedGuestCart = JSON.parse(guestCart)
      if (parsedGuestCart.length > 0) {
        // Merge with existing user cart if any
        const userCartKey = `cart_${currentUser._id}`
        const userCart = localStorage.getItem(userCartKey)

        if (userCart) {
          const parsedUserCart = JSON.parse(userCart)

          // Combine carts, handling duplicates by adding quantities
          const mergedCart = [...parsedUserCart]

          parsedGuestCart.forEach((guestItem) => {
            const existingItemIndex = mergedCart.findIndex((item) => item._id === guestItem._id)

            if (existingItemIndex >= 0) {
              // Item exists in user cart, add quantities
              mergedCart[existingItemIndex].quantity += guestItem.quantity
            } else {
              // Item doesn't exist in user cart, add it
              mergedCart.push(guestItem)
            }
          })

          setCart(mergedCart)
        } else {
          // No existing user cart, just use guest cart
          setCart(parsedGuestCart)
        }

        // Transfer discount info if any
        const guestDiscount = localStorage.getItem("guest_discount")
        if (guestDiscount) {
          const discountData = JSON.parse(guestDiscount)
          setDiscount(discountData.amount)
          setCouponCode(discountData.code)
          localStorage.removeItem("guest_discount")
        }

        // Clear guest cart after merging
        localStorage.removeItem("guest_cart")
      }
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        cartTotal,
        discount,
        couponCode,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        mergeGuestCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
