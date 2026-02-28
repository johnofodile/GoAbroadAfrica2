 
const mongoose = require('mongoose');
 
const PaymentSchema = new mongoose.Schema({
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount:          { type: Number, required: true },
  currency:        { type: String, default: 'usd' },
  type:            { type: String, enum: ['booking','product'] },
  referenceId:     { type: mongoose.Schema.Types.ObjectId },
  stripeSessionId: { type: String },
  status:          {
    type: String,
    enum: ['pending','paid','failed','refunded'],
    default: 'pending'
  },
}, { timestamps: true });
 
module.exports = mongoose.model('Payment', PaymentSchema);
