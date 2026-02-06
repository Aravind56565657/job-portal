import { useState, useEffect, useContext } from 'react';
import axiosClient from '../api/axiosClient';
import AuthContext from '../context/AuthContext';

const MyApplications = () => {
    const { user } = useContext(AuthContext);
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const { data } = await axiosClient.get('/api/applications/my-applications');
                setApplications(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchApplications();
    }, [user.token]);

    return (
        <div className="py-10 max-w-4xl mx-auto px-4">
            <h1 className="text-3xl font-bold mb-6">My Applications</h1>
            <div className="grid gap-4">
                {applications.map((app) => (
                    <div key={app._id} className="bg-white p-6 rounded-lg shadow border">
                        <h2 className="text-xl font-bold text-gray-800">{app.job?.title}</h2>
                        <p className="text-gray-600">{app.job?.companyName} - {app.job?.location}</p>
                        <div className="mt-4 flex justify-between items-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold 
                                ${app.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                                    app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-green-100 text-green-800'}`}>
                                {app.status}
                            </span>
                            <span className="text-gray-500 text-sm">Applied on: {new Date(app.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
                {applications.length === 0 && <p className="text-gray-500">You haven't applied to any jobs yet.</p>}
            </div>
        </div>
    );
};

export default MyApplications;
