const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
        equipmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Equipment',
            required: true
        },
        equipmentName: { type: String, required: true },
        studentName: { type: String, required: true },
        studentIdNumber: { type: String, required: true },
        date: { type: String, required: true },
        timeSlot: { type: String, required: true },
        purpose: { type: String, required: true },
        status: {
            type: String,
            enum: ['Pending', 'Accepted', 'Rejected', 'Returned', 'Cancelled'],
            default: 'Pending'
        },
        returnedAt: { type: Date },
        cancelledAt: { type: Date }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);