import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2 } from 'lucide-react';

const CreateRequest = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [items, setItems] = useState([{ itemName: '', requiredQuantity: '' }]);

    const handleAddItem = () => {
        setItems([...items, { itemName: '', requiredQuantity: '' }]);
    };

    const handleRemoveItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/requests', {
                userId: user.id,
                title,
                location,
                items: items.map(i => ({ ...i, requiredQuantity: parseInt(i.requiredQuantity) }))
            });
            navigate('/receiver');
        } catch (err) {
            alert('Failed to create request');
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Post New Request</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Request Title</label>
                    <input
                        type="text"
                        placeholder="e.g. Blankets for Winter Shelter"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-primary focus:outline-none"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                        type="text"
                        placeholder="e.g. 123 Main St, New York"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-primary focus:outline-none"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Items Needed</label>
                    {items.map((item, index) => (
                        <div key={index} className="flex gap-4 mb-3">
                            <input
                                type="text"
                                placeholder="Item Name"
                                value={item.itemName}
                                onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:border-primary focus:outline-none"
                                required
                            />
                            <input
                                type="number"
                                placeholder="Qty"
                                min="1"
                                value={item.requiredQuantity}
                                onChange={(e) => handleItemChange(index, 'requiredQuantity', e.target.value)}
                                className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:border-primary focus:outline-none"
                                required
                            />
                            {items.length > 1 && (
                                <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700">
                                    <Trash2 size={20} />
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={handleAddItem} className="flex items-center text-sm text-primary font-medium hover:underline mt-2">
                        <Plus size={16} className="mr-1" /> Add Another Item
                    </button>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <button type="button" onClick={() => navigate('/receiver')} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Cancel</button>
                    <button type="submit" className="px-6 py-2 bg-primary text-white rounded-md hover:bg-opacity-90">Submit Request</button>
                </div>
            </form>
        </div>
    );
};

export default CreateRequest;
