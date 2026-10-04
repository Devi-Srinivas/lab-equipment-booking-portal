import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 30px', backgroundColor: '#333', color: '#fff' }}>
            <div>
                <Link to="/" style={{ color: '#fff', marginRight: '20px', textDecoration: 'none', fontWeight: 'bold' }}>Home</Link>
                {!user && (
                    <>
                        <Link to="/login" style={{ color: '#fff', marginRight: '15px', textDecoration: 'none' }}>Login</Link>
                        <Link to="/register" style={{ color: '#fff', textDecoration: 'none' }}>Register</Link>
                    </>
                )}
            </div>
            {user && (
                <div>
                    <span style={{ marginRight: '15px' }}>Logged in as: <strong>{user.email} ({user.role})</strong></span>
                    <button onClick={onLogout} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '3px' }}>Logout</button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;