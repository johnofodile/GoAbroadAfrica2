const jwt  = require('jsonwebtoken');
const User = require('../models/User');
 
// Helper: generate token
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
 
// Helper: send token + user in response
const sendToken = (res, statusCode, user, token) => {
  res.status(statusCode).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
  });
};
 
// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, country } = req.body;
 
    // Check email already taken
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' });
    }
 
    // Create user (password is hashed by the model pre-save hook)
    const user  = await User.create({ name, email, password, country });
    const token = signToken(user._id);
    sendToken(res, 201, user, token);
  } catch (err) {
    next(err);
  }
};
 
// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
 
    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
 
    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
 
    const token = signToken(user._id);
    sendToken(res, 200, user, token);
  } catch (err) {
    next(err);
  }
};
 
// GET /api/auth/me — get currently logged-in user
exports.getMe = async (req, res) => {
  res.json({ user: req.user });
};
 
