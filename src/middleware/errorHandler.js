const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error('🔥 Error:', err);

  // Knex/Database errors
  if (err.code) {
    switch (err.code) {
      case 'ELOGIN':
        error.message = 'Database authentication failed';
        error.statusCode = 500;
        break;
      case 'ETIMEOUT':
        error.message = 'Database connection timeout';
        error.statusCode = 500;
        break;
      case 'EREQUEST':
        error.message = 'Database request error';
        error.statusCode = 400;
        break;
      default:
        error.message = 'Database error occurred';
        error.statusCode = 500;
    }
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(error => error.message).join(', ');
    error.message = `Validation Error: ${message}`;
    error.statusCode = 400;
  }

  // Duplicate key error
  if (err.code === 2627) {
    error.message = 'Duplicate resource found';
    error.statusCode = 409;
  }

  // Not found error
  if (err.message === 'Not Found') {
    error.statusCode = 404;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    error.statusCode = 401;
  }

  // Default error
  if (!error.statusCode) {
    error.statusCode = 500;
    error.message = 'Internal server error';
  }

  // Send error response
  res.status(error.statusCode).json({
    success: false,
    error: {
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { 
        stack: err.stack,
        details: err 
      })
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  });
};

module.exports = errorHandler; 