import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <div className="p-10 text-center">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Onboarding Logic
    // If profile is NOT completed and user is NOT already on /onboarding, redirect them there
    if (!user.isProfileCompleted && location.pathname !== '/onboarding') {
        return <Navigate to="/onboarding" replace />;
    }

    // Logic to prevent accessing /onboarding if profile is completed is REMOVED 
    // to allow "Edit Profile" functionality.

    // if (user.isProfileCompleted && location.pathname === '/onboarding') {
    //     const dashboardPath = user.role === 'employer' ? '/dashboard/employer' : '/dashboard/seeker';
    //     return <Navigate to={dashboardPath} replace />;
    // }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
