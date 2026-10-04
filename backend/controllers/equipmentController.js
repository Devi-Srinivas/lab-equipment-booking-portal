const Equipment = require('../models/equipment');

// 1. Get All Equipment List
exports.getAllEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.find();
        res.status(200).json(equipment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Add New Equipment (Admin)
exports.addEquipment = async (req, res) => {
    try {
        const { equipmentName, category, laboratoryName, quantity } = req.body;

        const equipment = new Equipment({
            equipmentName,
            category,
            laboratoryName,
            quantity,
            availableQuantity: quantity, // Initially available count is total quantity
            equipmentStatus: quantity > 0 ? 'Available' : 'Out of Stock'
        });

        await equipment.save();
        res.status(201).json({ message: 'Equipment added successfully', equipment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// =======================================
// Update Equipment
// =======================================
exports.updateEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const equipment = await Equipment.findByIdAndUpdate(id, updatedData, { new: true });

        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: "Equipment Not Found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Equipment Updated Successfully",
            data: equipment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// =======================================
// Delete Equipment
// =======================================
exports.deleteEquipment = async (req, res) => {
    try {
        const { id } = req.params;

        const equipment = await Equipment.findByIdAndDelete(id);

        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: "Equipment Not Found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Equipment Deleted Successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};