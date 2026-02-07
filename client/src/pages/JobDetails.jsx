import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import AuthContext from '../context/AuthContext';

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [coverLetter, setCoverLetter] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);

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

    const handleApply = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/api/applications',
                { jobId: job._id, coverLetter }
            );
            setMessage('Application submitted successfully!');
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error applying');
        }
    };

    if (!job) return <div className="p-10 text-center">Loading Job...</div>;

    return (
        <div className="py-10 max-w-4xl mx-auto px-4">
            <div className="bg-white p-8 rounded-lg shadow border mb-6">
                <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                <p className="text-xl text-gray-700 mb-4">{job.employer.companyName}</p>
                <div className="flex gap-4 text-gray-600 mb-6">
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.jobType}</span>
                    <span>•</span>
                    <span>{job.salaryRange}</span>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Description</h3>
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed">{job.description}</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Responsibilities</h3>
                        {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 ? (
                            <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                {job.responsibilities.map((res, index) => (
                                    <li key={index}>{res}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-700 whitespace-pre-line">{job.responsibilities}</p>
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-2">Qualifications</h3>
                        {Array.isArray(job.qualifications) && job.qualifications.length > 0 ? (
                            <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                {job.qualifications.map((qual, index) => (
                                    <li key={index}>{qual}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-700 whitespace-pre-line">{job.qualifications}</p>
                        )}
                    </div>
                </div>
            </div>

            {user?.role === 'job_seeker' && (
                <div className="bg-white p-8 rounded-lg shadow border">
                    <h2 className="text-2xl font-bold mb-4">Apply for this Position</h2>
                    {message && <div className={`p-3 rounded mb-4 ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}
                    <form onSubmit={handleApply}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Cover Letter / Note</label>
                            <textarea
                                className="w-full px-3 py-2 border rounded"
                                rows="4"
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                placeholder="Why are you a good fit for this role?"
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 text-lg font-semibold">Submit Application</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default JobDetails;
