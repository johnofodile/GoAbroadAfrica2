const Booking = require('../models/Booking');

// GET /api/bookings — get all bookings for the logged-in user
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('consultantId', 'name email avatar')
      .populate('paymentId')
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (err) { next(err); }
};

// GET /api/bookings/all — admin: get every booking
exports.getAll = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('userId', 'name email')
        .populate('consultantId', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Booking.countDocuments(filter),
    ]);

    res.json({ bookings, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

// GET /api/bookings/:id — get single booking
exports.getOne = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('consultantId', 'name email avatar')
      .populate('paymentId');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Only the booking owner or admin can view it
    if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed' });
    }

    res.json({ booking });
  } catch (err) { next(err); }
};

// POST /api/bookings — create a new booking
exports.create = async (req, res, next) => {
  try {
    const { consultantId, date, timeSlot, topic, notes, price, currency } = req.body;

    const booking = await Booking.create({
      userId: req.user._id,
      consultantId,
      date,
      timeSlot,
      topic,
      notes,
      price:    price    || 0,
      currency: currency || 'usd',
    });

    res.status(201).json({ booking });
  } catch (err) { next(err); }
};

// PATCH /api/bookings/:id/status — admin updates booking status
exports.updateStatus = async (req, res, next) => {
  try {
    const { status, meetingLink } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, ...(meetingLink && { meetingLink }) },
      { new: true, runValidators: true }
    );

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    res.json({ booking });
  } catch (err) { next(err); }
};

// DELETE /api/bookings/:id — user cancels their own booking
exports.cancel = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Only the owner or admin can cancel
    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled', booking });
  } catch (err) { next(err); }
};