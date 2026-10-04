import React, { useState, useEffect } from 'react';
import axios from 'axios';
import collegeBanner from '../assets/college-banner.jpg';

const StudentDashboard = () => {
    const [equipmentList, setEquipmentList] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('book'); // 'book' or 'my-bookings'
    const [formData, setFormData] = useState({
        equipmentId: '',
        date: '',
        timeSlot: '02:00 PM - 04:00 PM',
        purpose: ''
    });

    // Login page saves the whole user object under 'userInfo'
    let user = {};
    try {
        user = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
    } catch (err) {
        user = {};
    }
    const studentName = user.username || user.name || user.fullName || 'Student';

    // Fetch available equipment list for dropdown
    const fetchEquipment = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/equipment');
            setEquipmentList(response.data.data || response.data);
        } catch (error) {
            console.error("Error fetching equipment:", error);
        }
    };

    // Fetch student's bookings
    const fetchMyBookings = async () => {
        try {
            // మీ బ్యాకెండ్ API రూట్ బట్టి దీన్ని అడ్జస్ట్ చేసుకోవచ్చు (ఉదాహరణకు: /api/bookings/my-bookings)
            const response = await axios.get(`http://localhost:5000/api/bookings?student=${studentName}`);
            setMyBookings(response.data.data || response.data);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    };

    useEffect(() => {
        fetchEquipment();
        fetchMyBookings();
    }, []);

    // Keep available counts current: other students' bookings change them
    useEffect(() => {
        if (activeTab === 'book') {
            fetchEquipment();
        }
    }, [activeTab]);

    useEffect(() => {
        const refresh = () => {
            fetchEquipment();
            fetchMyBookings();
        };
        window.addEventListener('focus', refresh);
        return () => window.removeEventListener('focus', refresh);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Submit Booking Request
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Roll number comes from the logged-in user (user.idNumber)
            const studentIdNumber = user.idNumber || user.userId;
            if (!studentIdNumber) {
                alert("Student ID not found. Please log out and log in again.");
                return;
            }

            // Find the selected equipment to send its name along with the booking
            const selected = equipmentList.find((item) => item._id === formData.equipmentId);
            const equipmentName = selected?.equipmentName || selected?.name;
            if (!equipmentName) {
                alert("Please select a valid equipment.");
                return;
            }
            if ((Number(selected.availableQuantity) || 0) < 1) {
                alert("This equipment is currently not available.");
                return;
            }

            const payload = {
                ...formData,
                studentName: studentName,
                studentIdNumber: studentIdNumber,
                equipmentName: equipmentName
            };

            const response = await axios.post('http://localhost:5000/api/bookings', payload);
            if (response.data.success || response.data) {
                alert("Equipment slot booked successfully!");
                setFormData({
                    equipmentId: '',
                    date: '',
                    timeSlot: '02:00 PM - 04:00 PM',
                    purpose: ''
                });
                fetchMyBookings();
                fetchEquipment();
            }
        } catch (error) {
            console.error("Booking failed:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Failed to submit booking request");
        }
    };

    // Return equipment after use (only for Accepted bookings)
    const handleReturn = async (id) => {
        if (!window.confirm("Have you finished using this equipment and want to return it?")) return;
        try {
            await axios.put(`http://localhost:5000/api/bookings/${id}/return`);
            alert("Equipment returned successfully!");
            fetchMyBookings();
            fetchEquipment();
        } catch (error) {
            console.error("Return failed:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Failed to return equipment");
        }
    };

    // Cancel a booking (Pending or Accepted). Admin page and stock update automatically.
    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;
        try {
            await axios.put(`http://localhost:5000/api/bookings/${id}/cancel`);
            alert("Booking cancelled successfully!");
            fetchMyBookings();
            fetchEquipment();
        } catch (error) {
            console.error("Cancel failed:", error.response?.data || error.message);
            alert(error.response?.data?.message || "Failed to cancel booking");
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        window.location.href = '/login';
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <div style={{ backgroundColor: '#ffffff', textAlign: 'center', borderBottom: '2px solid #b2c8de' }}>
                <img
                    src={collegeBanner}
                    alt="Sri Vasavi Engineering College Banner"
                    style={{ width: '100%', maxWidth: '1200px', height: 'auto', display: 'block', margin: '0 auto' }}
                />
            </div>
            {/* 2. Sub-Bar with Hi... ADMIN NAME and Actions */}
            <div style={{
                backgroundColor: '#6ba4e8',
                color: '#000000',
                padding: '10px 25px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontWeight: 'bold',
                fontSize: '15px',
                borderTop: '1px solid #4a84c8'
            }}>
                <div>
                    Hi... {studentName}
                </div>
                <div style={{ display: 'flex', gap: '30px' }}>
                    <span
                        onClick={handleLogout}
                        style={{ cursor: 'pointer', color: '#000000' }}
                    >
                        Logout
                    </span>
                </div>
            </div>

            {/* Sub Header / Navigation */}
            <div style={{ backgroundColor: '#e9ecef', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc' }}>
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Laboratory Equipment Booking Portal</span>
                <div>
                    <button
                        onClick={() => setActiveTab('book')}
                        style={{ backgroundColor: activeTab === 'book' ? '#003366' : '#fff', color: activeTab === 'book' ? '#fff' : '#333', padding: '8px 15px', border: '1px solid #003366', borderRadius: '4px', marginRight: '10px', cursor: 'pointer' }}
                    >
                        Book Equipment
                    </button>
                    <button
                        onClick={() => setActiveTab('my-bookings')}
                        style={{ backgroundColor: activeTab === 'my-bookings' ? '#003366' : '#fff', color: activeTab === 'my-bookings' ? '#fff' : '#333', padding: '8px 15px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        My Bookings ({myBookings.length})
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ padding: '30px', display: 'flex', justifyContent: 'center' }}>
                {activeTab === 'book' ? (
                    <div style={{ width: '100%', maxWidth: '600px', backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginTop: 0 }}>Request Lab Equipment Slot</h3>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Select Equipment:</label>
                                <select
                                    name="equipmentId"
                                    value={formData.equipmentId}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                                >
                                    <option value="">-- Choose Equipment --</option>
                                    {equipmentList.map((item) => {
                                        const available = Number(item.availableQuantity) || 0;
                                        return (
                                            <option key={item._id} value={item._id} disabled={available < 1}>
                                                {item.equipmentName || item.name} - Available: {available}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Date:</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Time Slot:</label>
                                <select
                                    name="timeSlot"
                                    value={formData.timeSlot}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                                >
                                    <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                                    <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                                    <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                                    <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Purpose / Project Details:</label>
                                <textarea
                                    name="purpose"
                                    value={formData.purpose}
                                    onChange={handleChange}
                                    placeholder="Mention your lab experiment or project work details"
                                    rows="4"
                                    required
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                style={{ width: '100%', backgroundColor: '#003366', color: '#fff', padding: '12px', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
                            >
                                Submit Request
                            </button>
                        </form>
                    </div>
                ) : (
                    <div style={{ width: '100%', maxWidth: '800px', backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', marginTop: 0 }}>My Booking Requests</h3>
                        {myBookings.length === 0 ? (
                            <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>No booking requests found.</p>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f1f1f1', textAlign: 'left' }}>
                                        <th style={{ padding: '10px' }}>Equipment</th>
                                        <th style={{ padding: '10px' }}>Date</th>
                                        <th style={{ padding: '10px' }}>Time Slot</th>
                                        <th style={{ padding: '10px' }}>Status</th>
                                        <th style={{ padding: '10px' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myBookings.map((b) => (
                                        <tr key={b._id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '10px' }}>{b.equipmentName || 'Equipment'}</td>
                                            <td style={{ padding: '10px' }}>{b.date}</td>
                                            <td style={{ padding: '10px' }}>{b.timeSlot}</td>
                                            <td style={{ padding: '10px', fontWeight: 'bold', color: b.status === 'Accepted' ? 'green' : b.status === 'Rejected' ? 'red' : b.status === 'Returned' ? '#6c757d' : b.status === 'Cancelled' ? '#a94442' : 'orange' }}>
                                                {b.status || 'Pending'}
                                            </td>
                                            <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>
                                                {b.status === 'Accepted' && (
                                                    <button
                                                        onClick={() => handleReturn(b._id)}
                                                        style={{ padding: '5px 10px', backgroundColor: '#003366', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '6px' }}
                                                    >
                                                        Return Equipment
                                                    </button>
                                                )}
                                                {(!b.status || b.status === 'Pending' || b.status === 'Accepted') ? (
                                                    <button
                                                        onClick={() => handleCancel(b._id)}
                                                        style={{ padding: '5px 10px', backgroundColor: '#d9534f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                    >
                                                        Cancel Booking
                                                    </button>
                                                ) : (
                                                    b.status !== 'Accepted' && <span style={{ color: '#999' }}>-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;