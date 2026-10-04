const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();
const ADMIN_ID = /^t-[a-z]{2,6}-\d{1,3}$/i; // example: t-cse-13

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { userId, name, email, department, role, password } = req.body;

        if (!userId || !name || !email || !password) {
            return res.status(400).json({ message: 'ID, name, email and password are required.' });
        }

        const id = String(userId).trim().toLowerCase();
        const userRole = role === 'admin' ? 'admin' : 'student';

        if (userRole === 'admin' && !ADMIN_ID.test(id)) {
            return res.status(400).json({ message: 'Admin ID should look like t-cse-13.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters.' });
        }

        const exists = await User.findOne({ $or: [{ userId: id }, { email: email.trim().toLowerCase() }] });
        if (exists) {
            return res.status(409).json({ message: 'A user with this ID or email already exists.' });
        }

        const hashed = await bcrypt.hash(password, 10);
        await User.create({
            userId: id,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            department,
            role: userRole,
            password: hashed,
        });

        res.status(201).json({ message: 'Registered successfully.' });
    } catch (err) {
        console.error('Register error:', err);
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern || err.keyValue || {})[0] || 'field';
            return res.status(409).json({ message: `Duplicate value for "${field}". An old database index may be the cause.` });
        }
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        // Accept the ID as `userId` (new) or `username` (what older login pages send)
        const { userId, username, password, role } = req.body;
        const loginId = String(userId || username || '').trim().toLowerCase();

        if (!loginId || !password) {
            return res.status(400).json({ message: 'ID and password are required.' });
        }

        const user = await User.findOne({ userId: loginId });
        if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Wrong ID or password.' });
        }

        // Case-insensitive role check ('Admin' vs 'admin')
        if (role && String(user.role).toLowerCase() !== String(role).toLowerCase()) {
            return res.status(403).json({ message: `This is not a ${role} account. Use the other tab.` });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            user: {
                id: user._id,
                userId: user.userId,
                // Aliases used by the dashboards (Hi... name, and the student ID on bookings)
                username: user.name,
                idNumber: user.userId,
                name: user.name,
                email: user.email,
                department: user.department,
                role: user.role,
            },
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
});

module.exports = router;