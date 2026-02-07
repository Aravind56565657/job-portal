import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

const EmployerDashboard = () => {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({ activeJobs: 0, totalApplicants: 0, shortlistedCandidates: 0 });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch Jobs
                const { data: jobsData } = await axiosClient.get('/api/jobs/my-jobs');
                setJobs(jobsData);

                // Fetch Stats
                const { data: statsData } = await axiosClient.get('/api/dashboard/employer');
                setStats(statsData);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    return (
        <div className="pt-28 pb-12 px-6 bg-gray-50 min-h-screen font-sans">
            <div className="container mx-auto max-w-6xl">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome back, {user?.name?.split(' ')[0]} 👋
                        </h1>
                        <p className="text-gray-500 mt-1">Here's what's happening with your job postings.</p>
                    </div>
                    <Link to="/post-job" className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-gray-200 transition-all flex items-center gap-2">
                        <span>+</span>
                        Post New Job
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Active Jobs</p>
                            <h3 className="text-3xl font-bold text-gray-900">{stats.activeJobs || 0}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-blue-50 text-blue-600">
                            💼
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Total Applicants</p>
                            <h3 className="text-3xl font-bold text-gray-900">{stats.totalApplicants || 0}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-purple-50 text-purple-600">
                            👥
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-1">Shortlisted Candidates</p>
                            <h3 className="text-3xl font-bold text-gray-900">{stats.shortlistedCandidates || 0}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-yellow-50 text-yellow-600">
                            ⭐
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Recent Job Postings (Left Column) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-bold text-gray-900">Recent Job Postings</h2>
                            <Link to="/employer/jobs" className="text-primary-600 font-semibold hover:text-primary-700 text-sm">View All</Link>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                            </div>
                        ) : (Array.isArray(jobs) && jobs.length > 0) ? (
                            <div className="space-y-4">
                                {jobs.slice(0, 5).map(job => (
                                    <div key={job._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-primary-100 hover:shadow-md transition-all group">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                                                    {job.title}
                                                </h3>
                                                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                                    <span className="flex items-center gap-1">📍 {job.location}</span>
                                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                    <span>📅 {formatDate(job.createdAt)}</span>
                                                </div>
                                            </div>
                                            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full uppercase tracking-wide">
                                                Active
                                            </span>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-gray-50 flex gap-4">
                                            <Link to={`/job/${job._id}/applicants`} className="text-sm font-semibold text-gray-600 hover:text-primary-600 flex items-center gap-1">
                                                👥 View Applicants
                                            </Link>
                                            <Link to={`/employer/jobs`} className="text-sm font-semibold text-gray-600 hover:text-primary-600 flex items-center gap-1">
                                                ✏️ Manage
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white p-10 rounded-2xl border border-dashed border-gray-300 text-center">
                                <div className="text-4xl mb-4">📝</div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">No jobs posted yet</h3>
                                <p className="text-gray-500 mb-6">Create your first job posting to start finding talent.</p>
                                <Link to="/post-job" className="text-primary-600 font-bold hover:underline">Create a Job Posting</Link>
                            </div>
                        )}
                    </div>

                    {/* Company Profile Widget (Right Column) */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Company Profile</h2>

                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-3xl mb-4 overflow-hidden">
                                    {user?.companyLogo || user?.profilePhoto ? (
                                        <img src={user.companyLogo || user.profilePhoto} alt="Logo" className="w-full h-full object-contain" />
                                    ) : (
                                        '🏢'
                                    )}
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg">
                                    {user?.companyName || user?.name || "Company Name"}
                                </h3>
                                <a href={user?.companyWebsite || '#'} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-primary-600 mt-1">
                                    {user?.companyWebsite || "Add website"}
                                </a>

                                <Link to="/onboarding" className="mt-6 w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-lg text-sm transition-colors">
                                    Edit Company Profile
                                </Link>
                            </div>
                        </div>

                        {/* Quick Tips Card */}
                        <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-6 rounded-2xl text-white shadow-lg">
                            <h3 className="font-bold text-lg mb-2">✨ Hiring Tip</h3>
                            <p className="text-primary-100 text-sm leading-relaxed">
                                Detailed job descriptions attract 3x more relevant candidates. Make sure to list specific requirements and perks!
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EmployerDashboard;
