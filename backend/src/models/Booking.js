 
const mongoose = require('mongoose');
 
const BookingSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  consultantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date:         { type: Date, required: true },
  timeSlot:     { type: String, required: true },
  topic:        { type: String },
  notes:        { type: String },
  status:       {
    type: String,
    enum: ['pending','confirmed','completed','cancelled'],
    default: 'pending'
  },
  price:        { type: Number, default: 0 },
  currency:     { type: String, default: 'usd' },
  paymentId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  meetingLink:  { type: String },
}, { timestamps: true });
 
module.exports = mongoose.model('Booking', BookingSchema);
