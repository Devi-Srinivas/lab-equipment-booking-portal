import { useState, useEffect } from 'react';
import API from '../services/api';

export default function ManageEquipment() {
    const [equipmentList, setEquipmentList] = useState([]);
    const [formData, setFormData] = useState({
        equipmentName: '',
        category: '',
        laboratoryName: '',
        quantity: 1
    });

    // State for Editing/Updating Equipment
    const [editingItem, setEditingItem] = useState(null);
    const [editFormData, setEditFormData] = useState({
        equipmentName: '',
        category: '',
        laboratoryName: '',
        quantity: 1,
        availableQuantity: 1
    });

    useEffect(() => {
        fetchEquipment();
    }, []);

    const fetchEquipment = async () => {
        try {
            const res = await API.get('/equipment');
            setEquipmentList(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // Add Equipment
    const handleAddEquipment = async (e) => {
        e.preventDefault();
        try {
            await API.post('/equipment', formData);
            alert('Equipment Added Successfully!');
            setFormData({ equipmentName: '', category: '', laboratoryName: '', quantity: 1 });
            fetchEquipment();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to Add Equipment');
        }
    };

    // Delete Equipment
    const handleDeleteEquipment = async (id) => {
        if (!window.confirm('Are you sure you want to delete this equipment?')) return;
        try {
            await API.delete(`/equipment/${id}`);
            alert('Equipment Deleted!');
            fetchEquipment();
        } catch (err) {
            alert(err.response?.data?.message || 'Delete Failed');
        }
    };

    // Open Edit Form Modal with selected item data
    const handleEditClick = (item) => {
        setEditingItem(item._id);
        setEditFormData({
            equipmentName: item.equipmentName,
            category: item.category,
            laboratoryName: item.laboratoryName,
            quantity: item.quantity,
            availableQuantity: item.availableQuantity
        });
    };

    // Update Equipment details via API
    const handleUpdateEquipment = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/equipment/${editingItem}`, editFormData);
            alert('Equipment Updated Successfully!');
            setEditingItem(null); // Close modal
            fetchEquipment();
        } catch (err) {
            alert(err.response?.data?.message || 'Update Failed');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Manage Equipment (Admin)</h2>

            {/* 1. Add Equipment Form */}
            <form onSubmit={handleAddEquipment} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <input
                    placeholder="Equipment Name"
                    required
                    value={formData.equipmentName}
                    onChange={(e) => setFormData({ ...formData, equipmentName: e.target.value })}
                />
                <input
                    placeholder="Category (e.g. IoT, FPGA)"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
                <input
                    placeholder="Lab Name"
                    required
                    value={formData.laboratoryName}
                    onChange={(e) => setFormData({ ...formData, laboratoryName: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    required
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                />
                <button type="submit">Add Equipment</button>
            </form>

            {/* 2. Equipment Table */}
            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f2f2f2' }}>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Lab</th>
                        <th>Total Qty</th>
                        <th>Available Qty</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {equipmentList.map((item) => (
                        <tr key={item._id}>
                            <td>{item.equipmentName}</td>
                            <td>{item.category}</td>
                            <td>{item.laboratoryName}</td>
                            <td>{item.quantity}</td>
                            <td>{item.availableQuantity}</td>
                            <td>
                                <button onClick={() => handleEditClick(item)} style={{ marginRight: '5px' }}>Edit</button>
                                <button onClick={() => handleDeleteEquipment(item._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 3. Edit Form Modal / Popup */}
            {editingItem && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div style={{ background: '#fff', padding: '20px', borderRadius: '5px', width: '400px' }}>
                        <h3>Edit Equipment</h3>
                        <form onSubmit={handleUpdateEquipment}>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Equipment Name:</label>
                                <input
                                    type="text"
                                    required
                                    style={{ width: '100%' }}
                                    value={editFormData.equipmentName}
                                    onChange={(e) => setEditFormData({ ...editFormData, equipmentName: e.target.value })}
                                />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Category:</label>
                                <input
                                    type="text"
                                    required
                                    style={{ width: '100%' }}
                                    value={editFormData.category}
                                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                                />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Laboratory Name:</label>
                                <input
                                    type="text"
                                    required
                                    style={{ width: '100%' }}
                                    value={editFormData.laboratoryName}
                                    onChange={(e) => setEditFormData({ ...editFormData, laboratoryName: e.target.value })}
                                />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Total Quantity:</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    style={{ width: '100%' }}
                                    value={editFormData.quantity}
                                    onChange={(e) => setEditFormData({ ...editFormData, quantity: Number(e.target.value) })}
                                />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label>Available Quantity:</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    style={{ width: '100%' }}
                                    value={editFormData.availableQuantity}
                                    onChange={(e) => setEditFormData({ ...editFormData, availableQuantity: Number(e.target.value) })}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setEditingItem(null)}>Cancel</button>
                                <button type="submit">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}