import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

const JobSeekerDashboard = () => {
    const { user } = useContext(AuthContext);
    const [applications, setApplications] = useState([]);
    const [stats, setStats] = useState({ applied: 0, interviews: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch Applications
                const { data: appsData } = await axiosClient.get('/api/applications/my-applications');
                setApplications(appsData);

                // Fetch Stats
                const { data: statsData } = await axiosClient.get('/api/dashboard/seeker');
                setStats(statsData);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const StatCard = ({ title, value, icon, color }) => (
        <div className="card border-l-4" style={{ borderColor: color }}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">{title}</p>
                    <h3 className="text-3xl font-bold text-dark-900 mt-1">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg bg-opacity-10 text-xl`} style={{ backgroundColor: color + '20', color: color }}>
                    {icon}
                </div>
            </div>
        </div>
    );

    // Helper to format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="pt-24 pb-12 px-6 bg-gray-50 min-h-screen">
            <div className="container mx-auto max-w-6xl animate-slide-up">

                {/* Welcome Section */}
                <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-dark-900">
                            Hello, <span className="text-primary-600">{user?.name}</span> 👋
                        </h1>
                        <p className="text-gray-500 mt-2">Ready to find your next career move?</p>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/jobs" className="btn-primary">
                            Browse Jobs
                        </Link>
                    </div>
                </div>

                {/* Seeker Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard title="Jobs Applied" value={stats.applications || 0} icon="📝" color="#0ea5e9" />
                    <StatCard title="Interviews Scheduled" value={stats.interviews || 0} icon="🤝" color="#8b5cf6" />

                    <div className="card border-l-4 border-yellow-400">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Jobs Shortlisted</p>
                                <h3 className="text-3xl font-bold text-dark-900 mt-1">{stats.shortlisted || 0}</h3>
                            </div>
                            <div className="p-3 rounded-lg bg-yellow-50 text-xl text-yellow-500">
                                ⭐
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column (Recent Applications) */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="card">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                Recent Applications
                            </h2>

                            {loading ? (
                                <div className="text-center py-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                                </div>
                            ) : (Array.isArray(applications) && applications.length > 0) ? (
                                <div className="space-y-4">
                                    {applications.map((app) => (
                                        <div key={app._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border shadow-sm text-lg flex-shrink-0">
                                                    🏢
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-dark-900">{app.job?.title || 'Unknown Role'}</h4>
                                                    <p className="text-sm text-gray-500">{app.job?.companyName || 'Company'} • {formatDate(app.createdAt)}</p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${app.status === 'Interview' ? 'bg-blue-100 text-blue-700' :
                                                app.status === 'Applied' ? 'bg-green-100 text-green-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {app.status || 'Applied'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <p className="text-gray-500 mb-4">You haven't applied to any jobs yet.</p>
                                    <Link to="/jobs" className="btn-primary inline-block">
                                        Find a Job
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column (Profile Card) */}
                    <div className="space-y-8">
                        <div className="card bg-gradient-to-br from-dark-800 to-dark-900 text-white">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 p-1">
                                    <div className="w-full h-full bg-dark-900 rounded-full flex items-center justify-center font-bold text-2xl overflow-hidden">
                                        {user?.profilePhoto ? (
                                            <img src={user.profilePhoto} alt={user?.name} className="w-full h-full object-cover" />
                                        ) : (
                                            user?.name?.charAt(0)
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{user?.name}</h3>
                                    <p className="text-gray-400 text-sm">{user?.email}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm border-b border-gray-700 pb-2">
                                    <span className="text-gray-400">Role</span>
                                    <span className="font-medium">Job Seeker</span>
                                </div>
                                <div className="flex justify-between text-sm border-b border-gray-700 pb-2">
                                    <span className="text-gray-400">Joined</span>
                                    <span className="font-medium">Feb 2026</span>
                                </div>
                            </div>
                            <Link to="/onboarding" className="block w-full mt-6 bg-white/10 hover:bg-white/20 text-center text-white py-2 rounded-lg transition-colors text-sm font-medium">
                                Edit Profile & Resume
                            </Link>
                        </div>

                        {/* Recommended Jobs Teaser */}
                        <div className="card bg-primary-50 border-primary-100">
                            <h3 className="font-bold text-primary-900 mb-2">Recommended for you</h3>
                            <p className="text-sm text-primary-700 mb-4">Based on your profile, we found 5 new jobs.</p>
                            <Link to="/jobs" className="block w-full py-2 bg-white text-primary-600 font-semibold text-center rounded-lg hover:shadow-md transition">
                                View Recommendations
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobSeekerDashboard;
