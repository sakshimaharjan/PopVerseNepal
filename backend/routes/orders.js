const express = require("express")
const router = express.Router()
const Order = require("../models/Order")
const { protect, admin } = require("../middleware/authMiddleware")

// Create a new order
router.post("/", protect, async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount, paymentMethod, paymentStatus, paymentDetails } = req.body

    const newOrder = new Order({
      user: req.user.id,
      items,
      shippingAddress,
      totalAmount,
      paymentMethod,
      paymentStatus,
      paymentDetails,
    })

    const savedOrder = await newOrder.save()
    res.status(201).json(savedOrder)
  } catch (error) {
    console.error("Error creating order:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all orders for a user
router.get("/user", async (req, res) => { // add protect here
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 }).populate("items.product")

    res.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Admin: Get all orders
router.get("/admin", async (req, res) => { // add admin, protect here
  try {
    console.log("Admin requesting all orders")
    const orders = await Order.find({}).sort({ createdAt: -1 }).populate("user", "name email").populate("items.product")

    console.log(`Found ${orders.length} orders for admin`)
    res.json(orders)
  } catch (error) {
    console.error("Error fetching admin orders:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get a specific order by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product")

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Check if the order belongs to the authenticated user or if user is admin
    if (order.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to access this order" })
    }

    res.json(order)
  } catch (error) {
    console.error("Error fetching order:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Admin: Update order status
router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const { status } = req.body

    if (!["processing", "shipped", "delivered", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    order.orderStatus = status

    // If order is delivered, update payment status for cash on delivery orders
    if (status === "delivered" && order.paymentMethod === "cash_on_delivery") {
      order.paymentStatus = "completed"
    }

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } catch (error) {
    console.error("Error updating order status:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
