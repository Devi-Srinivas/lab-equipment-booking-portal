const Booking = require('../models/booking');
const Equipment = require('../models/equipment');

// 1. Submit a booking request (Student)
exports.createBooking = async (req, res) => {
    try {
        const { equipmentId, date, timeSlot, purpose, studentName, studentIdNumber } = req.body;

        const equipment = await Equipment.findById(equipmentId);
        if (!equipment) {
            return res.status(404).json({ message: 'Equipment not found' });
        }

        if ((Number(equipment.availableQuantity) || 0) < 1) {
            return res.status(400).json({ message: 'Equipment is currently not available' });
        }

        const booking = await Booking.create({
            equipmentId,
            // Take the name from the database, not from the browser
            equipmentName: equipment.equipmentName || equipment.name,
            studentName,
            studentIdNumber,
            date,
            timeSlot,
            purpose,
            status: 'Pending'
        });

        res.status(201).json({ success: true, message: 'Booking request submitted successfully', data: booking });
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({ message: error.message });
    }
};

// 2. Get bookings
//    Admin page:   GET /api/bookings                 -> all bookings
//    Student page: GET /api/bookings?student=<name>  -> only that student's bookings
exports.getBookings = async (req, res) => {
    try {
        const query = {};
        if (req.query.student) {
            query.studentName = req.query.student;
        }

        const bookings = await Booking.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({ message: error.message });
    }
};

// 3. Update booking status (Admin: Accepted / Rejected)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const previousStatus = booking.status || 'Pending';

        if (previousStatus === 'Cancelled' || previousStatus === 'Returned') {
            return res.status(400).json({ message: `This booking is already ${previousStatus} and cannot be changed` });
        }

        // Pending/Rejected -> Accepted: reduce available quantity by 1
        if (status === 'Accepted' && previousStatus !== 'Accepted') {
            const updatedEquipment = await Equipment.findOneAndUpdate(
                { _id: booking.equipmentId, availableQuantity: { $gte: 1 } },
                { $inc: { availableQuantity: -1 } },
                { new: true }
            );

            if (!updatedEquipment) {
                return res.status(400).json({ message: 'Equipment is out of stock, cannot accept this request' });
            }
        }

        // Accepted -> Pending/Rejected: give the item back
        if (previousStatus === 'Accepted' && status !== 'Accepted') {
            await Equipment.findByIdAndUpdate(booking.equipmentId, { $inc: { availableQuantity: 1 } });
        }

        booking.status = status;
        await booking.save();

        res.status(200).json({ success: true, message: `Booking ${status}`, data: booking });
    } catch (error) {
        console.error('Update booking error:', error);
        res.status(500).json({ message: error.message });
    }
};

// 4. Return equipment after use (Student) - only for Accepted bookings
exports.returnEquipment = async (req, res) => {
    try {
        const existing = await Booking.findById(req.params.id);
        if (!existing) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Atomic update: only an Accepted booking can become Returned (prevents double returns).
        // updateOne does not run the schema enum check, so this works even if the model's
        // status enum has not been updated yet.
        const result = await Booking.updateOne(
            { _id: req.params.id, status: 'Accepted' },
            { $set: { status: 'Returned', returnedAt: new Date() } }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ message: 'Only accepted bookings can be returned' });
        }

        // Give the item back to stock
        await Equipment.findByIdAndUpdate(existing.equipmentId, { $inc: { availableQuantity: 1 } });

        const booking = await Booking.findById(req.params.id);
        res.status(200).json({ success: true, message: 'Equipment returned successfully', data: booking });
    } catch (error) {
        console.error('Return equipment error:', error);
        res.status(500).json({ message: error.message });
    }
};

// 5. Student cancels a booking (Pending or Accepted).
//    The record is kept with status 'Cancelled' so the admin page and history reflect it.
//    If it was Accepted, the item goes back into stock.
exports.cancelBookingRequest = async (req, res) => {
    try {
        // Atomic: only Pending / Accepted (or old records with no status) can be cancelled.
        // findOneAndUpdate with { new: false } returns the booking as it was BEFORE the change.
        const before = await Booking.findOneAndUpdate(
            {
                _id: req.params.id,
                $or: [{ status: 'Pending' }, { status: 'Accepted' }, { status: { $exists: false } }]
            },
            { $set: { status: 'Cancelled', cancelledAt: new Date() } },
            { new: false }
        );

        if (!before) {
            const exists = await Booking.exists({ _id: req.params.id });
            if (!exists) {
                return res.status(404).json({ message: 'Booking not found' });
            }
            return res.status(400).json({ message: 'Only pending or accepted bookings can be cancelled' });
        }

        // If it was already accepted, stock had been reduced, so give it back
        if (before.status === 'Accepted') {
            await Equipment.findByIdAndUpdate(before.equipmentId, { $inc: { availableQuantity: 1 } });
        }

        const booking = await Booking.findById(req.params.id);
        res.status(200).json({ success: true, message: 'Booking cancelled successfully', data: booking });
    } catch (error) {
        console.error('Cancel booking request error:', error);
        res.status(500).json({ message: error.message });
    }
};

// 6. Delete a booking record permanently (admin use)
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ success: true, message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({ message: error.message });
    }
};