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
        <div className="min-h-screen bg-gray-50 pt-28 pb-20 relative">

            {/* Success Toast */}
            {showSuccess && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-fade-in-down">
                    <span className="text-2xl">🎉</span>
                    <span className="font-bold">Application Sent Successfully! Good Luck!</span>
                </div>
            )}

            <div className="max-w-5xl mx-auto px-6">

                {/* Header Card (Glassmorphism) */}
                <div className="bg-white/80 backdrop-blur-md border border-white/50 p-8 rounded-3xl shadow-xl mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-bl-full -z-10 opacity-50"></div>

                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="w-20 h-20 bg-white rounded-2xl shadow-sm text-4xl flex items-center justify-center border border-gray-100">
                            {/* Fallback logo logic */}
                            🏢
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{job.title}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-gray-600 font-medium">
                                <span className="flex items-center gap-1 text-primary-700">🏢 {job.employer?.companyName}</span>
                                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                                <span>📍 {job.location}</span>
                                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                                <span>💰 {job.salaryRange}</span>
                                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">{job.jobType}</span>
                            </div>
                        </div>

                        {user?.role === 'job_seeker' && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                            >
                                Apply Now 🚀
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">📝</span>
                                Job Description
                            </h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                                {job.description}
                            </p>
                        </div>

                        {/* Responsibilities */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="bg-purple-100 text-purple-600 p-2 rounded-lg">⚡</span>
                                Key Responsibilities
                            </h3>
                            {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 ? (
                                <ul className="space-y-3">
                                    {job.responsibilities.map((res, index) => (
                                        <li key={index} className="flex gap-3 text-gray-700">
                                            <span className="text-purple-500 font-bold mt-1">✓</span>
                                            <span className="leading-relaxed">{res}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{job.responsibilities}</p>
                            )}
                        </div>

                        {/* Qualifications */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="bg-green-100 text-green-600 p-2 rounded-lg">🎓</span>
                                Qualifications
                            </h3>
                            {Array.isArray(job.qualifications) && job.qualifications.length > 0 ? (
                                <ul className="space-y-3">
                                    {job.qualifications.map((qual, index) => (
                                        <li key={index} className="flex gap-3 text-gray-700">
                                            <span className="text-green-500 font-bold mt-1">•</span>
                                            <span className="leading-relaxed">{qual}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{job.qualifications}</p>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl text-white shadow-xl">
                            <h3 className="font-bold text-xl mb-2">Interested?</h3>
                            <p className="text-gray-300 mb-6">Don't miss out on this opportunity. Applications are reviewed on a rolling basis.</p>
                            {user?.role === 'job_seeker' ? (
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full bg-white text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                                >
                                    Apply Now
                                </button>
                            ) : (
                                <div className="text-center p-3 bg-white/10 rounded-xl text-sm font-medium">
                                    Only Job Seekers can apply
                                </div>
                            )}
                        </div>

                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4">Job Overview</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Posted</span>
                                    <span className="font-semibold text-gray-900">{new Date(job.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Type</span>
                                    <span className="font-semibold text-gray-900">{job.jobType}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Location</span>
                                    <span className="font-semibold text-gray-900">{job.location}</span>
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
