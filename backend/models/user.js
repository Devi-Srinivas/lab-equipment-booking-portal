const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true, unique: true, trim: true, lowercase: true },
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        department: { type: String, default: '' },
        role: { type: String, enum: ['student', 'admin'], default: 'student' },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);