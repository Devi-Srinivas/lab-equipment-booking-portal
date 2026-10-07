import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GREEN = '#6ef04b';

const css = `
.ad-root { min-height: 100vh; background: #000; color: #fff; font-family: 'Inter', 'Segoe UI', Arial, sans-serif; text-align: left;
           background-image: radial-gradient(700px circle at 85% -5%, rgba(110,240,75,0.14), transparent 60%),
                             radial-gradient(600px circle at -5% 105%, rgba(63,220,110,0.10), transparent 60%); }
.ad-root h3, .ad-root p, .ad-root label, .ad-root span, .ad-root div, .ad-root td, .ad-root th { color: inherit; }
.ad-root *:focus-visible { outline: 2px solid ${GREEN}; outline-offset: 2px; }

/* top bar */
.ad-top { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 28px; border-bottom: 1px solid #14201a; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); }
.ad-brand { display: flex; align-items: center; gap: 12px; font-size: 20px; font-weight: 800; }
.ad-brand-mark { display: inline-flex; padding: 7px; border: 1.5px solid ${GREEN}; border-radius: 10px; }
.ad-brand small { display: block; font-size: 12px; font-weight: 600; color: #8fa196; margin-top: 2px; }
.ad-user { display: flex; align-items: center; gap: 16px; font-size: 14px; font-weight: 600; }
.ad-avatar { width: 36px; height: 36px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: 800; color: #04120a;
             background: linear-gradient(135deg, #b4ff7a, ${GREEN} 50%, #3fdc6e); }
.ad-logout { padding: 8px 16px; border-radius: 10px; border: 1px solid #2c4233; background: transparent; color: #e8f3ea; font-weight: 700; font-family: inherit; cursor: pointer; transition: border-color .2s, color .2s; }
.ad-logout:hover { border-color: #ff5b5b; color: #ff9a9a; }

/* tabs */
.ad-nav { display: flex; flex-wrap: wrap; gap: 10px; padding: 18px 28px 0; }
.ad-tab { display: inline-flex; align-items: center; gap: 8px; padding: 11px 18px; border-radius: 12px; border: 1px solid #1f2d24; background: #0b100c; color: #b9c7bd;
          font-size: 14px; font-weight: 700; font-family: inherit; cursor: pointer; transition: border-color .2s, color .2s, box-shadow .2s, background .2s; }
.ad-tab:hover { border-color: rgba(110,240,75,0.55); color: #fff; }
.ad-tab.active { color: #04120a; border-color: transparent; background: linear-gradient(135deg, #b4ff7a 0%, ${GREEN} 45%, #3fdc6e 100%); box-shadow: 0 8px 24px rgba(110,240,75,0.28); }
.ad-tab.danger:hover { border-color: #ff5b5b; }
.ad-tab.danger.active { color: #fff; background: linear-gradient(135deg, #ff7b7b, #ff5b5b); box-shadow: 0 8px 24px rgba(255,91,91,0.28); }
.ad-badge { min-width: 22px; height: 22px; padding: 0 7px; border-radius: 11px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; background: #ffd166; color: #1a1300; }
.ad-badge.zero { background: #1c2a21; color: #8fa196; }

/* layout + cards */
.ad-main { display: flex; gap: 20px; padding: 20px 28px 40px; align-items: flex-start; }
.ad-main > .ad-col { flex: 1; min-width: 0; }
.ad-main > .ad-col.wide { flex: 2; }
.ad-stack { display: flex; flex-direction: column; gap: 20px; width: 100%; }
.ad-card { border-radius: 20px; padding: 24px; border: 1px solid #1c2a21; background: linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015));
           box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 50px rgba(110,240,75,0.05); animation: adIn .5s ease both; }
.ad-card h3 { margin: 0 0 4px; font-size: 20px; font-weight: 800; letter-spacing: -0.3px; }
.ad-sub { margin: 0 0 18px; font-size: 14px; color: #a3b1a8; }
.ad-empty { padding: 28px 8px; text-align: center; color: #8fa196; font-size: 14px; }

/* form */
.ad-f { margin-bottom: 16px; }
.ad-label { display: block; font-size: 13px; font-weight: 700; margin-bottom: 8px; color: #fff; }
.ad-input { width: 100%; box-sizing: border-box; padding: 13px 15px; font-size: 14px; border-radius: 12px; border: 1px solid #1f2d24; background: #0b100c; color: #fff; font-family: inherit;
            transition: border-color .2s, box-shadow .2s, background .2s; color-scheme: dark; }
.ad-input::placeholder { color: #6a7b6f; }
.ad-input:hover { border-color: #2c4233; }
.ad-input:focus { outline: none; border-color: ${GREEN}; background: #0e150f; box-shadow: 0 0 0 3px rgba(110,240,75,0.18), 0 0 24px rgba(110,240,75,0.12); }
select.ad-input { appearance: none; -webkit-appearance: none; cursor: pointer; padding-right: 40px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%236ef04b' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 15px center; }
select.ad-input option { background: #0b100c; color: #fff; }
.ad-btn { width: 100%; padding: 14px; font-size: 15px; font-weight: 800; color: #04120a; border: none; border-radius: 12px; cursor: pointer; font-family: inherit;
          background: linear-gradient(135deg, #b4ff7a 0%, ${GREEN} 45%, #3fdc6e 100%); box-shadow: 0 10px 28px rgba(110,240,75,0.3); transition: transform .18s, box-shadow .18s; }
.ad-btn:hover { transform: translateY(-2px); box-shadow: 0 16px 36px rgba(110,240,75,0.42); }
.ad-btn.amber { background: linear-gradient(135deg, #ffe08a, #ffd166 50%, #f5b942); box-shadow: 0 10px 28px rgba(255,209,102,0.25); }
.ad-btn-sm { padding: 7px 14px; border-radius: 9px; border: 1px solid; background: transparent; font-size: 13px; font-weight: 700; font-family: inherit; cursor: pointer; transition: background .2s, color .2s; }
.ad-btn-sm.green { color: ${GREEN}; border-color: rgba(110,240,75,0.5); } .ad-btn-sm.green:hover { background: ${GREEN}; color: #04120a; }
.ad-btn-sm.amber { color: #ffd166; border-color: rgba(255,209,102,0.5); } .ad-btn-sm.amber:hover { background: #ffd166; color: #1a1300; }
.ad-btn-sm.red { color: #ff7b7b; border-color: rgba(255,91,91,0.5); } .ad-btn-sm.red:hover { background: #ff5b5b; color: #fff; }
.ad-btn-sm.ghost { color: #d3e0d6; border-color: #2c4233; } .ad-btn-sm.ghost:hover { border-color: ${GREEN}; color: #fff; }
.ad-btn-sm + .ad-btn-sm { margin-left: 8px; }

/* tables */
.ad-scroll { overflow-x: auto; }
.ad-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.ad-table th { text-align: left; padding: 12px 14px; font-size: 13px; font-weight: 700; color: #8fa196; background: rgba(110,240,75,0.05); border-bottom: 1px solid #1c2a21; white-space: nowrap; }
.ad-table th:first-child { border-top-left-radius: 10px; } .ad-table th:last-child { border-top-right-radius: 10px; }
.ad-table td { padding: 13px 14px; border-bottom: 1px solid #14201a; color: #e8f3ea; vertical-align: middle; }
.ad-table tbody tr { transition: background .15s; }
.ad-table tbody tr:hover { background: rgba(110,240,75,0.05); }
.ad-strong { font-weight: 700; color: #fff; }
.ad-muted { color: #8fa196; }
.ad-qty { display: flex; flex-direction: column; gap: 6px; min-width: 90px; }
.ad-bar { height: 4px; border-radius: 4px; background: #1c2a21; overflow: hidden; }
.ad-bar i { display: block; height: 100%; border-radius: 4px; }
.ad-bar i.ok { background: ${GREEN}; } .ad-bar i.mid { background: #ffd166; } .ad-bar i.low { background: #ff5b5b; }

/* status pills */
.ad-pill { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 800; border: 1px solid; }
.ad-pill.pending { color: #ffd166; border-color: rgba(255,209,102,0.45); background: rgba(255,209,102,0.1); }
.ad-pill.accepted { color: ${GREEN}; border-color: rgba(110,240,75,0.45); background: rgba(110,240,75,0.1); }
.ad-pill.rejected { color: #ff7b7b; border-color: rgba(255,91,91,0.45); background: rgba(255,91,91,0.1); }
.ad-pill.returned { color: #9fb0a3; border-color: rgba(159,176,163,0.4); background: rgba(159,176,163,0.08); }
.ad-pill.cancelled { color: #ff9a6b; border-color: rgba(255,154,107,0.4); background: rgba(255,154,107,0.08); }
.ad-ret-ok { color: ${GREEN}; font-weight: 700; } .ad-ret-no { color: #ff7b7b; font-weight: 700; }
.ad-ret-time { display: block; font-size: 12px; font-weight: 400; color: #8fa196; margin-top: 2px; }

/* toolbars + stats */
.ad-bar-row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
.ad-bar-row .grow { margin-right: auto; }
.ad-chipstat { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 12px; border: 1px solid #1f2d24; background: #0b100c; font-size: 13px; font-weight: 700; }
.ad-chipstat i { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.ad-filter { width: auto; padding: 9px 40px 9px 14px; }
.ad-date { width: auto; padding: 9px 12px; }
.ad-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 14px; margin-top: 20px; }
.ad-stat { padding: 16px; border-radius: 14px; border: 1px solid #1f2d24; background: #0b100c; border-top-width: 3px; }
.ad-stat b { display: block; font-size: 30px; font-weight: 800; line-height: 1.1; }
.ad-stat span { font-size: 13px; color: #a3b1a8; }


textarea.ad-input { resize: vertical; min-height: 110px; line-height: 1.5; }
.ad-center { width: 100%; display: flex; justify-content: center; }
.ad-slot-hint { font-size: 12px; color: #8fa196; margin-top: 6px; }

@keyframes adIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
@media (max-width: 900px) {
  .ad-main { flex-direction: column; padding: 16px; } .ad-main > .ad-col, .ad-main > .ad-col.wide { width: 100%; flex: none; }
  .ad-top { padding: 14px 16px; } .ad-nav { padding: 16px 16px 0; }
}
@media print {
  .ad-root { background: #fff; color: #000; } .ad-top, .ad-nav, .no-print { display: none !important; }
  .ad-card { background: #fff; border-color: #ccc; box-shadow: none; } .ad-table td, .ad-table th, .ad-stat span, .ad-stat b { color: #000; }
}
@media (prefers-reduced-motion: reduce) { .ad-card { animation: none; } }
`;

const CubeIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
        <path d="M3.3 7.5L12 12.5l8.7-5" />
        <path d="M12 22V12.5" />
    </svg>
);


const Field = ({ label, children }) => (
    <div className="ad-f">
        <label className="ad-label">{label}</label>
        {children}
    </div>
);

const statusClass = (s) => {
    const v = String(s || 'pending').toLowerCase();
    return ['accepted', 'rejected', 'returned', 'cancelled'].includes(v) ? v : 'pending';
};


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
        <div className="ad-root">
            <style>{css}</style>

            {/* Top bar */}
            <div className="ad-top">
                <div className="ad-brand">
                    <span className="ad-brand-mark"><CubeIcon /></span>
                    <div>
                        Lab<span style={{ color: GREEN }}>Portal</span>
                        <small>Laboratory Equipment Booking Portal</small>
                    </div>
                </div>
                <div className="ad-user">
                    <span className="ad-avatar">{String(studentName).charAt(0).toUpperCase()}</span>
                    <span>Hi... {studentName}</span>
                    <button type="button" className="ad-logout" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            {/* Navigation */}
            <div className="ad-nav">
                <button type="button" onClick={() => setActiveTab('book')} className={`ad-tab${activeTab === 'book' ? ' active' : ''}`}>
                    Book Equipment
                </button>
                <button type="button" onClick={() => setActiveTab('my-bookings')} className={`ad-tab${activeTab === 'my-bookings' ? ' active' : ''}`}>
                    My Bookings
                    <span className={`ad-badge${myBookings.length === 0 ? ' zero' : ''}`} title="Total bookings">{myBookings.length}</span>
                </button>
            </div>

            {/* Main Content */}
            <div className="ad-main" style={{ justifyContent: 'center' }}>
                {activeTab === 'book' ? (
                    <div className="ad-center">
                        <div className="ad-card" style={{ width: '100%', maxWidth: 620 }}>
                            <h3>Request Lab Equipment Slot</h3>
                            <p className="ad-sub">Pick the equipment, date and time. The lab admin will review your request.</p>
                            <form onSubmit={handleSubmit}>
                                <Field label="Select Equipment">
                                    <select className="ad-input" name="equipmentId" value={formData.equipmentId} onChange={handleChange} required>
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
                                </Field>

                                <Field label="Date">
                                    <input className="ad-input" type="date" name="date" value={formData.date} onChange={handleChange} required />
                                </Field>

                                <Field label="Time Slot">
                                    <select className="ad-input" name="timeSlot" value={formData.timeSlot} onChange={handleChange}>
                                        <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                                        <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                                        <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                                        <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                                    </select>
                                </Field>

                                <Field label="Purpose / Project Details">
                                    <textarea
                                        className="ad-input"
                                        name="purpose"
                                        value={formData.purpose}
                                        onChange={handleChange}
                                        placeholder="Mention your lab experiment or project work details"
                                        rows="4"
                                        required
                                    ></textarea>
                                </Field>

                                <button type="submit" className="ad-btn">Submit Request</button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="ad-center">
                        <div className="ad-card" style={{ width: '100%', maxWidth: 900 }}>
                            <h3>My Booking Requests</h3>
                            <p className="ad-sub">Track approval status, return equipment, or cancel a booking.</p>
                            {myBookings.length === 0 ? (
                                <div className="ad-empty">No booking requests yet. Go to Book Equipment to make your first request.</div>
                            ) : (
                                <div className="ad-scroll">
                                    <table className="ad-table">
                                        <thead>
                                            <tr><th>Equipment</th><th>Date</th><th>Time Slot</th><th>Status</th><th>Action</th></tr>
                                        </thead>
                                        <tbody>
                                            {myBookings.map((b) => (
                                                <tr key={b._id}>
                                                    <td className="ad-strong">{b.equipmentName || 'Equipment'}</td>
                                                    <td>{b.date}</td>
                                                    <td>{b.timeSlot}</td>
                                                    <td><span className={`ad-pill ${statusClass(b.status)}`}>{b.status || 'Pending'}</span></td>
                                                    <td style={{ whiteSpace: 'nowrap' }}>
                                                        {b.status === 'Accepted' && (
                                                            <button type="button" className="ad-btn-sm green" onClick={() => handleReturn(b._id)}>Return Equipment</button>
                                                        )}
                                                        {(!b.status || b.status === 'Pending' || b.status === 'Accepted') ? (
                                                            <button type="button" className="ad-btn-sm red" onClick={() => handleCancel(b._id)}>Cancel Booking</button>
                                                        ) : (
                                                            b.status !== 'Accepted' && <span className="ad-muted">-</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;