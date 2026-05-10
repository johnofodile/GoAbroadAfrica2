const Program = require('../models/Program');
 
// GET /api/programs
exports.getAll = async (req, res, next) => {
  try {
    const { country, level, scholarship, search, page=1, limit=12 } = req.query;
    const filter = { isActive: true };
    if (country)     filter.country     = country;
    if (level)       filter.level       = level;
    if (scholarship) filter.scholarships = true;
    if (search)      filter.$text       = { $search: search };
 
    const [programs, total] = await Promise.all([
      Program.find(filter).sort({ createdAt: -1 }).skip((page-1)*limit).limit(+limit),
      Program.countDocuments(filter),
    ]);
    res.json({ programs, total, page:+page, pages: Math.ceil(total/limit) });
  } catch (err) { next(err); }
};
 
// GET /api/programs/:id
exports.getOne = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) return res.status(404).json({ message: 'Not found' });
    res.json({ program });
  } catch (err) { next(err); }
};
 
// POST /api/programs — admin only
exports.create = async (req, res, next) => {
  try {
    const program = await Program.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ program });
  } catch (err) { next(err); }
};
 
// PUT /api/programs/:id — admin only
exports.update = async (req, res, next) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ program });
  } catch (err) { next(err); }
};
 
// DELETE /api/programs/:id — admin only
exports.remove = async (req, res, next) => {
  try {
    await Program.findByIdAndDelete(req.params.id);
    res.json({ message: 'Program deleted' });
  } catch (err) { next(err); }
};
 
// GET /api/programs/countries — list unique countries
exports.getCountries = async (req, res, next) => {
  try {
    const countries = await Program.distinct('country', { isActive: true });
    res.json({ countries: countries.sort() });
  } catch (err) { next(err); }
};
 
