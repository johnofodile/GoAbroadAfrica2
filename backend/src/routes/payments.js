const router = require('express').Router();
const ctrl   = require('../controllers/payments');
const { protect, adminOnly } = require('../middleware/auth');

// User routes (must be logged in)
router.get('/my',   protect, ctrl.getMyPayments);  // my payment history
router.get('/:id',  protect, ctrl.getOne);          // single payment
router.post('/',    protect, ctrl.create);           // create payment record

// Admin routes
router.get('/all',          protect, adminOnly, ctrl.getAll);         // all payments
router.patch('/:id/status', protect, adminOnly, ctrl.updateStatus);   // update status

module.exports = router;