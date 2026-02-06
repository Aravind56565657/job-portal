import { Link, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    // Sticky glass effect on scroll
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path ? 'text-primary-600 font-semibold bg-primary-50' : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50';

    const getDashboardLink = () => {
        if (!user) return '/login';
        return user.role === 'employer' ? '/dashboard/employer' : '/dashboard/seeker';
    };

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass shadow-sm py-2' : 'bg-transparent py-4'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent flex items-center gap-2">
                    <span className="text-3xl">🚀</span> JobPortal
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-1">
                    {user ? (
                        <>
                            <Link to={getDashboardLink()} className={`px-4 py-2 rounded-full transition-all ${location.pathname.includes('/dashboard') ? 'text-primary-600 font-semibold bg-primary-50' : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'}`}>Dashboard</Link>

                            {user.role === 'job_seeker' && (
                                <Link to="/jobs" className={`px-4 py-2 rounded-full transition-all ${isActive('/jobs')}`}>Browse Jobs</Link>
                            )}

                            {user.role === 'employer' && (
                                <>
                                    <Link to="/post-job" className={`px-4 py-2 rounded-full transition-all ${isActive('/post-job')}`}>Post Role</Link>
                                    <Link to="/employer/jobs" className={`px-4 py-2 rounded-full transition-all ${isActive('/employer/jobs')}`}>My Jobs</Link>
                                </>
                            )}

                            {/* User Profile Pill */}
                            <div className="ml-4 flex items-center gap-3 pl-4 border-l border-gray-200">
                                <div className="text-right hidden lg:block">
                                    <p className="text-sm font-bold text-gray-800">{user.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
                                </div>
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={`px-6 py-2 rounded-full font-medium transition-colors ${isActive('/login')}`}>Login</Link>
                            <Link to="/register" className="ml-2 btn-primary shadow-primary-500/30">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
