const Experience = require('../models/Experience');
const Comment    = require('../models/Comment');
 
// GET /api/experiences — list all approved experiences
exports.getAll = async (req, res, next) => {
  try {
    const { country, category, search, page = 1, limit = 12 } = req.query;
    const filter = { status: 'approved' };
    if (country)  filter.country  = country;
    if (category) filter.category = category;
    if (search)   filter.$text    = { $search: search };
 
    const [experiences, total] = await Promise.all([
      Experience.find(filter)
        .populate('userId', 'name avatar country')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Experience.countDocuments(filter),
    ]);
 
    res.json({ experiences, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};
 
// GET /api/experiences/:id — single experience
exports.getOne = async (req, res, next) => {
  try {
    const exp = await Experience.findById(req.params.id)
      .populate('userId', 'name avatar country bio');
    if (!exp) return res.status(404).json({ message: 'Experience not found' });
 
    // Increment view count
    exp.views++;
    await exp.save();
 
    const comments = await Comment.find({ experienceId: exp._id })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 });
 
    res.json({ experience: exp, comments });
  } catch (err) { next(err); }
};
 
// POST /api/experiences — create (auth required)
exports.create = async (req, res, next) => {
  try {
    // req.files comes from multer-s3 upload middleware
    const images = req.files ? req.files.map(f => f.location) : [];
    const exp = await Experience.create({
      ...req.body,
      userId: req.user._id,
      images,
      tags: req.body.tags ? req.body.tags.split(',').map(t => t.trim()) : [],
    });
    res.status(201).json({ experience: exp });
  } catch (err) { next(err); }
};
 
// DELETE /api/experiences/:id
exports.remove = async (req, res, next) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) return res.status(404).json({ message: 'Not found' });
    // Only owner or admin can delete
    if (exp.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed' });
    }
    await exp.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
 
// POST /api/experiences/:id/like — toggle like
exports.toggleLike = async (req, res, next) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) return res.status(404).json({ message: 'Not found' });
    const idx = exp.likes.findIndex(id => id.equals(req.user._id));
    if (idx === -1) exp.likes.push(req.user._id);
    else            exp.likes.splice(idx, 1);
    await exp.save();
    res.json({ likes: exp.likes.length, liked: idx === -1 });
  } catch (err) { next(err); }
};
 
// POST /api/experiences/:id/comments
exports.addComment = async (req, res, next) => {
  try {
    const comment = await Comment.create({
      experienceId: req.params.id,
      userId: req.user._id,
      content: req.body.content,
    });
    await comment.populate('userId', 'name avatar');
    res.status(201).json({ comment });
  } catch (err) { next(err); }
};
 
// PATCH /api/experiences/:id/approve — admin only
exports.approve = async (req, res, next) => {
  try {
    const exp = await Experience.findByIdAndUpdate(
      req.params.id, { status: req.body.status }, { new: true }
    );
    res.json({ experience: exp });
  } catch (err) { next(err); }
};
