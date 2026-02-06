import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

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

    return (
        <div className="pt-24 pb-12 px-6 bg-gray-50 min-h-screen">
            <div className="container mx-auto max-w-6xl animate-slide-up">

                {/* Welcome Section */}
                <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-dark-900">
                            Welcome back, <span className="text-primary-600">{user?.name}</span> 👋
                        </h1>
                        <p className="text-gray-500 mt-2">Here's what's happening with your job activities today.</p>
                    </div>
                    <div className="flex gap-3">
                        {user?.role === 'employer' ? (
                            <Link to="/post-job" className="btn-primary flex items-center gap-2">
                                <span>+</span> Post New Job
                            </Link>
                        ) : (
                            <Link to="/jobs" className="btn-primary">
                                Find a Job
                            </Link>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {user?.role === 'employer' ? (
                        <>
                            <StatCard title="Active Jobs" value="12" icon="💼" color="#0ea5e9" />
                            <StatCard title="Total Applicants" value="45" icon="👥" color="#8b5cf6" />
                            <StatCard title="Interviews Scheduled" value="8" icon="📅" color="#14b8a6" />
                        </>
                    ) : (
                        <>
                            <StatCard title="Jobs Applied" value="23" icon="📝" color="#0ea5e9" />
                            <StatCard title="Profile Views" value="108" icon="👀" color="#8b5cf6" />
                            <StatCard title="Interviews" value="3" icon="🤝" color="#e11d48" />
                        </>
                    )}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column (Main Info) */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="card">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                {user?.role === 'employer' ? 'Recent Job Postings' : 'Recent Applications'}
                            </h2>
                            {/* Placeholder List */}
                            <div className="space-y-4">
                                {[1, 2, 3].map((item) => (
                                    <div key={item} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border shadow-sm text-lg">
                                                {user?.role === 'employer' ? '💼' : '🏢'}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-dark-900">{user?.role === 'employer' ? 'Senior Frontend Engineer' : 'Marketing Manager'}</h4>
                                                <p className="text-sm text-gray-500">{user?.role === 'employer' ? 'Remote • Full-time' : 'Google Inc • Applied 2 days ago'}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item === 2 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {item === 2 ? (user?.role === 'employer' ? 'Published' : 'Interview') : 'Active'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 text-center">
                                <Link to={user?.role === 'employer' ? "/employer/jobs" : "/my-applications"} className="text-primary-600 font-semibold hover:underline">
                                    View All Activity_
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Profile & Actions) */}
                    <div className="space-y-8">
                        <div className="card bg-gradient-to-br from-dark-800 to-dark-900 text-white">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 p-1">
                                    <div className="w-full h-full bg-dark-900 rounded-full flex items-center justify-center font-bold text-2xl">
                                        {user?.name.charAt(0)}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{user?.name}</h3>
                                    <p className="text-gray-400 text-sm">{user?.email}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm border-b border-gray-700 pb-2">
                                    <span className="text-gray-400">Account Type</span>
                                    <span className="capitalize font-medium">{user?.role.replace('_', ' ')}</span>
                                </div>
                                <div className="flex justify-between text-sm border-b border-gray-700 pb-2">
                                    <span className="text-gray-400">Member Since</span>
                                    <span className="font-medium">Feb 2026</span>
                                </div>
                            </div>
                            <button className="w-full mt-6 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg transition-colors text-sm font-medium">
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
