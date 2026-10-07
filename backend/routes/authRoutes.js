const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user');
const sendEmail = require('../utils/sendEmail');

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
        const { userId, password, role } = req.body;
        if (!userId || !password) {
            return res.status(400).json({ message: 'ID and password are required.' });
        }

        const user = await User.findOne({ userId: String(userId).trim().toLowerCase() });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Wrong ID or password.' });
        }
        if (role && user.role !== role) {
            return res.status(403).json({ message: `This is not a ${role} account. Use the other tab.` });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            user: {
                id: user._id,
                userId: user.userId,
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

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const sha256 = (text) => crypto.createHash('sha256').update(text).digest('hex');

// POST /api/auth/forgot-password   body: { email }
router.post('/forgot-password', async (req, res) => {
    try {
        const email = String(req.body.email || '').trim().toLowerCase();
        if (!email) return res.status(400).json({ message: 'Email is required.' });

        const user = await User.findOne({ email });
        if (user) {
            const token = crypto.randomBytes(32).toString('hex');
            user.resetPasswordToken = sha256(token);
            user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
            await user.save();

            const link = `${CLIENT_URL}/reset-password/${token}`;
            // Not awaited: the page gets its answer at once and the email is sent in the background
            sendEmail({
                to: user.email,
                subject: 'Reset your Lab Equipment Portal password',
                text: `Hello ${user.name},\n\nOpen this link to set a new password (valid for 15 minutes):\n${link}\n\nIf you did not ask for this, ignore this email.`,
                html: `<p>Hello ${user.name},</p><p>Click the button to set a new password. The link works for 15 minutes.</p><p><a href="${link}" style="background:#d95500;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:bold">Reset password</a></p><p>If you did not ask for this, ignore this email.</p>`,
            }).catch((e) => console.error('Reset email failed:', e.message));
        }
        // Same answer whether or not the email exists (so nobody can check who is registered)
        res.json({ message: 'If an account exists for this email, a reset link has been sent.' });
    } catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json({ message: 'Could not send the reset email. Please try again later.' });
    }
});

// POST /api/auth/reset-password/:token   body: { password }
router.post('/reset-password/:token', async (req, res) => {
    try {
        const { password } = req.body;
        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters.' });
        }

        const user = await User.findOne({
            resetPasswordToken: sha256(req.params.token),
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ message: 'This reset link is invalid or has expired.' });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password updated. You can log in now.' });
    } catch (err) {
        console.error('Reset password error:', err);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
});

module.exports = router;