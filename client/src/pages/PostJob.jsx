import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import AuthContext from '../context/AuthContext';

const PostJob = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        qualifications: '',
        responsibilities: '',
        location: '',
        salaryRange: '',
        jobType: 'Full-time',
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosClient.post('/api/jobs', formData);
            navigate('/dashboard/employer');
        } catch (err) {
            setError(err.response?.data?.message || 'Error posting job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Post a New Opportunity</h1>
                    <p className="text-gray-500 mt-2">Reach thousands of job seekers by creating a detailed job posting.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Form Header */}
                    <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                        <span className="uppercase text-xs font-bold tracking-wider text-gray-500">Job Details Form</span>
                        <span className="text-primary-600 font-semibold text-sm">Draft</span>
                    </div>

                    <div className="p-8">
                        {error && (
                            <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 flex items-start gap-3 border border-red-100">
                                <span className="text-xl">⚠️</span>
                                <div>
                                    <h4 className="font-bold text-sm">Something went wrong</h4>
                                    <p className="text-sm">{error}</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Section 1: Basic Info */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Job Title <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="title"
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all outline-none font-medium text-gray-800 placeholder-gray-400"
                                        placeholder="e.g. Senior Frontend Developer"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Location <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            name="location"
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all outline-none font-medium text-gray-800 placeholder-gray-400"
                                            placeholder="e.g. Remote / New York, NY"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Job Type</label>
                                        <div className="relative">
                                            <select
                                                name="jobType"
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all outline-none font-medium text-gray-800 bg-white appearance-none cursor-pointer"
                                            >
                                                <option value="Full-time">Full-time</option>
                                                <option value="Part-time">Part-time</option>
                                                <option value="Internship">Internship</option>
                                                <option value="Contract">Contract</option>
                                                <option value="Freelance">Freelance</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                                                ▼
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Salary Range <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3.5 text-gray-400 font-bold">$</span>
                                        <input
                                            type="text"
                                            name="salaryRange"
                                            onChange={handleChange}
                                            className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all outline-none font-medium text-gray-800 placeholder-gray-400"
                                            placeholder="e.g. 80,000 - 120,000"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-gray-100 my-8"></div>

                            {/* Section 2: Detailed Info */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Job Description <span className="text-red-500">*</span></label>
                                    <p className="text-xs text-gray-500 mb-3">Provide a comprehensive overview of the role.</p>
                                    <textarea
                                        name="description"
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all outline-none font-medium text-gray-800 placeholder-gray-400 h-32 resize-y"
                                        placeholder="What will this person be doing? What is the team like?"
                                        required
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Key Responsibilities <span className="text-red-500">*</span></label>
                                    <textarea
                                        name="responsibilities"
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all outline-none font-medium text-gray-800 placeholder-gray-400 h-24 resize-y"
                                        placeholder="Bullet points of daily tasks..."
                                        required
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Qualifications & Requirements <span className="text-red-500">*</span></label>
                                    <textarea
                                        name="qualifications"
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all outline-none font-medium text-gray-800 placeholder-gray-400 h-24 resize-y"
                                        placeholder="Skills, education, and experience needed..."
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-bold shadow-lg shadow-gray-200 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Posting...' : '🚀 Publish Job Now'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostJob;
