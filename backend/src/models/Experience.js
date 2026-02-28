 
const mongoose = require('mongoose');
 
const ExperienceSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:     { type: String, required: true, maxlength: 150 },
  country:   { type: String, required: true },
  city:      { type: String },
  category:  {
    type: String,
    enum: ['student-life','cost-of-living','work','housing','culture','visa','general'],
    required: true
  },
  content:   { type: String, required: true, minlength: 50 },
  images:    [String],
  tags:      [String],
  likes:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status:    { type: String, enum: ['pending','approved','rejected'], default: 'pending' },
  views:     { type: Number, default: 0 },
  featured:  { type: Boolean, default: false },
}, { timestamps: true });
 
ExperienceSchema.index({ title: 'text', content: 'text' });
ExperienceSchema.index({ country: 1, category: 1, status: 1 });
 
module.exports = mongoose.model('Experience', ExperienceSchema);
