import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const JobSearch = () => {
    const [jobs, setJobs] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchJobs = async (term = '') => {
        setLoading(true);
        try {
            const { data } = await axiosClient.get(`/api/jobs?keyword=${term}`);
            setJobs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs(keyword);
    };

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

                            {/* Search Input in Sidebar for Mobile/Desktop unification */}
                            <form onSubmit={handleSearch} className="mb-8">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Job title, skills..."
                                        className="input-field py-2 text-sm"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                    />
                                    <button type="submit" className="absolute right-2 top-1.5 text-primary-600 hover:text-primary-800">
                                        🔍
                                    </button>
                                </div>
                            </form>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-semibold mb-3 text-sm text-gray-600 uppercase tracking-wider">Job Type</h4>
                                    <div className="space-y-2">
                                        {['Full Time', 'Part Time', 'Contract', 'Internship'].map(type => (
                                            <label key={type} className="flex items-center gap-2 cursor-pointer group">
                                                <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                                <span className="text-gray-700 group-hover:text-primary-600 transition-colors">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-3 text-sm text-gray-600 uppercase tracking-wider">Salary Range</h4>
                                    <div className="space-y-2">
                                        {['$50k - $80k', '$80k - $120k', '$120k+', 'Hourly'].map(range => (
                                            <label key={range} className="flex items-center gap-2 cursor-pointer group">
                                                <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                                <span className="text-gray-700 group-hover:text-primary-600 transition-colors">{range}</span>
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
                            <select className="border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500">
                                <option>Newest First</option>
                                <option>Oldest First</option>
                            </select>
                        </div>

                        {loading ? (
                            <div className="text-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                                <p className="mt-4 text-gray-500">Loading jobs...</p>
                            </div>
                        ) : jobs.length > 0 ? (
                            jobs.map((job) => (
                                <div key={job._id} className="card hover:border-primary-200 transition-all duration-300 group flex flex-col md:flex-row gap-6 relative overflow-hidden">
                                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                        🏢
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h2 className="text-xl font-bold text-dark-900 group-hover:text-primary-600 transition-colors">{job.title}</h2>
                                                <p className="text-gray-600 font-medium mt-1">{job.employer?.companyName || 'Confidential Company'}</p>
                                            </div>
                                            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold border border-green-100">
                                                Active
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-4">
                                            <span className="flex items-center gap-1">📍 {job.location}</span>
                                            <span className="flex items-center gap-1">💼 {job.jobType}</span>
                                            <span className="flex items-center gap-1">💰 {job.salaryRange}</span>
                                        </div>

                                        <p className="mt-4 text-gray-600 line-clamp-2 text-sm leading-relaxed">{job.description}</p>
                                    </div>

                                    <div className="flex flex-col justify-center items-end min-w-[140px]">
                                        <Link to={`/jobs/${job._id}`} className="btn-primary w-full text-center text-sm">View Details</Link>
                                        <p className="text-xs text-gray-400 mt-3 text-center w-full">Posted 2 days ago</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                                <p className="text-gray-500 text-lg">No jobs found matching specific criteria.</p>
                                <button onClick={() => { setKeyword(''); fetchJobs(''); }} className="text-primary-600 font-semibold mt-2 hover:underline">Clear Filters</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobSearch;
