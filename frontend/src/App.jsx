import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ReceiverDashboard from './pages/ReceiverDashboard';
import CreateRequest from './pages/CreateRequest';
import DonorDashboard from './pages/DonorDashboard';
import HomePage from './pages/HomePage';
import { useAuth } from './context/AuthContext';

const PrivateRoute = ({ children, roles }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
    return children;
};

// Redirect based on role
const HomeRedirect = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    return <HomePage />;
};

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/" element={<HomeRedirect />} />

                        <Route path="/receiver" element={
                            <PrivateRoute roles={['RECEIVER']}>
                                <ReceiverDashboard />
                            </PrivateRoute>
                        } />
                        <Route path="/receiver/create" element={
                            <PrivateRoute roles={['RECEIVER']}>
                                <CreateRequest />
                            </PrivateRoute>
                        } />

                        <Route path="/donor" element={
                            <PrivateRoute roles={['DONOR']}>
                                <DonorDashboard />
                            </PrivateRoute>
                        } />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
