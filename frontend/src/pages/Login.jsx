import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react'; // పాస్‌వర్డ్ ఐకాన్స్ కోసం

import headImg from '../assets/loginimghead.jpg';
import bannerImg from '../assets/loginimg.jpg';

const Login = () => {
    const navigate = useNavigate();

    // Student Login States
    const [studentUsername, setStudentUsername] = useState('');
    const [studentPassword, setStudentPassword] = useState('');
    const [showStudentPassword, setShowStudentPassword] = useState(false); // Student Eye State

    // Employee Login States
    const [employeeUsername, setEmployeeUsername] = useState('');
    const [employeePassword, setEmployeePassword] = useState('');
    const [showEmployeePassword, setShowEmployeePassword] = useState(false); // Employee Eye State

    // 1. Student Login Handler
    const handleStudentLogin = async (e) => {
        e.preventDefault();
        try {
            // FIX: backend expects "userId" (not "username") and the role
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                userId: studentUsername.trim(),
                password: studentPassword,
                role: 'student'
            });

            sessionStorage.setItem('userToken', response.data.token);
            sessionStorage.setItem('userInfo', JSON.stringify(response.data.user));

            alert('Student Login Successful!');
            navigate('/student-dashboard');
        } catch (error) {
            alert(error.response?.data?.message || 'Invalid Student Credentials!');
        }
    };

    // 2. Employee / Admin Login Handler
    const handleEmployeeLogin = async (e) => {
        e.preventDefault();
        try {
            // FIX: backend expects "userId" (not "username") and the role
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                userId: employeeUsername.trim(),
                password: employeePassword,
                role: 'admin'
            });

            sessionStorage.setItem('userToken', response.data.token);
            sessionStorage.setItem('userInfo', JSON.stringify(response.data.user));

            alert('Employee Login Successful!');
            navigate('/admin-dashboard');
        } catch (error) {
            alert(error.response?.data?.message || 'Invalid Employee Credentials!');
        }
    };

    return (
        <div style={{
            fontFamily: 'Verdana, Arial, sans-serif',
            backgroundColor: '#cbdbe8',
            minHeight: '100vh',
            margin: 0,
            padding: '0 0 20px 0'
        }}>

            {/* Main Centered Container */}
            <div style={{
                maxWidth: '1000px',
                margin: '0 auto',
                backgroundColor: '#ffffff',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                borderLeft: '1px solid #a4b9d0',
                borderRight: '1px solid #a4b9d0'
            }}>
                {/* Top Header Row with Logo and Home Button */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 20px',
                    backgroundColor: '#ffffff'
                }}>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <img
                            src={headImg}
                            alt="Sri Vasavi Engineering College Header"
                            style={{ maxWidth: '95%', height: 'auto', display: 'block', margin: '0 auto' }}
                        />
                    </div>

                    <Link
                        to="/"
                        style={{
                            backgroundColor: '#002b5b',
                            color: '#ffffff',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            textDecoration: 'none',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <span>🏠</span> Home
                    </Link>
                </div>

                {/* Campus Photo Banner */}
                <div style={{ width: '100%', overflow: 'hidden' }}>
                    <img
                        src={bannerImg}
                        alt="Vasavi Campus Banner"
                        style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
                    />
                </div>

                {/* Project Title Bar */}
                <div style={{
                    backgroundColor: '#002b5b',
                    color: '#ffffff',
                    textAlign: 'center',
                    padding: '10px 15px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    borderBottom: '3px solid #f0a500'
                }}>
                    LABORATORY EQUIPMENT BOOKING PORTAL
                </div>

                {/* Main Login Content Area */}
                <div style={{
                    backgroundColor: '#eaf2f8',
                    padding: '25px',
                    margin: '20px 25px',
                    border: '1px solid #b2c8de',
                    borderRadius: '4px'
                }}>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '40px',
                        flexWrap: 'wrap'
                    }}>

                        {/* --- Student Login Card --- */}
                        <div style={{
                            width: '380px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #82b1ff',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.08)'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #5ba4e6 0%, #1d5cb0 100%)',
                                padding: '10px 15px',
                                color: '#ffffff',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                fontSize: '14px'
                            }}>
                                Student Login
                            </div>
                            <form onSubmit={handleStudentLogin} style={{ padding: '20px' }}>
                                <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                                    <label style={{ width: '100px', fontSize: '14px', color: '#cc0000', fontWeight: 'bold' }}>User Id :</label>
                                    <input
                                        type="text"
                                        value={studentUsername}
                                        onChange={(e) => setStudentUsername(e.target.value)}
                                        required
                                        style={{ flex: 1, padding: '6px 8px', fontSize: '12px', border: '1px solid #a6b9d0', borderRadius: '3px' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                                    <label style={{ width: '100px', fontSize: '14px', color: '#cc0000', fontWeight: 'bold' }}>Password :</label>
                                    <div style={{ flex: 1, position: 'relative' }}>
                                        <input
                                            type={showStudentPassword ? 'text' : 'password'}
                                            value={studentPassword}
                                            onChange={(e) => setStudentPassword(e.target.value)}
                                            required
                                            style={{ width: '100%', padding: '6px 32px 6px 8px', fontSize: '12px', border: '1px solid #a6b9d0', borderRadius: '3px', boxSizing: 'border-box' }}
                                        />
                                        <span
                                            onClick={() => setShowStudentPassword(!showStudentPassword)}
                                            style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#555', display: 'flex', alignItems: 'center' }}
                                        >
                                            {showStudentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                    <button
                                        type="submit"
                                        style={{
                                            backgroundColor: '#002b5b',
                                            color: '#ffffff',
                                            border: 'none',
                                            padding: '6px 20px',
                                            fontSize: '11px',
                                            fontWeight: 'bold',
                                            borderRadius: '3px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        LOGIN
                                    </button>
                                </div>

                                <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
                                    New Student? <Link to="/register" style={{ color: '#003366', fontWeight: 'bold' }}>Register here</Link>
                                </div>
                            </form>
                        </div>


                        {/* --- Employee / Admin Login Card --- */}
                        <div style={{
                            width: '380px',
                            backgroundColor: '#ffffff',
                            border: '1px solid #82b1ff',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.08)'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #5ba4e6 0%, #1d5cb0 100%)',
                                padding: '10px 15px',
                                color: '#ffffff',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                fontSize: '14px'
                            }}>
                                Employee / Admin Login
                            </div>

                            <form onSubmit={handleEmployeeLogin} style={{ padding: '20px' }}>
                                <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                                    <label style={{ width: '100px', fontSize: '14px', color: '#cc0000', fontWeight: 'bold' }}>User Id :</label>
                                    <input
                                        type="text"
                                        value={employeeUsername}
                                        onChange={(e) => setEmployeeUsername(e.target.value)}
                                        required
                                        style={{ flex: 1, padding: '6px 8px', fontSize: '12px', border: '1px solid #a6b9d0', borderRadius: '3px' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
                                    <label style={{ width: '100px', fontSize: '14px', color: '#cc0000', fontWeight: 'bold' }}>Password :</label>
                                    <div style={{ flex: 1, position: 'relative' }}>
                                        <input
                                            type={showEmployeePassword ? 'text' : 'password'}
                                            value={employeePassword}
                                            onChange={(e) => setEmployeePassword(e.target.value)}
                                            required
                                            style={{ width: '100%', padding: '6px 32px 6px 8px', fontSize: '12px', border: '1px solid #a6b9d0', borderRadius: '3px', boxSizing: 'border-box' }}
                                        />
                                        <span
                                            onClick={() => setShowEmployeePassword(!showEmployeePassword)}
                                            style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#555', display: 'flex', alignItems: 'center' }}
                                        >
                                            {showEmployeePassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                    <button
                                        type="submit"
                                        style={{
                                            backgroundColor: '#002b5b',
                                            color: '#ffffff',
                                            border: 'none',
                                            padding: '6px 20px',
                                            fontSize: '11px',
                                            fontWeight: 'bold',
                                            borderRadius: '3px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        LOGIN
                                    </button>
                                </div>

                                <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
                                    New Faculty? <Link to="/register" style={{ color: '#003366', fontWeight: 'bold' }}>Register here</Link>
                                </div>
                            </form>
                        </div>

                    </div>

                </div>

                {/* Footer */}
                <div style={{
                    backgroundColor: '#9bc2e6',
                    color: '#003366',
                    textAlign: 'center',
                    padding: '6px 0',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    borderTop: '1px solid #82a8d8'
                }}>
                    Copyright © All rights reserved by SRI VASAVI ENGINEERING COLLEGE (Autonomous), Tadepalligudem
                </div>

            </div>
        </div>
    );
};

export default Login;