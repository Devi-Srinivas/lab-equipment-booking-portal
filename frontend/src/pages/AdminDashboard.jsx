import React, { useState, useEffect } from 'react';
import axios from 'axios';
import collegeBanner from '../assets/college-banner.jpg';

const AdminDashboard = () => {
    const [equipmentList, setEquipmentList] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('add'); // 'add', 'update', 'delete', 'requests'
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [formData, setFormData] = useState({
        equipmentName: '',
        equipmentId: '',
        department: 'Computer Science (CSE)',
        totalQuantity: '',
        labNumber: ''
    });

    // Login page saves the whole user object under 'userInfo'
    let user = {};
    try {
        user = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
    } catch (err) {
        user = {};
    }
    const username = user.username || user.name || user.fullName || 'ADMIN';

    const isPending = (b) => !b.status || String(b.status).toLowerCase() === 'pending';
    const pendingCount = bookings.filter(isPending).length;
    const notReturnedCount = bookings.filter((b) => b.status === 'Accepted').length;
    const returnedCount = bookings.filter((b) => b.status === 'Returned').length;

    const [statusFilter, setStatusFilter] = useState('All');
    const filteredBookings = bookings.filter((b) => {
        if (statusFilter === 'All') return true;
        if (statusFilter === 'Pending') return isPending(b);
        return b.status === statusFilter;
    });

    const formatDateTime = (value) => {
        if (!value) return '';
        const d = new Date(value);
        return isNaN(d.getTime()) ? '' : d.toLocaleString();
    };

    // ---------- Reports ----------
    const [reportFrom, setReportFrom] = useState('');
    const [reportTo, setReportTo] = useState('');
    const cell = { padding: '10px' };

    const reportBookings = bookings.filter((b) => {
        const d = (b.date || '').slice(0, 10);
        if (reportFrom && d < reportFrom) return false;
        if (reportTo && d > reportTo) return false;
        return true;
    });

    const countBy = (list, status) =>
        list.filter((b) => (status === 'Pending' ? isPending(b) : b.status === status)).length;

    const equipmentReport = equipmentList.map((eq) => {
        const list = reportBookings.filter((b) => String(b.equipmentId) === String(eq._id));
        return {
            key: eq._id,
            name: eq.equipmentName || eq.name,
            code: eq.equipmentId,
            total: list.length,
            inUse: countBy(list, 'Accepted'),
            returned: countBy(list, 'Returned'),
            available: eq.availableQuantity,
            quantity: eq.totalQuantity
        };
    });

    const studentMap = {};
    reportBookings.forEach((b) => {
        const key = b.studentIdNumber || b.studentName || 'Unknown';
        if (!studentMap[key]) studentMap[key] = { key, name: b.studentName, id: b.studentIdNumber, list: [] };
        studentMap[key].list.push(b);
    });
    const studentReport = Object.values(studentMap).map((s) => ({
        key: s.key,
        name: s.name,
        id: s.id,
        total: s.list.length,
        inUse: countBy(s.list, 'Accepted'),
        returned: countBy(s.list, 'Returned'),
        cancelled: countBy(s.list, 'Cancelled')
    }));

    const downloadCSV = () => {
        const rows = [['Student', 'ID Number', 'Equipment', 'Date', 'Time Slot', 'Purpose', 'Status', 'Returned At']];
        reportBookings.forEach((b) => {
            rows.push([
                b.studentName, b.studentIdNumber, b.equipmentName, b.date, b.timeSlot,
                b.purpose, b.status || 'Pending', b.returnedAt ? formatDateTime(b.returnedAt) : ''
            ]);
        });
        const csv = rows
            .map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
            .join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'booking-report.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    const fetchEquipmentList = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/equipment');
            setEquipmentList(res.data.data || res.data);
        } catch (err) {
            console.error("Error fetching equipment:", err);
        }
    };

    // Fetch ALL booking requests (admin view)
    const fetchBookings = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/bookings');
            const list = res.data.data || res.data;
            setBookings(Array.isArray(list) ? list : []);
        } catch (err) {
            console.error("Error fetching bookings:", err.response?.data || err.message);
        }
    };

    useEffect(() => {
        fetchEquipmentList();
        fetchBookings();
    }, []);

    // Refresh the list every time the requests tab is opened
    useEffect(() => {
        fetchEquipmentList();
        if (activeTab === 'requests' || activeTab === 'reports') {
            fetchBookings();
        }
    }, [activeTab]);

    // Pick up student actions (cancel / return) when the admin comes back to this tab
    useEffect(() => {
        const refresh = () => {
            fetchBookings();
            fetchEquipmentList();
        };
        window.addEventListener('focus', refresh);
        return () => window.removeEventListener('focus', refresh);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Accept / Reject a booking request
    const handleStatusChange = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/bookings/${id}`, { status });
            fetchBookings();
            fetchEquipmentList();
        } catch (err) {
            console.error("Failed to update booking:", err.response?.data || err.message);
            alert("Failed to update booking: " + (err.response?.data?.message || err.message || "Server Error"));
        }
    };

    // Add New Equipment Submit
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            // Sending both naming conventions to match backend schemas safely
            const payload = {
                ...formData,
                name: formData.equipmentName,
                availableQuantity: formData.totalQuantity
            };

            const res = await axios.post('http://localhost:5000/api/equipment', payload);
            if (res.data.success || res.status === 200 || res.status === 201) {
                alert("Equipment added successfully!");
                setFormData({ equipmentName: '', equipmentId: '', department: 'Computer Science (CSE)', totalQuantity: '', labNumber: '' });
                fetchEquipmentList();
            }
        } catch (err) {
            console.error("Failed to add equipment:", err.response?.data || err.message);
            alert("Failed to add equipment: " + (err.response?.data?.message || err.message || "Server Error"));
        }
    };

    // Update Equipment Submit
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (!selectedEquipment) return;
        try {
            const payload = {
                ...formData,
                name: formData.equipmentName
            };

            const res = await axios.put(`http://localhost:5000/api/equipment/${selectedEquipment._id}`, payload);
            if (res.data.success || res.status === 200) {
                alert("Equipment updated successfully!");
                setSelectedEquipment(null);
                setFormData({ equipmentName: '', equipmentId: '', department: 'Computer Science (CSE)', totalQuantity: '', labNumber: '' });
                fetchEquipmentList();
            }
        } catch (err) {
            console.error("Failed to update equipment:", err.response?.data || err.message);
            alert("Failed to update equipment: " + (err.response?.data?.message || err.message || "Server Error"));
        }
    };

    // Delete Equipment Handler
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this equipment?")) {
            try {
                const res = await axios.delete(`http://localhost:5000/api/equipment/${id}`);
                if (res.data.success || res.status === 200) {
                    alert("Equipment deleted successfully!");
                    fetchEquipmentList();
                }
            } catch (err) {
                alert("Failed to delete equipment");
            }
        }
    };

    const handleSelectForUpdate = (item) => {
        setSelectedEquipment(item);
        setFormData({
            equipmentName: item.equipmentName || item.name,
            equipmentId: item.equipmentId,
            department: item.department || 'Computer Science (CSE)',
            totalQuantity: item.totalQuantity,
            labNumber: item.labNumber
        });
    };

    const handleLogout = () => {
        sessionStorage.clear();
        window.location.href = '/login';
    };

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            {/* 1. Official College Header Banner Image */}
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
                    Hi... {username}
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

            {/* Sub Header Navigation Buttons */}
            <div style={{ backgroundColor: '#e9ecef', padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc' }}>
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Laboratory Equipment Booking Portal</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={() => setActiveTab('add')}
                        style={{ backgroundColor: activeTab === 'add' ? '#003366' : '#fff', color: activeTab === 'add' ? '#fff' : '#333', padding: '8px 15px', border: '1px solid #003366', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Add Equipment
                    </button>
                    <button
                        onClick={() => setActiveTab('update')}
                        style={{ backgroundColor: activeTab === 'update' ? '#f0ad4e' : '#fff', color: activeTab === 'update' ? '#fff' : '#f0ad4e', padding: '8px 15px', border: '1px solid #f0ad4e', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Update Equipment
                    </button>
                    <button
                        onClick={() => setActiveTab('delete')}
                        style={{ backgroundColor: activeTab === 'delete' ? '#d9534f' : '#fff', color: activeTab === 'delete' ? '#fff' : '#d9534f', padding: '8px 15px', border: '1px solid #d9534f', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Delete Equipment
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        style={{ backgroundColor: activeTab === 'requests' ? '#007bff' : '#fff', color: activeTab === 'requests' ? '#fff' : '#333', padding: '8px 15px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        All Booking Requests ({pendingCount} Pending)
                    </button>
                    <button
                        onClick={() => setActiveTab('reports')}
                        style={{ backgroundColor: activeTab === 'reports' ? '#6f42c1' : '#fff', color: activeTab === 'reports' ? '#fff' : '#6f42c1', padding: '8px 15px', border: '1px solid #6f42c1', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Reports
                    </button>
                </div>
            </div>

            {/* Dynamic Content Based on Active Tab */}
            <div style={{ display: 'flex', padding: '20px', gap: '20px' }}>

                {/* TAB 1: ADD EQUIPMENT */}
                {activeTab === 'add' && (
                    <div style={{ display: 'flex', width: '100%', gap: '20px' }}>
                        <div style={{ flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
                            <h3>Add New Equipment</h3>
                            <form onSubmit={handleAddSubmit}>
                                <div style={{ marginBottom: '15px' }}>
                                    <label>Equipment Name:</label>
                                    <input type="text" name="equipmentName" value={formData.equipmentName} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label>Equipment ID / Code:</label>
                                    <input type="text" name="equipmentId" value={formData.equipmentId} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label>Department:</label>
                                    <select name="department" value={formData.department} onChange={handleChange} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                                        <option value="Computer Science (CSE)">Computer Science (CSE)</option>
                                        <option value="Electrical (EEE)">Electrical (EEE)</option>
                                        <option value="Mechanical (MECH)">Mechanical (MECH)</option>
                                        <option value="Electronics (ECE)">Electronics (ECE)</option>
                                    </select>
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label>Total Quantity:</label>
                                    <input type="number" name="totalQuantity" value={formData.totalQuantity} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                                </div>
                                <div style={{ marginBottom: '15px' }}>
                                    <label>Lab Number / Room:</label>
                                    <input type="text" name="labNumber" value={formData.labNumber} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                                </div>
                                <button type="submit" style={{ width: '100%', backgroundColor: '#003366', color: '#fff', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Equipment</button>
                            </form>
                        </div>
                        <div style={{ flex: 2, backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
                            <h3>Available Equipments</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f1f1f1', textAlign: 'left' }}>
                                        <th style={{ padding: '10px' }}>Name</th>
                                        <th style={{ padding: '10px' }}>ID</th>
                                        <th style={{ padding: '10px' }}>Dept</th>
                                        <th style={{ padding: '10px' }}>Qty</th>
                                        <th style={{ padding: '10px' }}>Lab</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {equipmentList.map((item) => (
                                        <tr key={item._id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '10px' }}>{item.equipmentName || item.name}</td>
                                            <td style={{ padding: '10px' }}>{item.equipmentId}</td>
                                            <td style={{ padding: '10px' }}>{item.department}</td>
                                            <td style={{ padding: '10px' }}>{item.availableQuantity} / {item.totalQuantity}</td>
                                            <td style={{ padding: '10px' }}>{item.labNumber}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 2: UPDATE EQUIPMENT */}
                {activeTab === 'update' && (
                    <div style={{ display: 'flex', width: '100%', gap: '20px' }}>
                        <div style={{ flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
                            <h3>Update Equipment Details</h3>
                            {selectedEquipment ? (
                                <form onSubmit={handleUpdateSubmit}>
                                    <div style={{ marginBottom: '15px' }}>
                                        <label>Equipment Name:</label>
                                        <input type="text" name="equipmentName" value={formData.equipmentName} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                                    </div>
                                    <div style={{ marginBottom: '15px' }}>
                                        <label>Total Quantity:</label>
                                        <input type="number" name="totalQuantity" value={formData.totalQuantity} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                                    </div>
                                    <div style={{ marginBottom: '15px' }}>
                                        <label>Lab Number:</label>
                                        <input type="text" name="labNumber" value={formData.labNumber} onChange={handleChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                                    </div>
                                    <button type="submit" style={{ width: '100%', backgroundColor: '#f0ad4e', color: '#fff', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Save Changes</button>
                                </form>
                            ) : (
                                <p style={{ color: '#666' }}>Please select an equipment from the table to update.</p>
                            )}
                        </div>
                        <div style={{ flex: 2, backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
                            <h3>Select Equipment to Update</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f1f1f1', textAlign: 'left' }}>
                                        <th style={{ padding: '10px' }}>Name</th>
                                        <th style={{ padding: '10px' }}>ID</th>
                                        <th style={{ padding: '10px' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {equipmentList.map((item) => (
                                        <tr key={item._id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '10px' }}>{item.equipmentName || item.name}</td>
                                            <td style={{ padding: '10px' }}>{item.equipmentId}</td>
                                            <td style={{ padding: '10px' }}>
                                                <button onClick={() => handleSelectForUpdate(item)} style={{ padding: '5px 10px', backgroundColor: '#f0ad4e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 3: DELETE EQUIPMENT */}
                {activeTab === 'delete' && (
                    <div style={{ width: '100%', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
                        <h3>Manage and Delete Equipment</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f1f1f1', textAlign: 'left' }}>
                                    <th style={{ padding: '10px' }}>Name</th>
                                    <th style={{ padding: '10px' }}>ID</th>
                                    <th style={{ padding: '10px' }}>Dept</th>
                                    <th style={{ padding: '10px' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {equipmentList.map((item) => (
                                    <tr key={item._id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '10px' }}>{item.equipmentName || item.name}</td>
                                        <td style={{ padding: '10px' }}>{item.equipmentId}</td>
                                        <td style={{ padding: '10px' }}>{item.department}</td>
                                        <td style={{ padding: '10px' }}>
                                            <button onClick={() => handleDelete(item._id)} style={{ padding: '5px 10px', backgroundColor: '#d9534f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* TAB 5: REPORTS */}
                {activeTab === 'reports' && (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
                                <h3 style={{ margin: 0, marginRight: 'auto' }}>Reports</h3>
                                <label style={{ fontSize: '14px', fontWeight: 'bold' }}>From:</label>
                                <input type="date" value={reportFrom} onChange={(e) => setReportFrom(e.target.value)} style={{ padding: '6px' }} />
                                <label style={{ fontSize: '14px', fontWeight: 'bold' }}>To:</label>
                                <input type="date" value={reportTo} onChange={(e) => setReportTo(e.target.value)} style={{ padding: '6px' }} />
                                <button onClick={() => { setReportFrom(''); setReportTo(''); }} style={{ padding: '7px 12px', border: '1px solid #ccc', backgroundColor: '#fff', borderRadius: '4px', cursor: 'pointer' }}>Clear</button>
                                <button onClick={downloadCSV} style={{ padding: '7px 12px', border: 'none', backgroundColor: '#28a745', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>Download CSV</button>
                                <button onClick={() => window.print()} style={{ padding: '7px 12px', border: 'none', backgroundColor: '#003366', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>Print</button>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '18px' }}>
                                {[
                                    { label: 'Total Bookings', value: reportBookings.length, color: '#003366' },
                                    { label: 'Pending', value: countBy(reportBookings, 'Pending'), color: 'orange' },
                                    { label: 'In Use (Not Returned)', value: countBy(reportBookings, 'Accepted'), color: 'green' },
                                    { label: 'Returned', value: countBy(reportBookings, 'Returned'), color: '#6c757d' },
                                    { label: 'Rejected', value: countBy(reportBookings, 'Rejected'), color: 'red' },
                                    { label: 'Cancelled', value: countBy(reportBookings, 'Cancelled'), color: '#a94442' }
                                ].map((c) => (
                                    <div key={c.label} style={{ flex: '1 1 140px', border: '1px solid #e3e3e3', borderTop: `4px solid ${c.color}`, borderRadius: '6px', padding: '12px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '26px', fontWeight: 'bold', color: c.color }}>{c.value}</div>
                                        <div style={{ fontSize: '13px', color: '#555' }}>{c.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
                            <h3 style={{ marginTop: 0 }}>Equipment-wise Report</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f1f1f1', textAlign: 'left' }}>
                                        <th style={cell}>Equipment</th>
                                        <th style={cell}>ID</th>
                                        <th style={cell}>Total Bookings</th>
                                        <th style={cell}>In Use</th>
                                        <th style={cell}>Returned</th>
                                        <th style={cell}>Available / Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {equipmentReport.map((r) => (
                                        <tr key={r.key} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={cell}>{r.name}</td>
                                            <td style={cell}>{r.code}</td>
                                            <td style={cell}>{r.total}</td>
                                            <td style={cell}>{r.inUse}</td>
                                            <td style={cell}>{r.returned}</td>
                                            <td style={cell}>{r.available} / {r.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
                            <h3 style={{ marginTop: 0 }}>Student-wise Report</h3>
                            {studentReport.length === 0 ? (
                                <p style={{ color: '#666' }}>No bookings in the selected period.</p>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#f1f1f1', textAlign: 'left' }}>
                                            <th style={cell}>Student</th>
                                            <th style={cell}>ID Number</th>
                                            <th style={cell}>Total Bookings</th>
                                            <th style={cell}>Not Returned</th>
                                            <th style={cell}>Returned</th>
                                            <th style={cell}>Cancelled</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {studentReport.map((s) => (
                                            <tr key={s.key} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={cell}>{s.name}</td>
                                                <td style={cell}>{s.id}</td>
                                                <td style={cell}>{s.total}</td>
                                                <td style={{ ...cell, color: s.inUse > 0 ? '#d9534f' : 'inherit', fontWeight: s.inUse > 0 ? 'bold' : 'normal' }}>{s.inUse}</td>
                                                <td style={cell}>{s.returned}</td>
                                                <td style={cell}>{s.cancelled}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 4: ALL BOOKING REQUESTS */}
                {activeTab === 'requests' && (
                    <div style={{ width: '100%', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
                        <h3>All Booking Requests</h3>

                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                            <span style={{ color: 'green', fontWeight: 'bold' }}>In use (not returned): {notReturnedCount}</span>
                            <span style={{ color: '#6c757d', fontWeight: 'bold' }}>Returned: {returnedCount}</span>
                            <span style={{ color: 'orange', fontWeight: 'bold' }}>Pending: {pendingCount}</span>
                            <div style={{ marginLeft: 'auto' }}>
                                <label style={{ marginRight: '8px', fontWeight: 'bold', fontSize: '14px' }}>Filter:</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    style={{ padding: '6px', border: '1px solid #ccc', borderRadius: '4px' }}
                                >
                                    <option value="All">All</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Accepted">Accepted - Not Returned</option>
                                    <option value="Returned">Returned</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        {filteredBookings.length === 0 ? (
                            <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>No booking requests found.</p>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#f1f1f1', textAlign: 'left' }}>
                                            <th style={{ padding: '10px' }}>Student</th>
                                            <th style={{ padding: '10px' }}>ID Number</th>
                                            <th style={{ padding: '10px' }}>Equipment</th>
                                            <th style={{ padding: '10px' }}>Date</th>
                                            <th style={{ padding: '10px' }}>Time Slot</th>
                                            <th style={{ padding: '10px' }}>Purpose</th>
                                            <th style={{ padding: '10px' }}>Status</th>
                                            <th style={{ padding: '10px' }}>Return Status</th>
                                            <th style={{ padding: '10px' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredBookings.map((b) => (
                                            <tr key={b._id} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '10px' }}>{b.studentName}</td>
                                                <td style={{ padding: '10px' }}>{b.studentIdNumber}</td>
                                                <td style={{ padding: '10px' }}>{b.equipmentName || 'Equipment'}</td>
                                                <td style={{ padding: '10px' }}>{b.date}</td>
                                                <td style={{ padding: '10px' }}>{b.timeSlot}</td>
                                                <td style={{ padding: '10px' }}>{b.purpose}</td>
                                                <td style={{ padding: '10px', fontWeight: 'bold', color: b.status === 'Accepted' ? 'green' : b.status === 'Rejected' ? 'red' : b.status === 'Returned' ? '#6c757d' : b.status === 'Cancelled' ? '#a94442' : 'orange' }}>
                                                    {b.status || 'Pending'}
                                                </td>
                                                <td style={{ padding: '10px' }}>
                                                    {b.status === 'Returned' ? (
                                                        <span style={{ color: '#28a745', fontWeight: 'bold' }}>
                                                            ✔ Returned
                                                            {b.returnedAt && (
                                                                <span style={{ display: 'block', color: '#666', fontWeight: 'normal', fontSize: '12px' }}>
                                                                    {formatDateTime(b.returnedAt)}
                                                                </span>
                                                            )}
                                                        </span>
                                                    ) : b.status === 'Accepted' ? (
                                                        <span style={{ color: '#d9534f', fontWeight: 'bold' }}>✘ Not Returned</span>
                                                    ) : (
                                                        <span style={{ color: '#999' }}>-</span>
                                                    )}
                                                </td>
                                                <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>
                                                    {isPending(b) ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleStatusChange(b._id, 'Accepted')}
                                                                style={{ padding: '5px 10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '6px' }}
                                                            >
                                                                Accept
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusChange(b._id, 'Rejected')}
                                                                style={{ padding: '5px 10px', backgroundColor: '#d9534f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span style={{ color: '#666' }}>Done</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminDashboard;