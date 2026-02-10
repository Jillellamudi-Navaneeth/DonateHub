import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            login(response.data);
            navigate('/');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        required
                    />
                </div>
                <button type="submit" className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-opacity-90 transition">
                    Login
                </button>
            </form>
            <div className="mt-4">
                <button
                    onClick={() => {
                        login({ fullName: 'Dev User', email: 'dev@example.com', role: 'DONOR' });
                        navigate('/');
                    }}
                    className="w-full py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-opacity-90 transition"
                >
                    Dev Login (Bypass Backend)
                </button>
            </div>
            <p className="mt-4 text-center text-sm text-gray-600">
                Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
            </p>
        </div>
    );
};

export default Login;
