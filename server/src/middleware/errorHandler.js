const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error('Error:', err);

  if (err.code === '23503') {
    error.message = 'Resource not found';
    error.statusCode = 404;
  }

  if (err.code === '23505') {
    error.message = 'Duplicate resource';
    error.statusCode = 409;
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(error => error.message).join(', ');
    error.message = message;
    error.statusCode = 400;
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err 
    })
  });
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  asyncHandler
};