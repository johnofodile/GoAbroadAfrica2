const mongoose= require('mongoose');
const bcrypt= require('bcryptjs');

 
const UserSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  email:         { type: String, required: true, unique: true, lowercase: true },
  password:      { type: String, required: true, minlength: 6 },
  role:          { type: String, enum:['user', 'admin','consultant'], default: 'user'},
  country:       { type: String, default: 'Nigeria' },
  avatar:        { type: String, default: '' },
  bio:           { type: String, maxlength: 500, default: '' },
  isVerified:    { type: Boolean, default: false },
  verifyToken:   { type: String },
  resetToken:    { type: String },
  resetExpires:  { type: Date },
  savedPrograms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Program' }],
}, { timestamps: true });

 
// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  //without this line it will stop here permanently
  next();
});


UserSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate,this.password);
};


module.exports= mongoose.model('User', UserSchema);














