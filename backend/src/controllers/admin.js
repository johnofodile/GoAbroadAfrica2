const User       = require('../models/User');
const Experience = require('../models/Experience');
const Booking    = require('../models/Booking');
const Payment    = require('../models/Payment');

// GET /api/admin/stats
exports.getStats = async (req, res, next) => {
  try {
    const [users, experiences, bookings, payments] = await Promise.all([
      User.countDocuments(),
      Experience.countDocuments(),
      Booking.countDocuments(),
      Payment.countDocuments(),
    ]);
    res.json({ users, experiences, bookings, payments });
  } catch (err) { next(err); }
};

// GET /api/admin/users
exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const [users, total] = await Promise.all([
      User.find().select('-password').sort({ createdAt: -1 })
        .skip((page - 1) * limit).limit(Number(limit)),
      User.countDocuments(),
    ]);
    res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

// PATCH /api/admin/users/:id/role
exports.updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, { role: req.body.role }, { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) { next(err); }
};

// DELETE /api/admin/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) { next(err); }
};

// GET /api/admin/experiences
exports.getExperiences = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const [experiences, total] = await Promise.all([
      Experience.find(filter)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit).limit(Number(limit)),
      Experience.countDocuments(filter),
    ]);
    res.json({ experiences, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

// PATCH /api/admin/experiences/:id/status
exports.updateExperienceStatus = async (req, res, next) => {
  try {
    const exp = await Experience.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true }
    );
    if (!exp) return res.status(404).json({ message: 'Not found' });
    res.json({ experience: exp });
  } catch (err) { next(err); }
};

// GET /api/admin/bookings
exports.getBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate('userId', 'name email')
        .populate('consultantId', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit).limit(Number(limit)),
      Booking.countDocuments(filter),
    ]);
    res.json({ bookings, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};
