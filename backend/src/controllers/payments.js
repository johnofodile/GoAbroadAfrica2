const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// GET /api/payments/my — get logged-in user's payment history
exports.getMyPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ payments });
  } catch (err) { next(err); }
};

// GET /api/payments/all — admin: get all payments
exports.getAll = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const [payments, total] = await Promise.all([
      Payment.find(filter)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Payment.countDocuments(filter),
    ]);

    res.json({ payments, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

// GET /api/payments/:id — get single payment
exports.getOne = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('userId', 'name email');

    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    // Only the payment owner or admin can view it
    if (payment.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed' });
    }

    res.json({ payment });
  } catch (err) { next(err); }
};

// POST /api/payments/create — create a payment record and link it to a booking
exports.create = async (req, res, next) => {
  try {
    const { bookingId, amount, currency, type, stripeSessionId } = req.body;

    const payment = await Payment.create({
      userId:          req.user._id,
      amount,
      currency:        currency || 'usd',
      type:            type     || 'booking',
      referenceId:     bookingId,
      stripeSessionId: stripeSessionId || null,
      status:          'pending',
    });

    // Link the payment back to the booking
    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, { paymentId: payment._id });
    }

    res.status(201).json({ payment });
  } catch (err) { next(err); }
};

// PATCH /api/payments/:id/status — admin or Stripe webhook updates payment status
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    // If payment is now confirmed as paid, confirm the linked booking too
    if (status === 'paid' && payment.referenceId) {
      await Booking.findByIdAndUpdate(payment.referenceId, { status: 'confirmed' });
    }

    res.json({ payment });
  } catch (err) { next(err); }
};