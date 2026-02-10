import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import RequestCard from '../components/RequestCard';
import { Plus } from 'lucide-react';

const ReceiverDashboard = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, [user.id]);

    const fetchRequests = async () => {
        try {
            const res = await api.get(`/requests/receiver/${user.id}`);
            setRequests(res.data.reverse()); // Newest first
        } catch (err) {
            console.error("Failed to fetch requests", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Your Requests</h1>
                <Link to="/receiver/create" className="flex items-center gap-2 bg-secondary text-white px-4 py-2 rounded-md hover:bg-opacity-90">
                    <Plus size={20} />
                    <span>Post New Request</span>
                </Link>
            </div>

            {requests.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg border border-dashed">
                    <p className="text-gray-500 mb-4">You haven't posted any requests yet.</p>
                    <Link to="/receiver/create" className="text-primary font-medium hover:underline">Create your first request</Link>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                    {requests.map(req => (
                        <RequestCard key={req.id} request={req} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReceiverDashboard;
