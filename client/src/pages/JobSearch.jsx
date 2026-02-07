import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const JobSearch = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');
    const [selectedJobTypes, setSelectedJobTypes] = useState([]);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (keyword) params.append('keyword', keyword);
            if (location) params.append('location', location);
            if (selectedJobTypes.length > 0) params.append('jobType', selectedJobTypes.join(','));

            const { data } = await axiosClient.get(`/api/jobs?${params.toString()}`);
            setJobs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []); // Initial load

    // Trigger search when Job Types change automatically (optional, or by button)
    // For better UX, let's keep it manual submit for text, auto for checkboxes if desired,
    // but the original code had a form submit. Let's make one unified search trigger.

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs();
    };

    const handleJobTypeChange = (type) => {
        setSelectedJobTypes(prev => {
            if (prev.includes(type)) {
                return prev.filter(t => t !== type);
            } else {
                return [...prev, type];
            }
        });
    };

    // Auto-search when filters like checkboxes change?
    // Let's do it for checkboxes to feel responsive
    useEffect(() => {
        // Debounce or just run? Let's just run for now as user base is small
        if (!loading) fetchJobs();
    }, [selectedJobTypes]);


    return (
        <div className="bg-gray-50 min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-6 max-w-7xl animate-fade-in">

                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold text-dark-900 mb-4">Find Your Next Opportunity</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">Browse thousands of job openings from top companies and startups. Filter by role, location, and more.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Filters Sidebar */}
                    <aside className="lg:w-1/4">
                        <div className="card sticky top-24">
                            <h3 className="font-bold text-lg mb-6 border-b pb-2">Filter Jobs</h3>

                            <form onSubmit={handleSearch}>
                                {/* Keyword */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Job title, skills..."
                                            className="input-field py-2 text-sm pl-9"
                                            value={keyword}
                                            onChange={(e) => setKeyword(e.target.value)}
                                        />
                                        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="City, State, or 'Remote'"
                                            className="input-field py-2 text-sm pl-9"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                        />
                                        <span className="absolute left-3 top-2.5 text-gray-400">📍</span>
                                    </div>
                                </div>

                                <button type="submit" className="w-full btn-primary py-2 text-sm mb-6">
                                    Search Jobs
                                </button>
                            </form>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-semibold mb-3 text-sm text-gray-600 uppercase tracking-wider">Job Type</h4>
                                    <div className="space-y-2">
                                        {['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Freelance'].map(type => (
                                            <label key={type} className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                                    checked={selectedJobTypes.includes(type)}
                                                    onChange={() => handleJobTypeChange(type)}
                                                />
                                                <span className="text-gray-700 group-hover:text-primary-600 transition-colors text-sm">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Job List */}
                    <div className="lg:w-3/4 space-y-6">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-gray-500">Showing <span className="font-bold text-dark-900">{jobs.length}</span> jobs</p>
                        </div>

                        {loading ? (
                            <div className="text-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                                <p className="mt-4 text-gray-500">Loading jobs...</p>
                            </div>
                        ) : jobs.length > 0 ? (
                            jobs.map((job) => (
                                <div key={job._id} className="card hover:border-primary-200 transition-all duration-300 group flex flex-col md:flex-row gap-6 relative overflow-hidden">
                                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-4xl flex-shrink-0 border border-gray-200">
                                        {job.employer?.companyName?.charAt(0) || '🏢'}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h2 className="text-xl font-bold text-dark-900 group-hover:text-primary-600 transition-colors">{job.title}</h2>
                                                <p className="text-gray-600 font-medium mt-1 flex items-center gap-2">
                                                    {job.employer?.companyName || 'Confidential Company'}
                                                </p>
                                            </div>
                                            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold border border-green-100">
                                                {job.jobType}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-4">
                                            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">📍 {job.location}</span>
                                            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">💰 {job.salaryRange}</span>
                                            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">📅 {new Date(job.createdAt).toLocaleDateString()}</span>
                                        </div>

                                        <p className="mt-4 text-gray-600 line-clamp-2 text-sm leading-relaxed">{job.description}</p>
                                    </div>

                                    <div className="flex flex-col justify-center items-end min-w-[140px]">
                                        <Link to={`/jobs/${job._id}`} className="btn-primary w-full text-center text-sm">View Details</Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                                <div className="text-4xl mb-4">🔍</div>
                                <h3 className="text-lg font-bold text-gray-900">No jobs found</h3>
                                <p className="text-gray-500 mt-1">Try adjusting your search filters or keywords.</p>
                                <button
                                    onClick={() => { setKeyword(''); setLocation(''); setSelectedJobTypes([]); }}
                                    className="text-primary-600 font-semibold mt-4 hover:underline"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobSearch;
