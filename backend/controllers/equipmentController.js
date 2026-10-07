const Equipment = require('../models/equipment');
const Booking = require('../models/booking');

const sameDepartment = (a, b) => !!a && !!b && String(a).trim() === String(b).trim();

// GET /api/equipment
// Students and admins only get equipment from their OWN department.
exports.getEquipment = async (req, res) => {
    try {
        if (!req.user.department) {
            return res.status(403).json({ message: 'Your account has no department assigned.' });
        }

        const list = await Equipment.find({ department: req.user.department }).sort({ equipmentName: 1 });
        res.status(200).json(list);
    } catch (error) {
        console.error('Get equipment error:', error);
        res.status(500).json({ message: error.message });
    }
};

// POST /api/equipment  (admin only)
// The department is always the admin's own department, whatever the browser sends.
exports.addEquipment = async (req, res) => {
    try {
        if (!req.user.department) {
            return res.status(403).json({ message: 'Your account has no department assigned.' });
        }

        const { equipmentName, equipmentId, totalQuantity, labNumber } = req.body;
        const total = Number(totalQuantity);

        if (!equipmentName || !equipmentId || !labNumber || !Number.isFinite(total) || total < 0) {
            return res.status(400).json({ message: 'Name, ID, quantity and lab number are required.' });
        }

        const equipment = await Equipment.create({
            equipmentName: String(equipmentName).trim(),
            equipmentId: String(equipmentId).trim(),
            department: req.user.department,
            totalQuantity: total,
            availableQuantity: total,
            labNumber: String(labNumber).trim()
        });

        res.status(201).json({ success: true, data: equipment });
    } catch (error) {
        console.error('Add equipment error:', error);
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Equipment with this ID already exists.' });
        }
        res.status(500).json({ message: error.message });
    }
};

// PUT /api/equipment/:id  (admin only, own department only)
exports.updateEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id);
        if (!equipment) {
            return res.status(404).json({ message: 'Equipment not found' });
        }
        if (!sameDepartment(equipment.department, req.user.department)) {
            return res.status(403).json({ message: 'This equipment belongs to another department' });
        }

        const { equipmentName, totalQuantity, labNumber } = req.body;

        if (equipmentName) equipment.equipmentName = String(equipmentName).trim();
        if (labNumber) equipment.labNumber = String(labNumber).trim();

        if (totalQuantity !== undefined && totalQuantity !== '') {
            const newTotal = Number(totalQuantity);
            if (!Number.isFinite(newTotal) || newTotal < 0) {
                return res.status(400).json({ message: 'Total quantity must be a valid number.' });
            }
            // Keep "available" in step with the change in total, never below zero
            const difference = newTotal - (Number(equipment.totalQuantity) || 0);
            equipment.totalQuantity = newTotal;
            equipment.availableQuantity = Math.max(0, (Number(equipment.availableQuantity) || 0) + difference);
        }

        await equipment.save();
        res.status(200).json({ success: true, data: equipment });
    } catch (error) {
        console.error('Update equipment error:', error);
        res.status(500).json({ message: error.message });
    }
};

// DELETE /api/equipment/:id  (admin only, own department only)
exports.deleteEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id);
        if (!equipment) {
            return res.status(404).json({ message: 'Equipment not found' });
        }
        if (!sameDepartment(equipment.department, req.user.department)) {
            return res.status(403).json({ message: 'This equipment belongs to another department' });
        }

        // Do not delete equipment that students currently hold
        const inUse = await Booking.exists({ equipmentId: equipment._id, status: 'Accepted' });
        if (inUse) {
            return res.status(400).json({ message: 'This equipment is currently in use and cannot be deleted.' });
        }

        await Equipment.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Equipment deleted successfully' });
    } catch (error) {
        console.error('Delete equipment error:', error);
        res.status(500).json({ message: error.message });
    }
};