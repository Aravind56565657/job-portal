import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import JobForm from '../components/JobForm';

const EditJob = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const { data } = await axiosClient.get(`/api/jobs/${id}`);
                setJob(data);
            } catch (err) {
                setError("Job not found or access denied.");
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">Error</h2>
                <p className="text-gray-600 mt-2">{error}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-900">Edit Job Posting</h1>
                    <p className="text-gray-500 mt-2">Update the details for <span className="font-semibold text-gray-800">{job.title}</span>.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                        <span className="uppercase text-xs font-bold tracking-wider text-gray-500">Editing Mode</span>
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">Live</span>
                    </div>

                    <div className="p-8">
                        <JobForm initialData={job} isEdit={true} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditJob;
