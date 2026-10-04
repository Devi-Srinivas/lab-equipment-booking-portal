const handleBookingSubmit = async (e) => {
    e.preventDefault();

    // session nunchi current login ayina user info ni tesukuntundhi
    const currentUser = JSON.parse(sessionStorage.getItem('userInfo')) || {};

    const bookingPayload = {
        // Current logged-in user info
        studentName: currentUser.username || currentUser.name,
        studentIdNumber: currentUser.idNumber || currentUser.userId,

        // Form inputs
        equipmentName: selectedEquipmentName,
        equipmentId: selectedEquipmentId,
        quantity: 1,
        purpose: purposeText,
        date: selectedDate,
        timeSlot: selectedSlot
    };

    try {
        const response = await axios.post('http://localhost:5000/api/bookings/book', bookingPayload);
        if (response.data.success) {
            alert('Equipment booked successfully!');
        }
    } catch (error) {
        alert('Booking failed: ' + (error.response?.data?.message || error.message));
    }
};