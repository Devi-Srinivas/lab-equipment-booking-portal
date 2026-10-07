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

// Defined outside the component so inputs keep focus while typing
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

const QtyCell = ({ item }) => {
    const total = Number(item.totalQuantity) || 0;
    const avail = Number(item.availableQuantity) || 0;
    const pct = total > 0 ? Math.min(100, Math.round((avail / total) * 100)) : 0;
    const tone = pct > 50 ? 'ok' : pct > 20 ? 'mid' : 'low';
    return (
        <div className="ad-qty">
            <span>{avail} / {total}</span>
            <div className="ad-bar"><i className={tone} style={{ width: `${pct}%` }} /></div>
        </div>
    );
};

const DEPT_OPTIONS = ['Computer Science (CSE)', 'Electrical (EEE)', 'Mechanical (MECH)', 'Electronics (ECE)'];

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

    const TABS = [
        { id: 'add', label: 'Add Equipment' },
        { id: 'update', label: 'Update Equipment' },
        { id: 'delete', label: 'Delete Equipment', danger: true },
        { id: 'requests', label: 'All Booking Requests', badge: pendingCount },
        { id: 'reports', label: 'Reports' }
    ];

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
                    <span className="ad-avatar">{String(username).charAt(0).toUpperCase()}</span>
                    <span>Hi... {username}</span>
                    <button type="button" className="ad-logout" onClick={handleLogout}>Logout</button>
                </div>
            </div>

            {/* Navigation */}
            <div className="ad-nav">
                {TABS.map((t) => (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => setActiveTab(t.id)}
                        className={`ad-tab${t.danger ? ' danger' : ''}${activeTab === t.id ? ' active' : ''}`}
                    >
                        {t.label}
                        {t.badge !== undefined && (
                            <span className={`ad-badge${t.badge === 0 ? ' zero' : ''}`} title="Pending requests">{t.badge}</span>
                        )}
                    </button>
                ))}
            </div>

            <div className="ad-main">

                {/* TAB 1: ADD EQUIPMENT */}
                {activeTab === 'add' && (
                    <>
                        <div className="ad-col">
                            <div className="ad-card">
                                <h3>Add New Equipment</h3>
                                <p className="ad-sub">Enter the details of the new lab equipment.</p>
                                <form onSubmit={handleAddSubmit}>
                                    <Field label="Equipment Name">
                                        <input className="ad-input" type="text" name="equipmentName" value={formData.equipmentName} onChange={handleChange} required placeholder="e.g. Projector" />
                                    </Field>
                                    <Field label="Equipment ID / Code">
                                        <input className="ad-input" type="text" name="equipmentId" value={formData.equipmentId} onChange={handleChange} required placeholder="e.g. p-101" />
                                    </Field>
                                    <Field label="Department">
                                        <select className="ad-input" name="department" value={formData.department} onChange={handleChange}>
                                            {DEPT_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </Field>
                                    <Field label="Total Quantity">
                                        <input className="ad-input" type="number" name="totalQuantity" value={formData.totalQuantity} onChange={handleChange} required placeholder="e.g. 10" />
                                    </Field>
                                    <Field label="Lab Number / Room">
                                        <input className="ad-input" type="text" name="labNumber" value={formData.labNumber} onChange={handleChange} required placeholder="e.g. g-301" />
                                    </Field>
                                    <button type="submit" className="ad-btn">Add Equipment</button>
                                </form>
                            </div>
                        </div>
                        <div className="ad-col wide">
                            <div className="ad-card">
                                <h3>Available Equipments</h3>
                                <p className="ad-sub">Bar shows how much stock is currently free.</p>
                                {equipmentList.length === 0 ? (
                                    <div className="ad-empty">No equipment added yet. Use the form to add your first item.</div>
                                ) : (
                                    <div className="ad-scroll">
                                        <table className="ad-table">
                                            <thead>
                                                <tr><th>Name</th><th>ID</th><th>Dept</th><th>Available / Total</th><th>Lab</th></tr>
                                            </thead>
                                            <tbody>
                                                {equipmentList.map((item) => (
                                                    <tr key={item._id}>
                                                        <td className="ad-strong">{item.equipmentName || item.name}</td>
                                                        <td className="ad-muted">{item.equipmentId}</td>
                                                        <td>{item.department}</td>
                                                        <td><QtyCell item={item} /></td>
                                                        <td>{item.labNumber}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* TAB 2: UPDATE EQUIPMENT */}
                {activeTab === 'update' && (
                    <>
                        <div className="ad-col">
                            <div className="ad-card">
                                <h3>Update Equipment Details</h3>
                                {selectedEquipment ? (
                                    <>
                                        <p className="ad-sub">Editing: {selectedEquipment.equipmentName || selectedEquipment.name}</p>
                                        <form onSubmit={handleUpdateSubmit}>
                                            <Field label="Equipment Name">
                                                <input className="ad-input" type="text" name="equipmentName" value={formData.equipmentName} onChange={handleChange} required />
                                            </Field>
                                            <Field label="Total Quantity">
                                                <input className="ad-input" type="number" name="totalQuantity" value={formData.totalQuantity} onChange={handleChange} required />
                                            </Field>
                                            <Field label="Lab Number">
                                                <input className="ad-input" type="text" name="labNumber" value={formData.labNumber} onChange={handleChange} required />
                                            </Field>
                                            <button type="submit" className="ad-btn amber">Save Changes</button>
                                        </form>
                                    </>
                                ) : (
                                    <div className="ad-empty">Select an equipment from the table to update it.</div>
                                )}
                            </div>
                        </div>
                        <div className="ad-col wide">
                            <div className="ad-card">
                                <h3>Select Equipment to Update</h3>
                                <p className="ad-sub">Choose an item to load its details into the form.</p>
                                <div className="ad-scroll">
                                    <table className="ad-table">
                                        <thead>
                                            <tr><th>Name</th><th>ID</th><th>Action</th></tr>
                                        </thead>
                                        <tbody>
                                            {equipmentList.map((item) => (
                                                <tr key={item._id}>
                                                    <td className="ad-strong">{item.equipmentName || item.name}</td>
                                                    <td className="ad-muted">{item.equipmentId}</td>
                                                    <td><button type="button" className="ad-btn-sm amber" onClick={() => handleSelectForUpdate(item)}>Edit</button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* TAB 3: DELETE EQUIPMENT */}
                {activeTab === 'delete' && (
                    <div className="ad-stack">
                        <div className="ad-card">
                            <h3>Manage and Delete Equipment</h3>
                            <p className="ad-sub">Deleting an item removes it permanently.</p>
                            {equipmentList.length === 0 ? (
                                <div className="ad-empty">There is no equipment to delete.</div>
                            ) : (
                                <div className="ad-scroll">
                                    <table className="ad-table">
                                        <thead>
                                            <tr><th>Name</th><th>ID</th><th>Dept</th><th>Action</th></tr>
                                        </thead>
                                        <tbody>
                                            {equipmentList.map((item) => (
                                                <tr key={item._id}>
                                                    <td className="ad-strong">{item.equipmentName || item.name}</td>
                                                    <td className="ad-muted">{item.equipmentId}</td>
                                                    <td>{item.department}</td>
                                                    <td><button type="button" className="ad-btn-sm red" onClick={() => handleDelete(item._id)}>Delete</button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 4: ALL BOOKING REQUESTS */}
                {activeTab === 'requests' && (
                    <div className="ad-stack">
                        <div className="ad-card">
                            <div className="ad-bar-row">
                                <h3 className="grow" style={{ margin: 0 }}>All Booking Requests</h3>
                                <span className="ad-chipstat"><i style={{ background: GREEN }} />In use: {notReturnedCount}</span>
                                <span className="ad-chipstat"><i style={{ background: '#9fb0a3' }} />Returned: {returnedCount}</span>
                                <span className="ad-chipstat"><i style={{ background: '#ffd166' }} />Pending: {pendingCount}</span>
                                <select className="ad-input ad-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status">
                                    <option value="All">All</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Accepted">Accepted - Not Returned</option>
                                    <option value="Returned">Returned</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>

                            {filteredBookings.length === 0 ? (
                                <div className="ad-empty">No booking requests found.</div>
                            ) : (
                                <div className="ad-scroll" style={{ marginTop: 18 }}>
                                    <table className="ad-table">
                                        <thead>
                                            <tr>
                                                <th>Student</th><th>ID Number</th><th>Equipment</th><th>Date</th><th>Time Slot</th>
                                                <th>Purpose</th><th>Status</th><th>Return Status</th><th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredBookings.map((b) => (
                                                <tr key={b._id}>
                                                    <td className="ad-strong">{b.studentName}</td>
                                                    <td className="ad-muted">{b.studentIdNumber}</td>
                                                    <td>{b.equipmentName || 'Equipment'}</td>
                                                    <td>{b.date}</td>
                                                    <td>{b.timeSlot}</td>
                                                    <td>{b.purpose}</td>
                                                    <td><span className={`ad-pill ${statusClass(b.status)}`}>{b.status || 'Pending'}</span></td>
                                                    <td>
                                                        {b.status === 'Returned' ? (
                                                            <span className="ad-ret-ok">
                                                                ✔ Returned
                                                                {b.returnedAt && <span className="ad-ret-time">{formatDateTime(b.returnedAt)}</span>}
                                                            </span>
                                                        ) : b.status === 'Accepted' ? (
                                                            <span className="ad-ret-no">✘ Not Returned</span>
                                                        ) : (
                                                            <span className="ad-muted">-</span>
                                                        )}
                                                    </td>
                                                    <td style={{ whiteSpace: 'nowrap' }}>
                                                        {isPending(b) ? (
                                                            <>
                                                                <button type="button" className="ad-btn-sm green" onClick={() => handleStatusChange(b._id, 'Accepted')}>Accept</button>
                                                                <button type="button" className="ad-btn-sm red" onClick={() => handleStatusChange(b._id, 'Rejected')}>Reject</button>
                                                            </>
                                                        ) : (
                                                            <span className="ad-muted">Done</span>
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

                {/* TAB 5: REPORTS */}
                {activeTab === 'reports' && (
                    <div className="ad-stack">
                        <div className="ad-card">
                            <div className="ad-bar-row">
                                <h3 className="grow" style={{ margin: 0 }}>Reports</h3>
                                <label className="ad-label" style={{ margin: 0 }}>From</label>
                                <input className="ad-input ad-date" type="date" value={reportFrom} onChange={(e) => setReportFrom(e.target.value)} />
                                <label className="ad-label" style={{ margin: 0 }}>To</label>
                                <input className="ad-input ad-date" type="date" value={reportTo} onChange={(e) => setReportTo(e.target.value)} />
                                <button type="button" className="ad-btn-sm ghost no-print" onClick={() => { setReportFrom(''); setReportTo(''); }}>Clear</button>
                                <button type="button" className="ad-btn-sm green no-print" onClick={downloadCSV}>Download CSV</button>
                                <button type="button" className="ad-btn-sm ghost no-print" onClick={() => window.print()}>Print</button>
                            </div>

                            <div className="ad-stats">
                                {[
                                    { label: 'Total Bookings', value: reportBookings.length, color: '#e8f3ea' },
                                    { label: 'Pending', value: countBy(reportBookings, 'Pending'), color: '#ffd166' },
                                    { label: 'In Use (Not Returned)', value: countBy(reportBookings, 'Accepted'), color: GREEN },
                                    { label: 'Returned', value: countBy(reportBookings, 'Returned'), color: '#9fb0a3' },
                                    { label: 'Rejected', value: countBy(reportBookings, 'Rejected'), color: '#ff7b7b' },
                                    { label: 'Cancelled', value: countBy(reportBookings, 'Cancelled'), color: '#ff9a6b' }
                                ].map((c) => (
                                    <div key={c.label} className="ad-stat" style={{ borderTopColor: c.color }}>
                                        <b style={{ color: c.color }}>{c.value}</b>
                                        <span>{c.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="ad-card">
                            <h3>Equipment-wise Report</h3>
                            <p className="ad-sub">Bookings in the selected period, per equipment.</p>
                            <div className="ad-scroll">
                                <table className="ad-table">
                                    <thead>
                                        <tr><th>Equipment</th><th>ID</th><th>Total Bookings</th><th>In Use</th><th>Returned</th><th>Available / Total</th></tr>
                                    </thead>
                                    <tbody>
                                        {equipmentReport.map((r) => (
                                            <tr key={r.key}>
                                                <td className="ad-strong">{r.name}</td>
                                                <td className="ad-muted">{r.code}</td>
                                                <td>{r.total}</td>
                                                <td>{r.inUse}</td>
                                                <td>{r.returned}</td>
                                                <td>{r.available} / {r.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="ad-card">
                            <h3>Student-wise Report</h3>
                            <p className="ad-sub">Red numbers mean equipment still not returned.</p>
                            {studentReport.length === 0 ? (
                                <div className="ad-empty">No bookings in the selected period.</div>
                            ) : (
                                <div className="ad-scroll">
                                    <table className="ad-table">
                                        <thead>
                                            <tr><th>Student</th><th>ID Number</th><th>Total Bookings</th><th>Not Returned</th><th>Returned</th><th>Cancelled</th></tr>
                                        </thead>
                                        <tbody>
                                            {studentReport.map((s) => (
                                                <tr key={s.key}>
                                                    <td className="ad-strong">{s.name}</td>
                                                    <td className="ad-muted">{s.id}</td>
                                                    <td>{s.total}</td>
                                                    <td style={{ color: s.inUse > 0 ? '#ff7b7b' : 'inherit', fontWeight: s.inUse > 0 ? 800 : 400 }}>{s.inUse}</td>
                                                    <td>{s.returned}</td>
                                                    <td>{s.cancelled}</td>
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

export default AdminDashboard;