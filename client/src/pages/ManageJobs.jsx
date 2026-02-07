import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import AuthContext from '../context/AuthContext';

const ManageJobs = () => {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // Fetch all jobs and filter client-side for now
                const { data } = await axiosClient.get('/api/jobs');
                const myJobs = data.filter(job => job.employer._id === user._id);
                setJobs(myJobs);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [user._id]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
            try {
                await axiosClient.delete(`/api/jobs/${id}`);
                setJobs(jobs.filter(job => job._id !== id));
            } catch (error) {
                console.error(error);
                alert("Failed to delete job");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Job Postings</h1>
                        <p className="text-gray-500 mt-2">View, edit, or remove your active listings.</p>
                    </div>
                    <Link to="/post-job" className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md transition-all">
                        + Post New Job
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {jobs.map((job) => (
                            <div key={job._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-all">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
                                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">
                                            Active
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span>📍 {job.location}</span>
                                        <span>•</span>
                                        <span>💼 {job.jobType}</span>
                                        <span>•</span>
                                        <span>📅 Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <Link
                                        to={`/job/${job._id}/applicants`}
                                        className="flex-1 md:flex-none text-center px-4 py-2 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        View Applicants
                                    </Link>
                                    <Link
                                        to={`/jobs/${job._id}`}
                                        className="px-4 py-2 border border-gray-200 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        View
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(job._id)}
                                        className="px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}

                        {jobs.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                                <p className="text-gray-500 text-lg mb-4">You haven't posted any jobs yet.</p>
                                <Link to="/post-job" className="text-primary-600 font-bold hover:underline">
                                    Create your first job posting
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageJobs;
