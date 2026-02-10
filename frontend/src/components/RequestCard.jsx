import React, { useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { MapPin, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const RequestCard = ({ request, onUpdate }) => {
    const { user } = useAuth();
    const [fulfillmentData, setFulfillmentData] = useState({});

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED': return 'text-green-600 bg-green-50 border-green-200';
            case 'PARTIALLY_FULFILLED': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            default: return 'text-blue-600 bg-blue-50 border-blue-200';
        }
    };

    const handleFulfill = async (itemId, required, fulfilled) => {
        const amount = parseInt(fulfillmentData[itemId] || 0);
        if (amount <= 0) return;
        if (amount + fulfilled > required) {
            alert("Cannot fulfill more than required!");
            return;
        }

        try {
            await api.post('/requests/fulfill', {
                donorId: user.id,
                requestItemId: itemId,
                quantity: amount
            });
            alert('Donation recorded! Thank you.');
            setFulfillmentData({ ...fulfillmentData, [itemId]: '' });
            if (onUpdate) onUpdate();
        } catch (err) {
            alert('Failed to fulfill request.');
        }
    };

    return (
        <div className={`bg-white rounded-lg shadow-sm border p-6 mb-4 transition hover:shadow-md ${request.status === 'COMPLETED' ? 'opacity-75' : ''}`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">{request.title}</h3>
                    <div className="flex items-center text-gray-500 mt-1">
                        <MapPin size={16} className="mr-1" />
                        <span className="text-sm">{request.location}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Posted by {request.receiver.username} on {new Date(request.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(request.status)}`}>
                    {request.status.replace('_', ' ')}
                </span>
            </div>

            <div className="space-y-3">
                {request.items.map(item => (
                    <div key={item.id} className="bg-gray-50 p-3 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-700">{item.itemName}</span>
                            <span className="text-sm text-gray-500">
                                {item.fulfilledQuantity} / {item.requiredQuantity} fulfilled
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                            <div
                                className="bg-secondary h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(item.fulfilledQuantity / item.requiredQuantity) * 100}%` }}
                            ></div>
                        </div>

                        {/* Donor Actions */}
                        {user.role === 'DONOR' && item.fulfilledQuantity < item.requiredQuantity && (
                            <div className="flex gap-2 mt-2">
                                <input
                                    type="number"
                                    placeholder="Qty"
                                    min="1"
                                    max={item.requiredQuantity - item.fulfilledQuantity}
                                    value={fulfillmentData[item.id] || ''}
                                    onChange={(e) => setFulfillmentData({ ...fulfillmentData, [item.id]: e.target.value })}
                                    className="w-20 px-2 py-1 text-sm border rounded focus:outline-none focus:border-primary"
                                />
                                <button
                                    onClick={() => handleFulfill(item.id, item.requiredQuantity, item.fulfilledQuantity)}
                                    className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-opacity-90 transition"
                                    disabled={!fulfillmentData[item.id]}
                                >
                                    Donate
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RequestCard;
