// users controller — src/controllers/users.js
const User = require('../models/User');

// GET /api/users/profile — return logged-in user's own profile
exports.getProfile = async (req, res, next) => {
  try {
    // req.user is attached by the protect middleware
    res.json({ user: req.user });
  } catch (err) { next(err); }
};

// PUT /api/users/profile — update name, bio, country
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, bio, country } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, country },
      { new: true, runValidators: true }
    ).select('-password');
    res.json({ user });
  } catch (err) { next(err); }
};

// PUT /api/users/avatar — upload or update profile photo
exports.updateAvatar = async (req, res, next) => {
  try {
    // req.file.location is the S3 URL set by multer-s3 in upload middleware
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.file.location },
      { new: true }
    ).select('-password');
    res.json({ user });
  } catch (err) { next(err); }
};

// POST /api/users/save-program/:programId — toggle save/unsave a program
exports.toggleSaveProgram = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const idx  = user.savedPrograms.indexOf(req.params.programId);
    if (idx === -1) user.savedPrograms.push(req.params.programId);
    else            user.savedPrograms.splice(idx, 1);
    await user.save();
    res.json({ savedPrograms: user.savedPrograms });
  } catch (err) { next(err); }
};

// GET /api/users/saved-programs — return user's saved programs list
exports.getSavedPrograms = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedPrograms');
    res.json({ savedPrograms: user.savedPrograms });
  } catch (err) { next(err); }
};
