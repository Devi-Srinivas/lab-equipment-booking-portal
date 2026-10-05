const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authGuard');
const {
    createBooking,
    getBookings,
    updateBookingStatus,
    returnEquipment,
    cancelBookingRequest,
    cancelBooking
} = require('../controllers/bookingController');

// Any logged-in user
router.post('/', protect, createBooking);                    // Student: submit a request
router.get('/', protect, getBookings);                       // Admin: all | Student: only their own
router.put('/:id/return', protect, returnEquipment);         // Student: return (own bookings only)
router.put('/:id/cancel', protect, cancelBookingRequest);    // Student: cancel (own bookings only)

// Admin only
router.put('/:id', protect, adminOnly, updateBookingStatus); // Accept / Reject
router.delete('/:id', protect, adminOnly, cancelBooking);    // Delete a booking record

module.exports = router;