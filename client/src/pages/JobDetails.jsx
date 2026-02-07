import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import AuthContext from '../context/AuthContext';
import ApplicationModal from '../components/ApplicationModal';

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const { data } = await axiosClient.get(`/api/jobs/${id}`);
                setJob(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchJob();
    }, [id]);

    const handleSuccess = () => {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000); // Hide after 5s
    };

    if (!job) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 font-sans">

            {/* Success Toast */}
            {showSuccess && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-fade-in-down">
                    <span className="text-xl">🎉</span>
                    <span className="font-semibold">Application Sent Successfully!</span>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Main Content Column (8 cols) */}
                    <div className="lg:col-span-8">

                        {/* Unified Job Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                            {/* Header Section */}
                            <div className="p-8 border-b border-gray-100">
                                <div className="flex flex-col sm:flex-row gap-6 items-start">
                                    <div className="w-20 h-20 bg-gray-900 rounded-xl flex items-center justify-center text-white text-3xl font-bold shrink-0 shadow-sm">
                                        {job.employer?.companyName?.charAt(0) || '🏢'}
                                    </div>
                                    <div className="flex-1">
                                        <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">{job.title}</h1>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-gray-600 font-medium">
                                            <span className="text-gray-900 flex items-center gap-1.5">
                                                <span className="text-lg">🏢</span> {job.employer?.companyName}
                                            </span>
                                            <span className="hidden sm:inline text-gray-300">•</span>
                                            <span className="flex items-center gap-1.5">
                                                <span className="text-lg">📍</span> {job.location}
                                            </span>
                                            <span className="hidden sm:inline text-gray-300">•</span>
                                            <span className="flex items-center gap-1.5 text-green-700 bg-green-50 px-2 py-0.5 rounded">
                                                💰 {job.salaryRange}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Job Details Content */}
                            <div className="p-8 space-y-10">

                                {/* Description */}
                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-l-4 border-blue-600 pl-3">About the job</h3>
                                    <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                                        {job.description}
                                    </div>
                                </section>

                                {/* Responsibilities */}
                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-l-4 border-purple-600 pl-3">Key Responsibilities</h3>
                                    {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 ? (
                                        <ul className="space-y-3">
                                            {job.responsibilities.map((res, index) => (
                                                <li key={index} className="flex gap-4 text-gray-700 group">
                                                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2.5 shrink-0 group-hover:scale-125 transition-transform"></span>
                                                    <span className="leading-relaxed">{res}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-700 whitespace-pre-line">{job.responsibilities}</p>
                                    )}
                                </section>

                                {/* Qualifications */}
                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 border-l-4 border-green-600 pl-3">Qualifications</h3>
                                    {Array.isArray(job.qualifications) && job.qualifications.length > 0 ? (
                                        <ul className="space-y-3">
                                            {job.qualifications.map((qual, index) => (
                                                <li key={index} className="flex gap-4 text-gray-700 group">
                                                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2.5 shrink-0 group-hover:scale-125 transition-transform"></span>
                                                    <span className="leading-relaxed">{qual}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-700 whitespace-pre-line">{job.qualifications}</p>
                                    )}
                                </section>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Column (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Action Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-28">
                            <h3 className="font-bold text-gray-900 text-lg mb-2">Interested in this role?</h3>
                            <p className="text-gray-500 text-sm mb-6">
                                Applications are reviewed on a rolling basis. Ensure your profile is up to date.
                            </p>

                            {user?.role === 'job_seeker' ? (
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full bg-gray-900 hover:bg-black text-white px-6 py-4 rounded-xl font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1"
                                >
                                    Apply Now 🚀
                                </button>
                            ) : (
                                <div className="text-center p-4 bg-gray-50 rounded-xl text-sm font-medium text-gray-500 border border-gray-100">
                                    Login as a Job Seeker to apply
                                </div>
                            )}

                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <h4 className="font-semibold text-gray-900 text-sm mb-4 uppercase tracking-wider">Job Overview</h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm group cursor-default">
                                        <span className="text-gray-500 group-hover:text-blue-600 transition-colors">📅 Posted</span>
                                        <span className="font-semibold text-gray-900">{new Date(job.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm group cursor-default">
                                        <span className="text-gray-500 group-hover:text-blue-600 transition-colors">💼 Type</span>
                                        <span className="font-semibold text-gray-900">{job.jobType}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm group cursor-default">
                                        <span className="text-gray-500 group-hover:text-blue-600 transition-colors">📍 Location</span>
                                        <span className="font-semibold text-gray-900">{job.location}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm group cursor-default">
                                        <span className="text-gray-500 group-hover:text-blue-600 transition-colors">🆔 Job ID</span>
                                        <span className="font-mono text-xs text-gray-400">#{job._id.slice(-6)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <ApplicationModal
                    job={job}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={handleSuccess}
                />
            )}

        </div>
    );
};

export default JobDetails;
