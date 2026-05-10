// admin routes — src/routes/admin.js
const router = require('express').Router();
const ctrl   = require('../controllers/admin');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require login AND admin role
router.use(protect, adminOnly);

// Dashboard stats
router.get('/stats', ctrl.getStats);

// User management
router.get('/users',              ctrl.getUsers);
router.patch('/users/:id/role',   ctrl.updateUserRole);
router.delete('/users/:id',       ctrl.deleteUser);

// Experience moderation
router.get('/experiences',                    ctrl.getExperiences);
router.patch('/experiences/:id/status',       ctrl.updateExperienceStatus);

// Booking oversight
router.get('/bookings', ctrl.getBookings);

module.exports = router;
