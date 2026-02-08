import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const JobForm = ({ initialData, isEdit = false }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        location: '',
        salaryRange: '',
        jobType: 'Full-time',
        description: '',
        responsibilities: [''],
        qualifications: [''],
        ...(initialData || {})
    });

    // Handle updates to initialData (only if provided and meaningful)
    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setFormData(prev => ({
                ...prev,
                ...initialData,
                responsibilities: Array.isArray(initialData.responsibilities) && initialData.responsibilities.length
                    ? initialData.responsibilities
                    : (typeof initialData.responsibilities === 'string' ? initialData.responsibilities.split('\n') : ['']),
                qualifications: Array.isArray(initialData.qualifications) && initialData.qualifications.length
                    ? initialData.qualifications
                    : (typeof initialData.qualifications === 'string' ? initialData.qualifications.split('\n') : ['']),
            }));
        }
    }, [initialData]);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Array Item Handlers
    const handleArrayChange = (field, index, value) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData({ ...formData, [field]: newArray });
    };

    const addArrayItem = (field) => {
        setFormData({ ...formData, [field]: [...formData[field], ''] });
    };

    const removeArrayItem = (field, index) => {
        const newArray = formData[field].filter((_, i) => i !== index);
        setFormData({ ...formData, [field]: newArray.length ? newArray : [''] });
    };

    const handlePaste = (e, field, index) => {
        const text = e.clipboardData.getData('text');
        if (text.includes('\n')) {
            e.preventDefault();
            const newItems = text.split('\n').map(item => item.trim()).filter(item => item !== '');
            if (newItems.length > 0) {
                const currentArray = [...formData[field]];
                // Insert new items at current index, replacing the current item
                currentArray.splice(index, 1, ...newItems);
                setFormData({ ...formData, [field]: currentArray });
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Clean up empty strings from arrays
        const payload = {
            ...formData,
            responsibilities: formData.responsibilities.filter(item => item.trim() !== ''),
            qualifications: formData.qualifications.filter(item => item.trim() !== '')
        };

        try {
            if (isEdit) {
                await axiosClient.put(`/api/jobs/${initialData._id}`, payload);
            } else {
                await axiosClient.post('/api/jobs', payload);
            }
            navigate('/employer/jobs');
        } catch (err) {
            setError(err.response?.data?.message || 'Error saving job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-start gap-3 border border-red-100">
                    <span className="text-xl">⚠️</span>
                    <div>
                        <h4 className="font-bold text-sm">Something went wrong</h4>
                        <p className="text-sm">{error}</p>
                    </div>
                </div>
            )}

            {/* Basic Info */}
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Job Title <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="input-field"
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
                            value={formData.location}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="e.g. Remote / New York, NY"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Job Type</label>
                        <div className="relative">
                            <select
                                name="jobType"
                                value={formData.jobType}
                                onChange={handleChange}
                                className="input-field appearance-none cursor-pointer"
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Internship">Internship</option>
                                <option value="Contract">Contract</option>
                                <option value="Freelance">Freelance</option>
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">▼</div>
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
                            value={formData.salaryRange}
                            onChange={handleChange}
                            className="input-field pl-8"
                            placeholder="e.g. 80,000 - 120,000"
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="h-px bg-gray-100 my-8"></div>

            {/* Description */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Job Description <span className="text-red-500">*</span></label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="input-field h-32 resize-y"
                    placeholder="Provide a comprehensive overview of the role..."
                    required
                ></textarea>
            </div>

            {/* Responsibilities */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-gray-700">Key Responsibilities <span className="text-red-500">*</span></label>
                    <button type="button" onClick={() => addArrayItem('responsibilities')} className="text-sm font-bold text-primary-600 hover:text-primary-700">
                        + Add Item
                    </button>
                </div>
                <div className="space-y-3">
                    {formData.responsibilities.map((item, idx) => (
                        <div key={idx} className="flex gap-2">
                            <span className="mt-3 text-gray-400 text-xs">•</span>
                            <input
                                type="text"
                                value={item}
                                onChange={(e) => handleArrayChange('responsibilities', idx, e.target.value)}
                                onPaste={(e) => handlePaste(e, 'responsibilities', idx)}
                                className="input-field py-2"
                                placeholder="Add a responsibility..."
                                required={idx === 0} // Only first is required
                            />
                            {formData.responsibilities.length > 1 && (
                                <button type="button" onClick={() => removeArrayItem('responsibilities', idx)} className="text-gray-400 hover:text-red-500 px-2">
                                    ×
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Qualifications */}
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-bold text-gray-700">Qualifications & Requirements <span className="text-red-500">*</span></label>
                    <button type="button" onClick={() => addArrayItem('qualifications')} className="text-sm font-bold text-primary-600 hover:text-primary-700">
                        + Add Item
                    </button>
                </div>
                <div className="space-y-3">
                    {formData.qualifications.map((item, idx) => (
                        <div key={idx} className="flex gap-2">
                            <span className="mt-3 text-gray-400 text-xs">•</span>
                            <input
                                type="text"
                                value={item}
                                onChange={(e) => handleArrayChange('qualifications', idx, e.target.value)}
                                onPaste={(e) => handlePaste(e, 'qualifications', idx)}
                                className="input-field py-2"
                                placeholder="Add a qualification..."
                                required={idx === 0}
                            />
                            {formData.qualifications.length > 1 && (
                                <button type="button" onClick={() => removeArrayItem('qualifications', idx)} className="text-gray-400 hover:text-red-500 px-2">
                                    ×
                                </button>
                            )}
                        </div>
                    ))}
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
                    {loading ? (isEdit ? 'Saving...' : 'Posting...') : (isEdit ? '💾 Save Changes' : '🚀 Publish Job Now')}
                </button>
            </div>
        </form>
    );
};

export default JobForm;
