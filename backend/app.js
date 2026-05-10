const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');
require('dotenv').config();
 
// Import all route files
const authRoutes       = require('./src/routes/auth');
const userRoutes       = require('./src/routes/users');
const programRoutes    = require('./src/routes/programs');
const experienceRoutes = require('./src/routes/experiences');
const bookingRoutes    = require('./src/routes/bookings');
const paymentRoutes    = require('./src/routes/payments');
const adminRoutes      = require('./src/routes/admin');
 
const app = express();
 
// === SECURITY MIDDLEWARE ===
app.use(helmet()); // Adds security headers
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
 
// === RATE LIMITING: max 100 requests per 15 minutes per IP ===
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, try again later' },
});
app.use('/api', limiter);
 
// === LOGGING ===
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Logs every request in dev mode
}
 
// === BODY PARSING ===
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
 
// === ROUTES ===
app.use('/api/auth',        authRoutes);
app.use('/api/users',       userRoutes);
app.use('/api/programs',    programRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/bookings',    bookingRoutes);
app.use('/api/payments',    paymentRoutes);
app.use('/api/admin',       adminRoutes);
 
// === HEALTH CHECK ===
app.get('/health', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV });
});
 
// === GLOBAL ERROR HANDLER ===
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

module.exports = app;