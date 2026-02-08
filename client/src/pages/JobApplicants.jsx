import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import AuthContext from '../context/AuthContext';

const JobApplicants = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const { data } = await axiosClient.get(`/api/applications/job/${id}`);
                setApplicants(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchApplicants();
    }, [id]);

    const updateStatus = async (appId, newStatus) => {
        try {
            await axiosClient.put(`/api/applications/${appId}/status`, { status: newStatus });
            setApplicants(applicants.map(app => app._id === appId ? { ...app, status: newStatus } : app));
        } catch (error) {
            console.error(error);
            console.error(error);
            alert(error.response?.data?.message || "Failed to update status");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Hired': return 'bg-green-100 text-green-700';
            case 'Rejected': return 'bg-red-100 text-red-700';
            case 'Shortlisted': return 'bg-yellow-100 text-yellow-700';
            case 'Interviewing': return 'bg-purple-100 text-purple-700';
            case 'Reviewed': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 flex items-center gap-4">
                    <Link to="/employer/jobs" className="p-2 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors">
                        ← Back
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Candidate Pipeline</h1>
                        <p className="text-gray-500 mt-1">Review and manage applicants for this role.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {applicants.map((app) => (
                            <div key={app._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full hover:shadow-md transition-all">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                                            {app.applicant?.name?.charAt(0) || '?'}
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{app.applicant?.name || 'Unknown Applicant'}</h3>
                                    <div className="flex flex-wrap gap-2 mb-3 text-xs font-semibold">
                                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">📧 {app.email}</span>
                                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">📱 {app.phone}</span>
                                        {app.experience && <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">⭐ {app.experience}</span>}
                                    </div>

                                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 mb-4 line-clamp-3 italic relative group">
                                        "{app.coverLetter || "No cover letter provided."}"
                                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-90 flex items-center justify-center transition-opacity border border-gray-100 rounded-lg">
                                            <span className="text-xs font-bold text-primary-600">Read Full Letter</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <select
                                            value={app.status}
                                            onChange={(e) => updateStatus(app._id, e.target.value)}
                                            className={`flex-1 text-sm font-bold border-none rounded-lg px-2 py-2 focus:ring-2 outline-none cursor-pointer transition-colors ${app.status === 'Shortlisted' ? 'bg-yellow-100 text-yellow-800 ring-yellow-200' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            <option value="Applied">New</option>
                                            <option value="Reviewed">Reviewed</option>
                                            <option value="Shortlisted">★ Shortlisted</option>
                                            <option value="Interviewing">Interviewing</option>
                                            <option value="Hired">Hire</option>
                                            <option value="Rejected">Reject</option>
                                        </select>

                                        {app.status !== 'Shortlisted' && app.status !== 'Hired' && app.status !== 'Rejected' && (
                                            <button
                                                onClick={() => updateStatus(app._id, 'Shortlisted')}
                                                className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 p-2 rounded-lg transition-colors"
                                                title="Shortlist Candidate"
                                            >
                                                ★
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        {app.resume && (
                                            <a href={app.resume} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 text-center rounded-lg border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 text-sm flex items-center justify-center gap-1">
                                                👁️ View Resume
                                            </a>
                                        )}
                                        {app.portfolioLink && (
                                            <a href={app.portfolioLink} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 text-center rounded-lg border border-gray-200 text-blue-600 font-semibold hover:bg-blue-50 text-sm flex items-center justify-center gap-1">
                                                🌐 Portfolio
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {applicants.length === 0 && (
                            <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                                <div className="text-4xl mb-4">🍃</div>
                                <h3 className="text-lg font-bold text-gray-900">No applicants yet</h3>
                                <p className="text-gray-500">Candidates will appear here once they apply.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobApplicants;
