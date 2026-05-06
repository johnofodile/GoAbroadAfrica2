const Experience= require("../models/Experience");
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
