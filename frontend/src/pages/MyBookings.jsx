import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyBookings = () => {
    const [myBookings, setMyBookings] = useState([]);
    const currentUser = JSON.parse(sessionStorage.getItem('userInfo')) || {};

    useEffect(() => {
        const fetchMyBookings = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/bookings/all');
                if (res.data.success) {
                    // కేవలం లాగిన్ అయిన విద్యార్థి రికార్డులను మాత్రమే ఫిల్టర్ చేయడం
                    const filtered = res.data.bookings.filter(
                        b => b.studentIdNumber === (currentUser.idNumber || currentUser.userId || 't-cse-15')
                    );
                    setMyBookings(filtered);
                }
            } catch (err) {
                console.error("Error loading user bookings:", err);
            }
        };

        fetchMyBookings();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2>My Lab Equipment Bookings</h2>
            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ backgroundColor: '#002147', color: 'white' }}>
                        <th>Equipment</th>
                        <th>Purpose / Slot</th>
                        <th>Requested Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {myBookings.length > 0 ? (
                        myBookings.map((b) => (
                            <tr key={b._id}>
                                <td>{b.equipmentName}</td>
                                <td>{b.purpose}</td>
                                <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        color: 'white',
                                        backgroundColor: b.status === 'Approved' ? 'green' : b.status === 'Rejected' ? 'red' : 'orange'
                                    }}>
                                        {b.status}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No bookings found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MyBookings;