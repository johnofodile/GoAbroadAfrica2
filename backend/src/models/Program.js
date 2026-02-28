const mongoose = require('mongoose');


const ProgramSchema = new mongoose.Schema({
    country: { type: String, required: true },
    city: { type: String },
    university: { type: String, required: true },
    programName: { type: String, required: true },
    level: { type: String, enum: ['bachelor', 'master', 'phd', 'diploma', 'certificate'] },
    duration: { type: String },
    language: { type: String, default: 'English' },
    tuitionFee: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    requirements: [String],
    deadline: { type: Date },
    programUrl: { type: String },
    logo: { type: String },
    description: { type: String },
    tags: [String],
    scholarships: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });


//Text index for search
ProgramSchema.index({ programName: 'text', university: 'text', country: 'text' });
ProgramSchema.index({ country: 1, level: 1 });
