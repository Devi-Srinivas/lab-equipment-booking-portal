const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Requires a valid login token. Puts the logged-in user on req.user.
exports.protect = async (req, res, next) => {
    try {
        const header = req.headers.authorization || '';
        const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;

        if (!token) {
            return res.status(401).json({ message: 'Not logged in. Please log in first.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Always read the role from the database, not from the request
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'This account no longer exists.' });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired login. Please log in again.' });
    }
};

// Only allows users whose role is admin. Use after protect.
exports.adminOnly = (req, res, next) => {
    if (!req.user || String(req.user.role).toLowerCase() !== 'admin') {
        return res.status(403).json({ message: 'Admin access required.' });
    }
    next();
};