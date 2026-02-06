import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import AuthContext from '../context/AuthContext';

const ManageJobs = () => {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // Currently fetching all jobs, ideally should fetch only jobs posted by this employer
                // Depending on API, we might need a dedicated endpoint or filter on client
                // For simplicity, using public jobs endpoint but we should filter or use specific endpoint
                const { data } = await axiosClient.get('/api/jobs');
                const myJobs = data.filter(job => job.employer._id === user._id);
                setJobs(myJobs);
            } catch (error) {
                console.error(error);
            }
        };
        fetchJobs();
    }, [user._id]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await axiosClient.delete(`/api/jobs/${id}`);
                setJobs(jobs.filter(job => job._id !== id));
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="py-10 max-w-4xl mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6">Manage Jobs</h1>
            <div className="grid gap-4">
                {jobs.map((job) => (
                    <div key={job._id} className="bg-white p-6 rounded-lg shadow border flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">{job.title}</h2>
                            <p className="text-gray-600">{job.location} • {job.jobType}</p>
                            <p className="text-sm text-gray-500">Posted: {new Date(job.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-3">
                            <Link to={`/job/${job._id}/applicants`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">View Applicants</Link>
                            <button onClick={() => handleDelete(job._id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                ))}
                {jobs.length === 0 && <p className="text-gray-500">You haven't posted any jobs yet.</p>}
            </div>
        </div>
    );
};

export default ManageJobs;
