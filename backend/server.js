const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const connectDB = require("./config/dbConfig") // DB connection config
const errorHandler = require("./middleware/errorHandler") // Error handler middleware

dotenv.config()

const app = express()

// Middleware
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.BACKEND_URL], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["*"],
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Database connection
connectDB()

// Routes
const productRoutes = require("./routes/products.js")
const authRoutes = require("./routes/auth")
const orderRoutes = require("./routes/orders")
const contactRoutes = require("./routes/contact")
const recommendationRoutes = require("./routes/recommendationRoutes")



app.use("/api/products", productRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/contact", contactRoutes)
app.use("/api", recommendationRoutes)

// Error handling middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))