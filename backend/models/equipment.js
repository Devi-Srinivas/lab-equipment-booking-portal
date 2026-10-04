const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
    equipmentName: { type: String, required: true },
    equipmentId: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    totalQuantity: { type: Number, required: true },
    availableQuantity: { type: Number, required: true },
    labNumber: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Equipment', EquipmentSchema);