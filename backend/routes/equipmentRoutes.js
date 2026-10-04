const express = require('express');
const router = express.Router();
const Equipment = require('../models/equipment');

// 1. Add Equipment
router.post('/', async (req, res) => {
    try {
        const { equipmentName, equipmentId, department, totalQuantity, labNumber } = req.body;

        const existing = await Equipment.findOne({ equipmentId });
        if (existing) {
            return res.status(400).json({ message: 'Equipment ID already exists!' });
        }

        const newEquipment = new Equipment({
            equipmentName,
            equipmentId,
            department,
            totalQuantity,
            availableQuantity: totalQuantity,
            labNumber
        });

        await newEquipment.save();
        res.status(201).json({ success: true, message: 'Equipment added successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Get All Equipments
router.get('/', async (routerReq, res) => {
    try {
        const equipments = await Equipment.find();
        res.status(200).json(equipments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Update Equipment by ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { equipmentName, equipmentId, department, totalQuantity, labNumber } = req.body;

        // Find existing equipment first to calculate available quantity difference
        const existingEquipment = await Equipment.findById(id);
        if (!existingEquipment) {
            return res.status(404).json({ message: 'Equipment not found' });
        }

        // Calculate new available quantity if totalQuantity is changed
        let availableQuantity = existingEquipment.availableQuantity;
        if (totalQuantity !== undefined) {
            const difference = totalQuantity - existingEquipment.totalQuantity;
            availableQuantity = existingEquipment.availableQuantity + difference;
            if (availableQuantity < 0) availableQuantity = 0; // Safeguard
        }

        const updatedData = {
            equipmentName: equipmentName || existingEquipment.equipmentName,
            equipmentId: equipmentId || existingEquipment.equipmentId,
            department: department || existingEquipment.department,
            totalQuantity: totalQuantity !== undefined ? totalQuantity : existingEquipment.totalQuantity,
            availableQuantity: availableQuantity,
            labNumber: labNumber || existingEquipment.labNumber
        };

        const updatedEquipment = await Equipment.findByIdAndUpdate(id, updatedData, { new: true });

        res.status(200).json({ success: true, message: 'Equipment updated successfully!', data: updatedEquipment });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Delete Equipment by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEquipment = await Equipment.findByIdAndDelete(id);

        if (!deletedEquipment) {
            return res.status(404).json({ message: 'Equipment not found' });
        }

        res.status(200).json({ success: true, message: 'Equipment deleted successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;