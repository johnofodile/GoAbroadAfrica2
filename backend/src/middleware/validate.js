// validate.js — checks required fields before the request reaches the controller
const { body, validationResult } = require('express-validator');

// Reusable helper — call this at the top of any route handler
// It reads the result of whichever validators ran before it
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// ── Auth validators ───────────────────────────────────────────────────────────

exports.validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required'),
  body('email')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  exports.handleValidationErrors,
];

exports.validateLogin = [
  body('email')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  exports.handleValidationErrors,
];

// ── Experience validators ─────────────────────────────────────────────────────

exports.validateExperience = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title must be under 200 characters'),
  body('country')
    .trim()
    .notEmpty().withMessage('Country is required'),
  body('content')
    .trim()
    .notEmpty().withMessage('Content is required')
    .isLength({ min: 50 }).withMessage('Content must be at least 50 characters'),
  exports.handleValidationErrors,
];

// ── Booking validators ────────────────────────────────────────────────────────

exports.validateBooking = [
  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Date must be a valid date'),
  body('timeSlot')
    .notEmpty().withMessage('Time slot is required'),
  exports.handleValidationErrors,
];

// ── Program validators ────────────────────────────────────────────────────────

exports.validateProgram = [
  body('country')
    .trim()
    .notEmpty().withMessage('Country is required'),
  body('university')
    .trim()
    .notEmpty().withMessage('University is required'),
  body('program')
    .trim()
    .notEmpty().withMessage('Program name is required'),
  exports.handleValidationErrors,
];