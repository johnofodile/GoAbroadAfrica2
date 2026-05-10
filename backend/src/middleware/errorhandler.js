// errorHandler.js — global error handler registered last in app.js
// Any controller that calls next(err) lands here

const errorHandler = (err, req, res, next) => {

  // Log the error in development so you can see the full stack
  if (process.env.NODE_ENV !== 'production') {
    console.error('[ERROR]', err);
  }

  // Default to 500 unless the error already has a status code
  let statusCode = err.statusCode || err.status || 500;
  let message    = err.message    || 'Something went wrong';

  // Mongoose: bad ObjectId — e.g. /api/programs/not-a-valid-id
  if (err.name === 'CastError') {
    statusCode = 404;
    message    = `Resource not found`;
  }

  // Mongoose: duplicate unique field — e.g. email already registered
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message    = `${field} already exists`;
  }

  // Mongoose: validation failed — e.g. required field missing
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message    = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');
  }

  // JWT: token is invalid or tampered
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message    = 'Invalid token — please log in again';
  }

  // JWT: token has expired
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message    = 'Token expired — please log in again';
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Only show the stack trace in development — never in production
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = errorHandler;