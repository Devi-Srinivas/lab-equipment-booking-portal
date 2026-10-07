const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/Authguard');
const {
    getEquipment,
    addEquipment,
    updateEquipment,
    deleteEquipment
} = require('../controllers/equipmentController');

// Any logged-in user (sees only their own department's equipment)
router.get('/', protect, getEquipment);

// Admin only (own department only)
router.post('/', protect, adminOnly, addEquipment);
router.put('/:id', protect, adminOnly, updateEquipment);
router.delete('/:id', protect, adminOnly, deleteEquipment);

module.exports = router;