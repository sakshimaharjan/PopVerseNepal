const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/dbConfig'); // DB connection config
const errorHandler = require('./middleware/errorHandler'); // Error handler middleware

dotenv.config();

const app = express();

const frontend = process.env.frontend

// Middleware
app.use(cors({
  origin: `${frontend}`,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
connectDB();

// Routes
const productRoutes = require('./routes/products.js');
const authRoutes = require('./routes/auth');

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
