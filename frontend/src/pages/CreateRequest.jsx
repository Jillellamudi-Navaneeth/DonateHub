import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';

const CreateRequest = () => {
const { user } = useAuth();
const navigate = useNavigate();
const [title, setTitle] = useState('');
const [location, setLocation] = useState('');
const [category, setCategory] = useState('');
const [items, setItems] = useState([{ itemName: '', requiredQuantity: '' }]);
const [userAddress, setUserAddress] = useState(null);
const [loading, setLoading] = useState(false);

```
const categories = ['Blankets', 'Food', 'Shirts', 'Pants', 'Coats', 'Others'];

// Fetch user address details on mount
useEffect(() => {
    const fetchUserAddress = async () => {
        if (user && user.id) {
            try {
                // ✅ FIXED API PATH
                const response = await api.get(`/api/users/${user.id}`);
                const userData = response.data.data;
                setUserAddress(userData);

                // Pre-fill location with user's address
                const fullAddress = formatAddress(userData);
                if (fullAddress) {
                    setLocation(fullAddress);
                }
            } catch (err) {
                console.error('Failed to fetch user address:', err);
            }
        }
    };
    fetchUserAddress();
}, [user]);

// Format address from user data
const formatAddress = (userData) => {
    if (userData.address && userData.address.trim()) {
        return userData.address;
    }

    const parts = [];
    if (userData.houseNumber) parts.push(userData.houseNumber);
    if (userData.streetLandmark) parts.push(userData.streetLandmark);
    if (userData.areaLocality) parts.push(userData.areaLocality);
    if (userData.city) parts.push(userData.city);
    if (userData.district) parts.push(userData.district);
    if (userData.state) parts.push(userData.state);
    if (userData.pincode) parts.push(userData.pincode);
    if (userData.country) parts.push(userData.country);
    return parts.join(', ');
};

const handleItemChange = (field, value) => {
    const newItems = [...items];
    newItems[0][field] = value;
    setItems(newItems);
};

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.id) {
        alert('Please login to create a request');
        return;
    }
    setLoading(true);
    try {
        // ✅ FIXED API PATH
        await api.post('/api/requests', {
            userId: user.id,
            title,
            location,
            category,
            items: items.map(i => ({ ...i, requiredQuantity: parseInt(i.requiredQuantity) }))
        });
        alert('Request posted successfully!');
        navigate('/receiver');
    } catch (err) {
        console.error(err);
        alert('Failed to create request');
    } finally {
        setLoading(false);
    }
};

return (
    <div>
        <button
            onClick={() => user ? navigate('/receiver') : navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 font-medium"
        >
            <ArrowLeft size={20} />
            {user ? 'Back to Dashboard' : 'Back to Home'}
        </button>

        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Post New Request</h1>

            {userAddress && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="text-sm font-semibold text-blue-800 mb-2">Your Registered Address:</h3>
                    <p className="text-blue-700">{formatAddress(userAddress)}</p>
                    <p className="text-xs text-blue-600 mt-1">This address will be used for your request</p>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Request Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    >
                        <option value="">Select a Category</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Item Needed</label>
                    <div className="flex gap-4 mb-3">
                        <input
                            type="text"
                            value={items[0].itemName}
                            onChange={(e) => handleItemChange('itemName', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                            required
                        />
                        <input
                            type="number"
                            value={items[0].requiredQuantity}
                            onChange={(e) => handleItemChange('requiredQuantity', e.target.value)}
                            className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                </div>

                <button type="submit" disabled={loading} className="px-6 py-2 bg-primary text-white rounded-md">
                    {loading ? 'Submitting...' : 'Submit Request'}
                </button>
            </form>
        </div>
    </div>
);
```

};

export default CreateRequest;
