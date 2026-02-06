import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import AuthContext from '../context/AuthContext';

const PostJob = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
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
        try {
            await axiosClient.post('/api/jobs', formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Error posting job');
        }
    };

    return (
        <div className="py-10 max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow border">
                <h1 className="text-2xl font-bold mb-6">Post a New Job</h1>
                {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Job Title</label>
                        <input type="text" name="title" onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Description</label>
                        <textarea name="description" onChange={handleChange} className="w-full px-3 py-2 border rounded" rows="4" required></textarea>
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Qualifications</label>
                        <textarea name="qualifications" onChange={handleChange} className="w-full px-3 py-2 border rounded" rows="3" required></textarea>
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Responsibilities</label>
                        <textarea name="responsibilities" onChange={handleChange} className="w-full px-3 py-2 border rounded" rows="3" required></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 mb-1">Location</label>
                            <input type="text" name="location" onChange={handleChange} className="w-full px-3 py-2 border rounded" required />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1">Salary Range</label>
                            <input type="text" name="salaryRange" onChange={handleChange} placeholder="e.g. $50k - $70k" className="w-full px-3 py-2 border rounded" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Job Type</label>
                        <select name="jobType" onChange={handleChange} className="w-full px-3 py-2 border rounded">
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Internship">Internship</option>
                            <option value="Contract">Contract</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Post Job</button>
                </form>
            </div>
        </div>
    );
};

export default PostJob;
