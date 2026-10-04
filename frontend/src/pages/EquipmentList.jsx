import { useState, useEffect } from 'react';
import API from '../services/api';

export default function EquipmentList() {
    const [equipmentList, setEquipmentList] = useState([]);

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

    return (
        <div style={{ padding: '20px' }}>
            <h2>Available Laboratory Equipment</h2>
            <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                <thead>
                    <tr style={{ background: '#f2f2f2' }}>
                        <th>Equipment Name</th>
                        <th>Category</th>
                        <th>Lab Name</th>
                        <th>Available Qty</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {equipmentList.map((item) => (
                        <tr key={item._id}>
                            <td>{item.equipmentName}</td>
                            <td>{item.category}</td>
                            <td>{item.laboratoryName}</td>
                            <td>{item.availableQuantity}</td>
                            <td>
                                <span style={{ color: item.availableQuantity > 0 ? 'green' : 'red', fontWeight: 'bold' }}>
                                    {item.availableQuantity > 0 ? 'Available' : 'Out of Stock'}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}