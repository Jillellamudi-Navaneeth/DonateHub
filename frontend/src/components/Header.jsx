import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, LogOut, User, Image as ImageIcon, X, Upload, Menu } from 'lucide-react';
import api from '../api';

const Header = () => {
    const { user, logout, updateUser } = useAuth();
    const navigate = useNavigate();
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
        setIsLogoutModalOpen(false);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const currentGalleryCount = user?.galleryImages?.length || 0;
        if (currentGalleryCount + images.length + files.length > 5) {
            alert('You can only have up to 5 images in your gallery.');
            return;
        }
        setImages([...images, ...files]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleGalleryUpload = async () => {
        if (images.length === 0) return;
        setUploading(true);
        try {
            const formData = new FormData();
            images.forEach(img => formData.append('files', img));
            const res = await api.post(`/users/${user.id}/gallery`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log('Gallery upload response:', res);
            alert('Gallery updated successfully!');
            setImages([]);
            setIsGalleryOpen(false);
            if (updateUser && res.data && res.data.data) {
                console.log('Sending to updateUser:', res.data.data);
                updateUser({ galleryImages: res.data.data });
            } else {
                console.error("Missing updateUser or res.data in context", { updateUser: !!updateUser, data: res.data });
            }
        } catch (err) {
            console.error(err);
            alert('Failed to update gallery');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteGalleryImage = async (imgUrl) => {
        if (!window.confirm('Are you sure you want to delete this image from your gallery?')) return;
        
        try {
            await api.delete(`/users/${user.id}/gallery`, {
                data: { imageUrl: imgUrl }
            });
            alert('Image deleted successfully!');
            if (updateUser) {
                const newGallery = user.galleryImages.filter(url => url !== imgUrl);
                updateUser({ galleryImages: newGallery });
            }
        } catch (err) {
            console.error('Failed to delete image:', err);
            alert('Failed to delete image from gallery');
        }
    };

    // Logo link - goes to dashboard when logged in, home when not logged in
    const getLogoDestination = () => {
        if (user) {
            return user.role === 'RECEIVER' ? '/receiver' : '/donor';
        }
        return '/';
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const baseUrl = api.defaults.baseURL.replace('/api', '');
        return `${baseUrl}${path}`;
    };

    return (
        <>
            <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 transition-all duration-300">
                <div className="container mx-auto px-4 py-3 md:py-4 flex justify-between items-center">
                    <Link to={getLogoDestination()} className="flex items-center gap-2 text-2xl font-bold text-primary z-[60]">
                        <Heart className="fill-current w-6 h-6 md:w-8 md:h-8" />
                        <span className="tracking-tight">DonateHub</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/about-us" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">About Us</Link>
                        <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Contact Us</Link>
                        {user ? (
                            <>
                                {user.role === 'RECEIVER' && (
                                    <>
                                        <button onClick={() => setIsGalleryOpen(true)} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                                            <ImageIcon size={18} /> My Gallery
                                        </button>
                                        <Link to="/receiver-profile" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                                            {user.profileImageUrl ? (
                                                <img src={getImageUrl(user.profileImageUrl)} alt="Profile" className="w-6 h-6 rounded-full object-cover border shadow-sm border-gray-200" />
                                            ) : (
                                                <User size={18} />
                                            )}
                                            {user.fullName || 'Profile'}
                                        </Link>
                                        <button onClick={() => setIsLogoutModalOpen(true)} className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
                                            <LogOut size={18} /> Logout
                                        </button>
                                    </>
                                )}
                                {user.role === 'DONOR' && (
                                    <>
                                        <Link to="/donor-profile" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                                            {user.profileImageUrl ? (
                                                <img src={getImageUrl(user.profileImageUrl)} alt="Profile" className="w-6 h-6 rounded-full object-cover border shadow-sm border-gray-200" />
                                            ) : (
                                                <User size={18} />
                                            )}
                                            {user.fullName || 'Profile'}
                                        </Link>
                                        <button onClick={() => setIsLogoutModalOpen(true)} className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
                                            <LogOut size={18} /> Logout
                                        </button>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="flex gap-4">
                                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors">Login</Link>
                                <Link to="/signup" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-opacity-90 transition-all shadow-sm">Sign Up</Link>
                            </div>
                        )}
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <button 
                        className="md:hidden p-2 text-gray-600 hover:text-primary transition-all z-[60] rounded-lg hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Navigation Menu Drawer */}
                <div className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ${isMenuOpen ? 'visible' : 'invisible'}`}>
                    {/* Backdrop */}
                    <div 
                        className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                        onClick={() => setIsMenuOpen(false)}
                    />
                    
                    {/* Drawer Content */}
                    <nav className={`absolute top-0 right-0 h-full w-[280px] bg-white shadow-2xl transition-transform duration-300 ease-out transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} pt-20 px-4 flex flex-col gap-2 overflow-y-auto`}>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4 mb-2">Navigation</div>
                        <Link 
                            to="/about-us" 
                            className="flex items-center gap-4 p-4 text-sm font-semibold text-gray-700 hover:bg-primary/5 hover:text-primary rounded-xl transition-all"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <Heart size={18} className="text-primary/60" /> About Us
                        </Link>
                        <Link 
                            to="/contact" 
                            className="flex items-center gap-4 p-4 text-sm font-semibold text-gray-700 hover:bg-primary/5 hover:text-primary rounded-xl transition-all"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <Mail size={18} className="text-primary/60" /> Contact Us
                        </Link>

                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest px-4 mt-4 mb-2">Account</div>
                        {user ? (
                            <>
                                {user.role === 'RECEIVER' && (
                                    <button 
                                        onClick={() => { setIsGalleryOpen(true); setIsMenuOpen(false); }} 
                                        className="flex items-center gap-4 p-4 text-sm font-semibold text-gray-700 hover:bg-primary/5 hover:text-primary rounded-xl transition-all"
                                    >
                                        <ImageIcon size={18} className="text-primary/60" /> My Gallery
                                    </button>
                                )}
                                <Link 
                                    to={user.role === 'RECEIVER' ? "/receiver-profile" : "/donor-profile"}
                                    className="flex items-center gap-4 p-4 text-sm font-semibold text-gray-700 hover:bg-primary/5 hover:text-primary rounded-xl transition-all"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {user.profileImageUrl ? (
                                        <img src={getImageUrl(user.profileImageUrl)} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-gray-100" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                            <User size={16} className="text-gray-500" />
                                        </div>
                                    )}
                                    {user.fullName || 'My Profile'}
                                </Link>
                                <div className="mt-auto pb-8">
                                    <button 
                                        onClick={() => { setIsLogoutModalOpen(true); setIsMenuOpen(false); }} 
                                        className="w-full flex items-center gap-4 p-4 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <LogOut size={18} /> Logout Account
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col gap-3 mt-4 px-2">
                                <Link 
                                    to="/login" 
                                    className="w-full p-4 text-center text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/signup" 
                                    className="w-full p-4 text-center text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-lg shadow-primary/20 transition-all"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Create Account
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            </header>
            
            {/* Gallery Modal */}
            {isGalleryOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <ImageIcon className="text-primary" /> My Gallery
                            </h2>
                            <button onClick={() => setIsGalleryOpen(false)} className="text-gray-500 hover:text-gray-900">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            {/* Existing Gallery Images */}
                            <div className="mb-6">
                                <h4 className="text-sm border-b pb-2 font-bold text-gray-700 mb-4">Current Gallery</h4>
                                {(!user?.galleryImages || user.galleryImages.length === 0) ? (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                                        <p className="text-gray-500 text-sm font-medium">No images are there to show.</p>
                                        <p className="text-gray-400 text-xs mt-1">Please upload images below.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {user.galleryImages.map((imgUrl, index) => (
                                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm transition-transform hover:scale-105 group">
                                                <img src={getImageUrl(imgUrl)} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                                                <button
                                                    onClick={() => handleDeleteGalleryImage(imgUrl)}
                                                    className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-600 text-white rounded-full p-1.5 transition-all opacity-0 group-hover:opacity-100 shadow-md backdrop-blur-sm"
                                                    title="Delete image"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* New Photos Queue */}
                            {images.length > 0 && (
                                <div className="mb-6 border-t pt-4">
                                    <h4 className="text-sm font-bold text-primary mb-3">Selected for Upload</h4>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {images.map((img, index) => (
                                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                                <img src={URL.createObjectURL(img)} alt={`New ${index + 1}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white rounded-full p-1 transition-colors backdrop-blur-sm shadow"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Upload Option */}
                            {((user?.galleryImages?.length || 0) + images.length) < 5 ? (
                                <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50 transition-all hover:bg-white hover:border-primary/50">
                                    <Upload className="mx-auto h-8 w-8 text-primary mb-2" />
                                    <p className="text-sm font-medium text-gray-700 mb-1">Your uploads can change donor impression</p>
                                    <p className="text-xs text-gray-500 mb-4">You can add {5 - ((user?.galleryImages?.length || 0) + images.length)} more photo(s).</p>
                                    
                                    <input
                                        type="file"
                                        id="headerGalleryUpload"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        disabled={uploading}
                                    />
                                    <label
                                        htmlFor="headerGalleryUpload"
                                        className="cursor-pointer inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 transition-colors"
                                    >
                                        Select Photos
                                    </label>
                                </div>
                            ) : (
                                <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                                    <p className="text-amber-700 text-sm font-medium">You have reached the maximum of 5 images.</p>
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                            <button onClick={() => setIsGalleryOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-md font-medium text-sm">
                                Cancel
                            </button>
                            <button
                                onClick={handleGalleryUpload}
                                disabled={uploading || images.length === 0}
                                className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 disabled:opacity-50"
                            >
                                {uploading ? 'Uploading...' : 'Save Gallery'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Logout Confirmation Modal */}
            {isLogoutModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col p-6 border border-gray-100">
                        <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4 mx-auto">
                            <LogOut className="text-red-600" size={24} />
                        </div>
                        
                        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Confirm Logout</h2>
                        <p className="text-gray-600 text-center mb-8">Are you sure you want to log out of your account?</p>
                        
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleLogout}
                                className="w-full py-2.5 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                            >
                                Yes, Log Out
                            </button>
                            <button
                                onClick={() => setIsLogoutModalOpen(false)}
                                className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;

