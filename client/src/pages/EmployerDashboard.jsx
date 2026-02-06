import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const EmployerDashboard = () => {
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
                            Employer Dashboard
                        </h1>
                        <p className="text-gray-500 mt-2">Manage your job postings and find the best talent.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/post-job" className="btn-primary flex items-center gap-2">
                            <span>+</span> Post New Job
                        </Link>
                    </div>
                </div>

                {/* Employer Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard title="Active Jobs" value="5" icon="💼" color="#0ea5e9" />
                    <StatCard title="Total Applicants" value="128" icon="👥" color="#8b5cf6" />
                    <StatCard title="New Candidates" value="12" icon="🔥" color="#f43f5e" />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column (Recent Jobs) */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="card">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                Your Recent Job Postings
                            </h2>
                            {/* Placeholder Data */}
                            <div className="space-y-4">
                                {[
                                    { id: 1, title: 'Senior Frontend Engineer', applicants: 45, status: 'Active', posted: '2 days ago' },
                                    { id: 2, title: 'Product Manager', applicants: 28, status: 'Active', posted: '1 week ago' },
                                    { id: 3, title: 'UX Designer', applicants: 12, status: 'Closed', posted: '2 weeks ago' },
                                ].map((job) => (
                                    <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border shadow-sm text-lg">
                                                💼
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-dark-900">{job.title}</h4>
                                                <p className="text-sm text-gray-500">{job.posted} • {job.applicants} Applicants</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${job.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                                                }`}>
                                                {job.status}
                                            </span>
                                            <Link to={`/job/${job.id}/applicants`} className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                                                Manage
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 text-center">
                                <Link to="/employer/jobs" className="text-primary-600 font-semibold hover:underline">
                                    View All Jobs
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Profile & Insights) */}
                    <div className="space-y-8">
                        <div className="card bg-gradient-to-br from-dark-800 to-dark-900 text-white">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 p-1">
                                    <div className="w-full h-full bg-dark-900 rounded-full flex items-center justify-center font-bold text-2xl">
                                        {user?.name?.charAt(0)}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{user?.name}</h3>
                                    <p className="text-gray-400 text-sm">{user?.email}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm border-b border-gray-700 pb-2">
                                    <span className="text-gray-400">Account</span>
                                    <span className="font-medium">Employer</span>
                                </div>
                                <div className="flex justify-between text-sm border-b border-gray-700 pb-2">
                                    <span className="text-gray-400">Company Profile</span>
                                    <span className="font-medium text-green-400">Verified</span>
                                </div>
                            </div>
                            <button className="w-full mt-6 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg transition-colors text-sm font-medium">
                                Edit Company Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployerDashboard;
