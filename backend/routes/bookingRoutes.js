const express = require('express');
const router = express.Router();
const {
    createBooking,
    getBookings,
    updateBookingStatus,
    returnEquipment,
    cancelBookingRequest,
    cancelBooking
} = require('../controllers/bookingController');

router.post('/', createBooking);
router.get('/', getBookings);
router.put('/:id/return', returnEquipment);
router.put('/:id/cancel', cancelBookingRequest);
router.put('/:id', updateBookingStatus);
router.delete('/:id', cancelBooking);

module.exports = router;