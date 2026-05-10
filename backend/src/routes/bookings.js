// bookings routes — src/routes/bookings.js
const router = require('express').Router();
const ctrl   = require('../controllers/bookings');
const { protect, adminOnly } = require('../middleware/auth');

// User routes (must be logged in)
router.get('/',              protect, ctrl.getMyBookings);  // my bookings
router.get('/all',           protect, adminOnly, ctrl.getAll);        // all bookings
router.get('/:id',           protect, ctrl.getOne);          // single booking
router.post('/',             protect, ctrl.create);           // create booking
router.patch('/:id/cancel',  protect, ctrl.cancel);          // cancel booking

// Admin routes

router.patch('/:id/status',  protect, adminOnly, ctrl.updateStatus);  // confirm/complete

module.exports = router;
