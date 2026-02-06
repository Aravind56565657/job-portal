import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import AuthContext from '../context/AuthContext';

const JobApplicants = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [applicants, setApplicants] = useState([]);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const { data } = await axiosClient.get(`/api/applications/job/${id}`);
                setApplicants(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchApplicants();
    }, [id, user.token]);

    const updateStatus = async (appId, newStatus) => {
        try {
            await axiosClient.put(`/api/applications/${appId}/status`, { status: newStatus });
            setApplicants(applicants.map(app => app._id === appId ? { ...app, status: newStatus } : app));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="py-10 max-w-4xl mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6">Applicants</h1>
            <div className="grid gap-4">
                {applicants.map((app) => (
                    <div key={app._id} className="bg-white p-6 rounded-lg shadow border">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">{app.applicant.name}</h2>
                                <p className="text-gray-600">{app.applicant.email}</p>
                                {app.resume && <a href={app.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Resume</a>}
                                <p className="mt-2 text-gray-700 bg-gray-50 p-2 rounded">{app.coverLetter}</p>
                            </div>
                            <div>
                                <select
                                    value={app.status}
                                    onChange={(e) => updateStatus(app._id, e.target.value)}
                                    className="border rounded px-2 py-1 bg-white"
                                >
                                    <option value="Applied">Applied</option>
                                    <option value="Reviewed">Reviewed</option>
                                    <option value="Interviewing">Interviewing</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Hired">Hired</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
                {applicants.length === 0 && <p className="text-gray-500">No applicants yet.</p>}
            </div>
        </div>
    );
};

export default JobApplicants;
