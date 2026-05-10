const router = require('express').Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const upload = require('../middleware/upload');
 
// GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
  res.json({ user: req.user });
});
 
// PUT /api/users/profile — update name, bio, country
router.put('/profile', protect, async (req, res, next) => {
  try {
    const { name, bio, country } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id, { name, bio, country }, { new: true }
    ).select('-password');
    res.json({ user });
  } catch (err) { next(err); }
});
 
// PUT /api/users/avatar — upload profile photo
router.put('/avatar', protect, upload.single('avatar'), async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id, { avatar: req.file.location }, { new: true }
    ).select('-password');
    res.json({ user });
  } catch (err) { next(err); }
});
 
// POST /api/users/save-program/:programId
router.post('/save-program/:programId', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const idx = user.savedPrograms.indexOf(req.params.programId);
    if (idx === -1) user.savedPrograms.push(req.params.programId);
    else            user.savedPrograms.splice(idx, 1);
    await user.save();
    res.json({ savedPrograms: user.savedPrograms });
  } catch (err) { next(err); }
});
 
module.exports = router;
 
