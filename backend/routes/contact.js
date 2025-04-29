const express = require("express")
const router = express.Router()
const Contact = require("../models/Contact")
const { protect, admin } = require("../middleware/authMiddleware")

// Submit a contact form
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body

    const newContact = new Contact({
      name,
      email,
      subject,
      message,
    })

    const savedContact = await newContact.save()
    res.status(201).json({ success: true, message: "Your message has been sent successfully!" })
  } catch (error) {
    console.error("Error submitting contact form:", error)
    res.status(500).json({ success: false, message: "Failed to send message. Please try again." })
  }
})

// Admin: Get all contact messages
router.get("/admin", protect, async (req, res) => { //admin here
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })
    res.json(contacts)
    console.log("Fetched contact messages:", contacts)
  } catch (error) {
    console.error("Error fetching contact messages:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Admin: Update contact status
router.put("/:id/status", protect, async (req, res) => {  //admin here
  try {
    const { status } = req.body

    if (!["new", "read", "responded"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const contact = await Contact.findById(req.params.id)

    if (!contact) {
      return res.status(404).json({ message: "Contact message not found" })
    }

    contact.status = status
    const updatedContact = await contact.save()

    res.json(updatedContact)
  } catch (error) {
    console.error("Error updating contact status:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
