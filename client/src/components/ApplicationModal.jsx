import { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import axiosClient from '../api/axiosClient';

const ApplicationModal = ({ job, onClose, onSuccess }) => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        email: user?.email || '',
        phone: user?.phone || '',
        portfolioLink: user?.socialLinks?.portfolio || '',
        experience: '',
        coverLetter: '',
        resume: user?.resume || '' // Pre-fill if available
    });

    // Update form if user data loads late
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                email: prev.email || user.email || '',
                phone: prev.phone || user.phone || '',
                portfolioLink: prev.portfolioLink || user.socialLinks?.portfolio || '',
                resume: prev.resume || user.resume || ''
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!formData.email || !formData.phone) {
                setError("Email and Phone are required.");
                setLoading(false);
                return;
            }

            await axiosClient.post('/api/applications', {
                jobId: job._id,
                ...formData
            });
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit application');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold">Apply for {job.title}</h2>
                        <p className="text-blue-100 mt-1">{job.employer?.companyName} • {job.location}</p>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white text-2xl font-bold leading-none">
                        &times;
                    </button>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 flex items-start gap-3 border border-red-100">
                            <span className="text-xl">⚠️</span>
                            <div>
                                <h4 className="font-bold text-sm">Application Failed</h4>
                                <p className="text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Section: Contact Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                />
                            </div>
                        </div>

                        {/* Section: Professional Links */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Portfolio / LinkedIn URL</label>
                                <input
                                    type="url"
                                    name="portfolioLink"
                                    value={formData.portfolioLink}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="https://"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Years of Experience <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="e.g. 3 Years"
                                    required
                                />
                            </div>
                        </div>

                        {/* Section: Resume Alert */}
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-3">
                            <span className="text-2xl">📄</span>
                            <div>
                                <p className="text-sm text-blue-800 font-semibold">
                                    We will include your profile resume automatically.
                                </p>
                                <p className="text-xs text-blue-600">
                                    Ensure your profile resume is up to date in settings.
                                </p>
                            </div>
                        </div>

                        {/* Section: Cover Letter */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Cover Letter / Note <span className="text-red-500">*</span></label>
                            <textarea
                                name="coverLetter"
                                value={formData.coverLetter}
                                onChange={handleChange}
                                className="input-field h-32 resize-y"
                                placeholder="Why are you the best fit for this role? What excites you about this company?"
                                required
                            ></textarea>
                        </div>

                        {/* Actions */}
                        <div className="pt-4 flex gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Submitting...' : '🚀 Submit Application'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default ApplicationModal;
