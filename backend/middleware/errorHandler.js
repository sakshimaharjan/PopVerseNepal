const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    if (err.name === 'ValidationError') {
      // Handling Mongoose validation errors
      return res.status(400).json({ error: 'Validation error', message: err.message });
    }
  
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      // Handling invalid MongoDB ObjectId format
      return res.status(400).json({ error: 'Invalid product ID format' });
    }
  
    if (err.code === 11000) {
      // Handling MongoDB duplicate key errors (for unique fields)
      return res.status(400).json({ error: 'Duplicate key error', message: 'Product with this name or ID already exists.' });
    }
  
    if (err.message && err.message.includes('Cloudinary')) {
      // Handling Cloudinary errors (if Cloudinary throws an error)
      return res.status(500).json({ error: 'Cloudinary upload failed', message: err.message });
    }
  
    // Default error response for unhandled errors
    const statusCode = err.status || 500;
    const errorMessage = err.message || 'Internal Server Error';
  
    res.status(statusCode).json({ error: errorMessage });
  };
  
  module.exports = errorHandler;