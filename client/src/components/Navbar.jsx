import { Link, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Sticky glass effect on scroll
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

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

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-1">
                    {user ? (
                        <>
                            <Link to={getDashboardLink()} className={`px-4 py-2 rounded-full transition-all ${location.pathname.includes('/dashboard') ? 'text-primary-600 font-semibold bg-primary-50' : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'}`}>Dashboard</Link>

                            {user?.role === 'job_seeker' && (
                                <Link to="/jobs" className={`px-4 py-2 rounded-full transition-all ${isActive('/jobs')}`}>Browse Jobs</Link>
                            )}

                            {user?.role === 'employer' && (
                                <>
                                    <Link to="/post-job" className={`px-4 py-2 rounded-full transition-all ${isActive('/post-job')}`}>Post Role</Link>
                                    <Link to="/employer/jobs" className={`px-4 py-2 rounded-full transition-all ${isActive('/employer/jobs')}`}>My Jobs</Link>
                                </>
                            )}

                            {/* User Profile Pill */}
                            <div className="ml-4 flex items-center gap-3 pl-4 border-l border-gray-200">
                                <div className="hidden lg:block text-right">
                                    <p className="text-sm font-bold text-gray-800">{user.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user.role?.replace('_', ' ')}</p>
                                </div>

                                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm flex items-center justify-center bg-gray-50">
                                    {(user.profilePhoto || user.companyLogo) ? (
                                        <img
                                            src={user.companyLogo || user.profilePhoto}
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-lg font-bold text-primary-600">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </span>
                                    )}
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

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 focus:outline-none p-2 text-2xl">
                        {isMenuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 animate-fade-in-down">
                    <div className="flex flex-col p-4 space-y-2">
                        {user ? (
                            <>
                                <div className="px-4 py-2 border-b border-gray-100 mb-2">
                                    <p className="font-bold text-gray-800">{user?.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user.role?.replace('_', ' ')}</p>
                                </div>
                                <Link to={getDashboardLink()} className={`px-4 py-3 rounded-lg ${isActive(getDashboardLink())}`}>Dashboard</Link>

                                {user?.role === 'job_seeker' && (
                                    <Link to="/jobs" className={`px-4 py-3 rounded-lg ${isActive('/jobs')}`}>Browse Jobs</Link>
                                )}

                                {user?.role === 'employer' && (
                                    <>
                                        <Link to="/post-job" className={`px-4 py-3 rounded-lg ${isActive('/post-job')}`}>Post Role</Link>
                                        <Link to="/employer/jobs" className={`px-4 py-3 rounded-lg ${isActive('/employer/jobs')}`}>My Jobs</Link>
                                    </>
                                )}

                                <button onClick={logout} className="px-4 py-3 text-left text-red-600 font-medium hover:bg-red-50 rounded-lg">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="px-4 py-3 rounded-lg hover:bg-gray-50 font-medium">Login</Link>
                                <Link to="/register" className="px-4 py-3 rounded-lg bg-primary-600 text-white font-medium text-center shadow-lg">Get Started</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
