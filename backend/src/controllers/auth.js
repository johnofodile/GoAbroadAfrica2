const jwt  = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');
const {sendEmail} =require('../utils/sendEmail');
 
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

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: 'If that email exists, a reset link has been sent' });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');

    user.resetToken   = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.resetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Reset your GoAbroadAfrica password',
      html: `<p>You requested a password reset.</p>
             <p><a href="${resetUrl}">Click here to reset your password</a></p>
             <p>This link expires in 10 minutes. If you didn't request this, ignore this email.</p>`,
    });

    res.json({ message: 'If that email exists, a reset link has been sent' });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/reset-password/:token
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetToken: hashedToken,
      resetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Reset link is invalid or has expired' });
    }

    user.password     = password;
    user.resetToken   = undefined;
    user.resetExpires = undefined;
    await user.save();

    const jwtToken = signToken(user._id);
    sendToken(res, 200, user, jwtToken);
  } catch (err) {
    next(err);
  }
};




