import React, { useEffect, useState } from 'react';
import api from '../api';
import RequestCard from '../components/RequestCard';
import { Search, MapPin } from 'lucide-react';

const DonorDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await api.get('/requests');
            setRequests(res.data);
            setFilteredRequests(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let result = requests;
        if (searchTerm) {
            result = result.filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (locationFilter) {
            result = result.filter(r => r.location.toLowerCase().includes(locationFilter.toLowerCase()));
        }
        setFilteredRequests(result);
    }, [searchTerm, locationFilter, requests]);

    return (
        <div>
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary to-indigo-800 text-white p-12 rounded-2xl mb-12 shadow-xl">
                <div className="max-w-3xl">
                    <h1 className="text-4xl font-bold mb-4">Make a Difference Today</h1>
                    <p className="text-xl opacity-90 mb-8">Connect directly with people in need. Your small contribution can change a life. No middlemen, just direct impact.</p>
                    <div className="flex gap-4">
                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
                            <span className="block text-3xl font-bold">{requests.length}</span>
                            <span className="text-sm opacity-90">Open Requests</span>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
                            <span className="block text-3xl font-bold">{requests.filter(r => r.status !== 'OPEN').length}</span>
                            <span className="text-sm opacity-90">Being Fulfilled</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search for items (e.g., Blankets, Food)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:border-primary"
                    />
                </div>
                <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Filter by Location..."
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:border-primary"
                    />
                </div>
            </div>

            {/* Request List */}
            {loading ? (
                <div className="text-center py-10">Loading...</div>
            ) : filteredRequests.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg border border-dashed">
                    <p className="text-gray-500">No requests found matching your filters.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                    {filteredRequests.map(req => (
                        <RequestCard key={req.id} request={req} onUpdate={fetchRequests} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DonorDashboard;
