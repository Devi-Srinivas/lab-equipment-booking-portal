import React from 'react';
import { Routes, Route } from 'react-router-dom';

// pages ఫోల్డర్ నుండి సరైన పాత్ తో ఇంపోర్ట్ చేయడం
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
    return (
        <Routes>
            {/* వెబ్‌సైట్ ఓపెన్ చేయగానే హోమ్ పేజీ వచ్చేలా */}
            <Route path="/" element={<Home />} />

            {/* ఇతర పేజీల రౌట్స్ */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
    );
}

export default App;