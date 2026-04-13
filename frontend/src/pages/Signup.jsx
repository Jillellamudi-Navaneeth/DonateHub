import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Phone, Lock, Mail, User } from 'lucide-react';

const Signup = () => {
const [formData, setFormData] = useState({
fullName: '',
email: '',
password: '',
role: 'DONOR',
phone: '',
houseNumber: '',
streetLandmark: '',
areaLocality: '',
city: '',
district: '',
state: '',
pincode: '',
country: '',
govtCertificationId: '',
organizationName: '',
runnerName: ''
});
const [otp, setOtp] = useState('');
const [otpSent, setOtpSent] = useState(false);
const { user, register } = useAuth();
const [loading, setLoading] = useState(false);
const navigate = useNavigate();

```
React.useEffect(() => {
    if (user) {
        navigate(user.role === 'RECEIVER' ? '/receiver' : '/donor', { replace: true });
    }
}, [user, navigate]);

const handleSendOtp = async () => {
    if (!formData.email || !formData.email.includes('@')) {
        alert('Please enter a valid email address');
        return;
    }
    try {
        // ✅ FIXED API PATH
        await api.post('/api/auth/send-otp', { email: formData.email });
        setOtpSent(true);
        alert('OTP sent to your email');
    } catch (error) {
        alert('Failed to send OTP: ' + (error.response?.data?.message || error.message));
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        // ✅ FIXED API PATH
        await api.post('/api/auth/register', { 
            ...formData, 
            email: formData.email.trim(),
            password: formData.password.trim(),
            otp 
        });
        alert('Registration successful! Please login.');
        navigate('/login');
    } catch (error) {
        alert('Registration failed. ' + (error.response?.data?.message || 'Invalid OTP or details'));
    } finally {
        setLoading(false);
    }
};

return (
    <div className="auth-bg p-6">
        <div className="max-w-md w-full glass-morphism p-8 rounded-lg shadow-xl my-10">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="mt-1 block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white/20 backdrop-blur-sm"
                            required
                        />
                        <User size={16} className="absolute left-3 top-3.5 text-gray-500" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <div className="relative">
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="mt-1 block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white/20 backdrop-blur-sm"
                            required
                        />
                        <Phone size={16} className="absolute left-3 top-3.5 text-gray-500" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="relative flex gap-2">
                        <div className="relative flex-grow">
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="mt-1 block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white/20 backdrop-blur-sm"
                                required
                                disabled={otpSent}
                            />
                            <Mail size={16} className="absolute left-3 top-3.5 text-gray-500" />
                        </div>
                        {!otpSent && (
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                className="mt-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition shadow-md"
                            >
                                Send OTP
                            </button>
                        )}
                    </div>
                </div>

                {otpSent && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Enter Email OTP</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white/20 backdrop-blur-sm"
                            required
                            placeholder="Enter 6-digit OTP"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || !otpSent}
                    className="w-full py-2.5 px-4 bg-primary text-white rounded-md hover:bg-opacity-90 transition disabled:opacity-50 font-semibold shadow-lg mt-4"
                >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
                Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Login</Link>
            </p>
        </div>
    </div>
);
```

};

export default Signup;
