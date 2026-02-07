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
        <div className="bg-gray-50 min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-6 max-w-5xl animate-fade-in">

                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-serif font-bold text-dark-900">My Applications</h1>
                    <p className="text-gray-500 mt-2">Track the status of your current job applications.</p>
                </div>

                <div className="space-y-6">
                    {applications.length > 0 ? (
                        applications.map((app) => (
                            <div key={app._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center hover:shadow-md transition-shadow group">

                                {/* Company Logo / Icon */}
                                <div className="w-16 h-16 bg-gray-900 rounded-xl flex items-center justify-center text-3xl shrink-0 text-white shadow-md">
                                    {app.job?.employer?.companyName?.charAt(0) || '🏢'}
                                </div>

                                {/* Job Details */}
                                <div className="flex-grow">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                                                {app.job?.title}
                                            </h2>
                                            <p className="text-gray-600 font-medium">
                                                {app.job?.companyName} <span className="text-gray-300 mx-2">•</span> {app.job?.location}
                                            </p>
                                        </div>

                                        {/* Status Badge */}
                                        <div className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide border flex items-center gap-2
                                            ${app.status === 'Applied' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                app.status === 'Interviewing' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                    app.status === 'Shortlisted' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                                        app.status === 'Hired' ? 'bg-green-50 text-green-700 border-green-100' :
                                                            'bg-red-50 text-red-700 border-red-100'}`}>
                                            <span className="text-lg">
                                                {app.status === 'Applied' && '📨'}
                                                {app.status === 'Interviewing' && '🤝'}
                                                {app.status === 'Shortlisted' && '⭐'}
                                                {app.status === 'Hired' && '🎉'}
                                                {app.status === 'Rejected' && '❌'}
                                            </span>
                                            {app.status}
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                                            📅 Applied: {new Date(app.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                                            🆔 ID: #{app._id.slice(-6)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                            <div className="text-5xl mb-4">📭</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Applications Yet</h3>
                            <p className="text-gray-500 mb-6">Start your career journey by browsing open roles.</p>
                            <a href="/jobs" className="btn-primary inline-flex items-center gap-2">
                                🔍 Browse Jobs
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyApplications;
