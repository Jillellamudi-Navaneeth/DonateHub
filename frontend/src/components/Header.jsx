import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, LogOut } from 'lucide-react';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
                    <Heart className="fill-current" />
                    <span>DonateHub</span>
                </Link>

                <nav className="flex items-center gap-6">
                    {user && <Link to="/" className="text-sm font-medium text-gray-600 hover:text-primary">Home</Link>}
                    <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-primary hidden md:block">About Us</Link>
                    <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-primary hidden md:block">Contact Us</Link>
                    {user ? (
                        <>

                            {user.role === 'RECEIVER' && (
                                <Link to="/receiver/create" className="text-sm font-medium text-primary hover:text-primary-dark">Post Request</Link>
                            )}
                            {user.role === 'DONOR' && (
                                <Link to="/donor" className="text-sm font-medium text-primary hover:text-primary-dark">Browse Requests</Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700"
                            >
                                <LogOut size={18} /> Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex gap-4">
                            <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary">Login</Link>
                            <Link to="/signup" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-opacity-90">Sign Up</Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
