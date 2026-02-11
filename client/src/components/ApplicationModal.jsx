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

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('type', 'resume');

        setLoading(true); // temporary loading state for upload
        try {
            const res = await axiosClient.post('/api/users/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData(prev => ({ ...prev, resume: res.data.url }));
        } catch (error) {
            console.error("Upload failed", error);
            setError("Failed to upload resume. Please try again.");
        } finally {
            setLoading(false);
        }
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

                        {/* Section: Resume Selection */}
                        <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                📄 Resume <span className="text-red-500">*</span>
                            </h3>

                            <div className="space-y-3">
                                {/* Option 1: Use Profile Resume */}
                                {user?.resume && (
                                    <label className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300 transition-colors">
                                        <input
                                            type="radio"
                                            name="resumeOption"
                                            checked={formData.resume === user.resume}
                                            onChange={() => setFormData({ ...formData, resume: user.resume })}
                                            className="mt-1"
                                        />
                                        <div className="flex-1">
                                            <span className="font-semibold text-gray-700 block">Use Profile Resume</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <a
                                                    href={user.resume}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    👁️ View Current Resume
                                                </a>
                                            </div>
                                        </div>
                                    </label>
                                )}

                                {/* Option 2: Upload New Resume */}
                                <label className={`flex items-start gap-3 p-3 bg-white rounded-lg border cursor-pointer transition-colors ${formData.resume !== user?.resume ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}>
                                    <input
                                        type="radio"
                                        name="resumeOption"
                                        checked={formData.resume !== user?.resume || !user?.resume}
                                        onChange={() => {
                                            // Don't clear immediately, just select this option to show upload
                                            if (formData.resume === user?.resume) setFormData({ ...formData, resume: '' });
                                        }}
                                        className="mt-1"
                                    />
                                    <div className="w-full">
                                        <span className="font-semibold text-gray-700 block mb-2">Upload Different Resume</span>
                                        {(formData.resume !== user?.resume || !user?.resume) && (
                                            <input
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={handleFileUpload}
                                                className="block w-full text-sm text-gray-500
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-full file:border-0
                                                    file:text-xs file:font-semibold
                                                    file:bg-blue-50 file:text-blue-700
                                                    hover:file:bg-blue-100
                                                "
                                            />
                                        )}
                                        {formData.resume && formData.resume !== user?.resume && (
                                            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                                                ✓ New resume uploaded successfully!
                                            </p>
                                        )}
                                    </div>
                                </label>
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
