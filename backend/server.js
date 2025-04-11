const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const http = require('http');
const https = require('https');
const connectDB = require('./config/dbConfig');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const frontend = process.env.frontend;

// Middleware
app.use(cors({
  origin: `${frontend}`,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database
connectDB();

// Routes
const productRoutes = require('./routes/products.js');
const authRoutes = require('./routes/auth');
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use(errorHandler);

// SSL Options
const sslOptions = {
  key: fs.readFileSync('/etc/ssl/private/ec2-ssl.key'),
  cert: fs.readFileSync('/etc/ssl/certs/ec2-ssl.crt'),
};

// HTTPS server
const httpsServer = https.createServer(sslOptions, app);
httpsServer.listen(443, () => {
  console.log('HTTPS Server running on port 443');
});

// Optional: Redirect HTTP → HTTPS
const httpApp = express();
httpApp.use((req, res) => {
  res.redirect(`https://${req.headers.host}${req.url}`);
});
http.createServer(httpApp).listen(80, () => {
  console.log('HTTP to HTTPS redirect server on port 80');
});