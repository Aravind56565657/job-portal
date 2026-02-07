import { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import Stepper from '../components/Stepper';

const Onboarding = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(0);

    // Comprehensive State
    const [formData, setFormData] = useState({
        // Identity
        phone: '', alternatePhone: '', dob: '', gender: '', nationality: '',
        location: '', address: '', willingToRelocate: false, profilePhoto: '',

        // Professional
        headline: '', careerSummary: '', totalExperience: 0, employmentStatus: '',

        // Skills
        skills: '', softSkills: '', languages: [],

        // Arrays
        education: [], experience: [], projects: [], certifications: [], awards: [], publications: [],

        // Preferences
        jobPreferences: {
            roles: '', industries: '', employmentType: [], locations: '',
            salary: { min: 0, max: 0, currency: 'USD' }, noticePeriod: ''
        },

        // Docs
        resume: '', coverLetter: '',

        // Employer Specific
        companyName: '', companyWebsite: '', companyDescription: '', companyLogo: '',
        companySize: '', socialLinks: { linkedin: '', twitter: '', facebook: '' }
    });

    // Helper to handle text changes, supports deep nesting (e.g. jobPreferences.salary.max)
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;

        if (name.includes('.')) {
            const keys = name.split('.');
            setFormData(prev => {
                const newData = { ...prev };
                let current = newData;

                for (let i = 0; i < keys.length - 1; i++) {
                    // Shallow copy for immutability
                    current[keys[i]] = { ...current[keys[i]] };
                    current = current[keys[i]];
                }

                current[keys[keys.length - 1]] = val;
                return newData;
            });
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: val
            }));
        }
    };

    // Pre-fill form data: Fetch fresh data from server to ensure completeness
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // We fetch the profile directly to avoid stale data in context/localStorage
                const { data } = await axiosClient.get('/api/auth/profile');

                // Merge fetched data into formData
                setFormData(prev => ({
                    ...prev,
                    ...data,
                    // Ensure nested objects exists
                    jobPreferences: {
                        ...prev.jobPreferences,
                        ...(data.jobPreferences || {})
                    },
                    socialLinks: {
                        ...prev.socialLinks,
                        ...(data.socialLinks || {})
                    },
                    // Ensure arrays are arrays
                    education: data.education || [],
                    experience: data.experience || [],
                    projects: data.projects || [],
                    certifications: data.certifications || [],
                    languages: data.languages || [],
                    // Ensure specific fields map correctly
                    companyLogo: data.companyLogo || '',
                    profilePhoto: data.profilePhoto || ''
                }));
            } catch (error) {
                console.error("Failed to fetch profile for editing", error);
                // Fallback to context user if fetch fails
                if (user) {
                    setFormData(prev => ({ ...prev, ...user }));
                }
            }
        };

        fetchProfile();
    }, [user]); // We keep user dependency to re-run if context changes, but primarily we fetch.

    // Helper to handle Array Fields
    const handleArrayChange = (field, index, key, value) => {
        const newArray = [...formData[field]];
        newArray[index] = { ...newArray[index], [key]: value };
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const addArrayItem = (field, initialItem) => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], initialItem] }));
    };

    const removeArrayItem = (field, index) => {
        setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
    };

    // File Upload Handler
    const handleFileUpload = async (e, fieldName) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('type', 'auto');

        try {
            const res = await axiosClient.post('/api/users/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData(prev => ({ ...prev, [fieldName]: res.data.url }));
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed. Please try again.");
        }
    };

    // Array File Upload Handler
    const handleArrayFileUpload = async (e, field, index, key) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            const res = await axiosClient.post('/api/users/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            handleArrayChange(field, index, key, res.data.url);
        } catch (error) {
            console.error(error);
        }
    }

    const seekerSteps = [
        "Identity",
        "Professional",
        "Education & Skills",
        "Experience & Projects",
        "Certifications",
        "Prefs & Docs"
    ];

    const employerSteps = [
        "Company Profile",
        "Branding & Socials"
    ];

    const steps = user?.role === 'employer' ? employerSteps : seekerSteps;

    const cleanPayload = (data) => {
        if (Array.isArray(data)) {
            return data.map(item => cleanPayload(item));
        } else if (data !== null && typeof data === 'object') {
            const cleaned = {};
            for (const key in data) {
                const value = data[key];
                if (value === "") {
                    cleaned[key] = null;
                } else {
                    cleaned[key] = cleanPayload(value);
                }
            }
            return cleaned;
        }
        return data;
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Create a Deep Copy to avoid mutating state
            const rawPayload = JSON.parse(JSON.stringify({ ...formData, isProfileCompleted: true }));

            // Process Comma Separated Strings to Arrays
            if (typeof rawPayload.skills === 'string') rawPayload.skills = rawPayload.skills.split(',').map(s => s.trim()).filter(Boolean);
            if (typeof rawPayload.softSkills === 'string') rawPayload.softSkills = rawPayload.softSkills.split(',').map(s => s.trim()).filter(Boolean);

            // Job Preferences Parsing
            if (rawPayload.jobPreferences) {
                const prefs = rawPayload.jobPreferences;
                if (typeof prefs.roles === 'string') prefs.roles = prefs.roles.split(',').map(s => s.trim()).filter(Boolean);
                if (typeof prefs.locations === 'string') prefs.locations = prefs.locations.split(',').map(s => s.trim()).filter(Boolean);
                if (typeof prefs.employmentType === 'string') prefs.employmentType = prefs.employmentType.split(',').map(s => s.trim()).filter(Boolean);
            }

            const payload = cleanPayload(rawPayload);

            const { data } = await axiosClient.put('/api/users/profile', payload);

            const updatedUser = { ...user, ...data };
            localStorage.setItem('userInfo', JSON.stringify(updatedUser));

            window.location.href = user.role === 'employer' ? '/dashboard/employer' : '/dashboard/seeker';
        } catch (error) {
            console.error("Profile Update Error:", error);
            alert("Error saving profile: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-28 pb-10 px-4">
            <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                {/* Stepper Header */}
                <div className="bg-white p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Setup Your Profile</h2>
                    <Stepper steps={steps} currentStep={step} />
                </div>

                <div className="p-8 md:p-10 min-h-[500px]">

                    {/* ================= EMPLOYER FLOW ================= */}
                    {user?.role === 'employer' ? (
                        <>
                            {step === 0 && (
                                <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
                                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Company Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <label className="text-sm font-semibold text-gray-700">Company Name <span className="text-red-500">*</span></label>
                                            <input className="input-field" placeholder="e.g. Acme Corp" name="companyName" value={formData.companyName} onChange={handleChange} required />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-semibold text-gray-700">Company Website</label>
                                            <input className="input-field" placeholder="https://..." name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-semibold text-gray-700">Company Size</label>
                                            <select className="input-field" name="companySize" value={formData.companySize} onChange={handleChange}>
                                                <option value="">Select Size</option>
                                                <option value="1-10">1-10 Employees</option>
                                                <option value="11-50">11-50 Employees</option>
                                                <option value="51-200">51-200 Employees</option>
                                                <option value="201-500">201-500 Employees</option>
                                                <option value="500+">500+ Employees</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-semibold text-gray-700">Headquarters Location <span className="text-red-500">*</span></label>
                                            <input className="input-field" placeholder="City, Country" name="location" value={formData.location} onChange={handleChange} required />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-700">About Company <span className="text-red-500">*</span></label>
                                        <textarea className="input-field h-32" placeholder="Tell us about your company culture and mission..." name="companyDescription" value={formData.companyDescription} onChange={handleChange} required />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-700">Contact Phone <span className="text-red-500">*</span></label>
                                        <input className="input-field" placeholder="+1 (555) 000-0000" name="phone" value={formData.phone} onChange={handleChange} required />
                                    </div>
                                </div>
                            )}

                            {step === 1 && (
                                <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
                                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Branding & Socials</h3>

                                    <div className="flex flex-col items-center gap-4 mb-8">
                                        <div className="relative group cursor-pointer">
                                            <div className="w-32 h-32 rounded-xl bg-gray-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                                                {formData.companyLogo ? (
                                                    <img src={formData.companyLogo} alt="Logo" className="w-full h-full object-contain p-2" />
                                                ) : (
                                                    <span className="text-4xl text-gray-300">🏢</span>
                                                )}
                                            </div>
                                            <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full shadow-md cursor-pointer hover:bg-primary-700 transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'companyLogo')} />
                                            </label>
                                        </div>
                                        <span className="text-sm font-medium text-gray-500">Upload Company Logo</span>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-semibold text-gray-700">LinkedIn URL</label>
                                            <input className="input-field" placeholder="https://linkedin.com/company/..." name="socialLinks.linkedin" value={formData.socialLinks.linkedin} onChange={handleChange} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-semibold text-gray-700">Twitter / X URL</label>
                                            <input className="input-field" placeholder="https://twitter.com/..." name="socialLinks.twitter" value={formData.socialLinks.twitter} onChange={handleChange} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-semibold text-gray-700">Facebook URL</label>
                                            <input className="input-field" placeholder="https://facebook.com/..." name="socialLinks.facebook" value={formData.socialLinks.facebook} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        /* ================= JOB SEEKER FLOW ================= */
                        <>
                            {step === 0 && (
                                <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
                                    <div className="flex flex-col items-center gap-4 mb-8">
                                        <div className="relative group cursor-pointer">
                                            <div className="w-28 h-28 rounded-full bg-gray-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                                                {formData.profilePhoto ? (
                                                    <img src={formData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-4xl text-gray-300">📷</span>
                                                )}
                                            </div>
                                            <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full shadow-md cursor-pointer hover:bg-primary-700 transition-colors">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                                <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'profilePhoto')} />
                                            </label>
                                        </div>
                                        <span className="text-sm font-medium text-gray-500">Upload Profile Photo</span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <label className="text-sm font-semibold text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                                            <input className="input-field" placeholder="+1 (555) 000-0000" name="phone" value={formData.phone} onChange={handleChange} required />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-semibold text-gray-700">Current Location <span className="text-red-500">*</span></label>
                                            <input className="input-field" placeholder="City, Country" name="location" value={formData.location} onChange={handleChange} required />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-sm font-semibold text-gray-700">Date of Birth</label>
                                            <input className="input-field" type="date" name="dob" value={formData.dob} onChange={handleChange} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-semibold text-gray-700">Gender</label>
                                            <select className="input-field" name="gender" value={formData.gender} onChange={handleChange}>
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 1 && (
                                <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-700">Professional Headline <span className="text-red-500">*</span></label>
                                        <input className="input-field" placeholder="e.g. Senior Full Stack Developer | React & Node.js" name="headline" value={formData.headline} onChange={handleChange} required />
                                        <p className="text-xs text-gray-500">A short, catchy title that describes your current role.</p>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-700">Career Summary</label>
                                        <textarea className="input-field h-32" placeholder="Briefly describe your experience, key skills, and what you are looking for..." name="careerSummary" value={formData.careerSummary} onChange={handleChange} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <label className="text-sm font-semibold text-gray-700">Total Experience (Years) <span className="text-red-500">*</span></label>
                                            <input type="number" className="input-field" placeholder="e.g. 5" name="totalExperience" value={formData.totalExperience} onChange={handleChange} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-semibold text-gray-700">Employment Status <span className="text-red-500">*</span></label>
                                            <select className="input-field" name="employmentStatus" value={formData.employmentStatus} onChange={handleChange}>
                                                <option value="">Select Status</option>
                                                <option value="Employed">Employed</option>
                                                <option value="Unemployed">Unemployed</option>
                                                <option value="Student">Student</option>
                                                <option value="Fresher">Fresher</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-gray-700">Technical Skills <span className="text-red-500">*</span></label>
                                        <input className="input-field" placeholder="e.g. React, Node.js, Python, AWS (comma separated)" name="skills" value={formData.skills} onChange={handleChange} required />
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="text-lg font-bold text-gray-800">Education Details</label>
                                            <button type="button" onClick={() => addArrayItem('education', { degree: '', institution: '', startYear: '', endYear: '' })} className="text-primary-600 text-sm font-bold hover:text-primary-700">+ Add Degree</button>
                                        </div>

                                        {formData.education.length === 0 && (
                                            <div className="text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
                                                No education added yet. Click "+ Add Degree" to start.
                                            </div>
                                        )}

                                        {formData.education.map((edu, idx) => (
                                            <div key={idx} className="bg-gray-50 p-6 rounded-xl mb-4 border border-gray-100 relative group">
                                                <button onClick={() => removeArrayItem('education', idx)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                </button>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-semibold text-gray-500 uppercase">Degree</label>
                                                        <input className="input-field" placeholder="e.g. B.Tech Computer Science" value={edu.degree} onChange={(e) => handleArrayChange('education', idx, 'degree', e.target.value)} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-semibold text-gray-500 uppercase">Institution</label>
                                                        <input className="input-field" placeholder="University Name" value={edu.institution} onChange={(e) => handleArrayChange('education', idx, 'institution', e.target.value)} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-semibold text-gray-500 uppercase">Start Year</label>
                                                        <input className="input-field" type="number" placeholder="YYYY" value={edu.startYear} onChange={(e) => handleArrayChange('education', idx, 'startYear', e.target.value)} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-semibold text-gray-500 uppercase">End Year</label>
                                                        <input className="input-field" type="number" placeholder="YYYY (or leave blank if present)" value={edu.endYear} onChange={(e) => handleArrayChange('education', idx, 'endYear', e.target.value)} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="text-lg font-bold text-gray-800">Work Experience</label>
                                            <button type="button" onClick={() => addArrayItem('experience', { title: '', company: '', description: '' })} className="text-primary-600 text-sm font-bold hover:text-primary-700">+ Add Job</button>
                                        </div>
                                        {formData.experience.map((exp, idx) => (
                                            <div key={idx} className="bg-gray-50 p-6 rounded-xl mb-4 border border-gray-100 relative">
                                                <button onClick={() => removeArrayItem('experience', idx)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">×</button>
                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-semibold text-gray-500 uppercase">Job Title</label>
                                                        <input className="input-field" placeholder="e.g. Product Manager" value={exp.title} onChange={(e) => handleArrayChange('experience', idx, 'title', e.target.value)} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-semibold text-gray-500 uppercase">Company</label>
                                                        <input className="input-field" placeholder="Company Name" value={exp.company} onChange={(e) => handleArrayChange('experience', idx, 'company', e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-gray-500 uppercase">Description</label>
                                                    <textarea className="input-field" rows={3} placeholder="Describe your role and achievements..." value={exp.description} onChange={(e) => handleArrayChange('experience', idx, 'description', e.target.value)} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-gray-100 pt-8">
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="text-lg font-bold text-gray-800">Projects</label>
                                            <button type="button" onClick={() => addArrayItem('projects', { title: '', description: '', link: '' })} className="text-primary-600 text-sm font-bold hover:text-primary-700">+ Add Project</button>
                                        </div>
                                        {formData.projects.map((proj, idx) => (
                                            <div key={idx} className="bg-gray-50 p-6 rounded-xl mb-4 border border-gray-100 relative">
                                                <button onClick={() => removeArrayItem('projects', idx)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">×</button>
                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-semibold text-gray-500 uppercase">Project Title</label>
                                                        <input className="input-field" placeholder="e.g. E-commerce App" value={proj.title} onChange={(e) => handleArrayChange('projects', idx, 'title', e.target.value)} />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-semibold text-gray-500 uppercase">Live Link / GitHub</label>
                                                        <input className="input-field" placeholder="https://..." value={proj.link} onChange={(e) => handleArrayChange('projects', idx, 'link', e.target.value)} />
                                                    </div>
                                                </div>
                                                <textarea className="input-field" rows={2} placeholder="What did you build? Technologies used?" value={proj.description} onChange={(e) => handleArrayChange('projects', idx, 'description', e.target.value)} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="text-lg font-bold text-gray-800">Certifications & Awards</label>
                                        <button type="button" onClick={() => addArrayItem('certifications', { name: '', issuer: '', certificateFile: '' })} className="text-primary-600 text-sm font-bold hover:text-primary-700">+ Add Certificate</button>
                                    </div>

                                    {formData.certifications.length === 0 && (
                                        <div className="text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
                                            No certifications added.
                                        </div>
                                    )}

                                    {formData.certifications.map((cert, idx) => (
                                        <div key={idx} className="bg-gray-50 p-6 rounded-xl mb-4 border border-gray-100 relative">
                                            <button onClick={() => removeArrayItem('certifications', idx)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">×</button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-gray-500 uppercase">Certification Name</label>
                                                    <input className="input-field" placeholder="e.g. AWS Certified Solutions Architect" value={cert.name} onChange={(e) => handleArrayChange('certifications', idx, 'name', e.target.value)} />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-gray-500 uppercase">Issuing Organization</label>
                                                    <input className="input-field" placeholder="e.g. Amazon Web Services" value={cert.issuer} onChange={(e) => handleArrayChange('certifications', idx, 'issuer', e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200">
                                                <label className="flex items-center gap-3 cursor-pointer">
                                                    <div className="bg-primary-50 text-primary-600 p-2 rounded-lg">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                                                    </div>
                                                    <div className="flex-1">
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {cert.certificateFile ? 'Certificate Uploaded' : 'Upload Credential (PDF/Image)'}
                                                        </span>
                                                    </div>
                                                    <input type="file" className="hidden" onChange={(e) => handleArrayFileUpload(e, 'certifications', idx, 'certificateFile')} />
                                                </label>
                                                {cert.certificateFile && <p className="text-xs text-green-600 mt-2 ml-1">✓ File ready to submit</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {step === 5 && (
                                <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
                                    <div>
                                        <h3 className="text-xl font-bold mb-6">Job Preferences</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1">
                                                <label className="text-sm font-semibold text-gray-700">Preferred Roles</label>
                                                <input className="input-field" placeholder="e.g. Backend Developer, DevOps Engineer" value={formData.jobPreferences.roles} onChange={(e) => handleChange({ target: { name: 'jobPreferences.roles', value: e.target.value } })} />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-semibold text-gray-700">Preferred Locations</label>
                                                <input className="input-field" placeholder="e.g. Remote, San Francisco, London" value={formData.jobPreferences.locations} onChange={(e) => handleChange({ target: { name: 'jobPreferences.locations', value: e.target.value } })} />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-semibold text-gray-700">Expected Salary (Annual)</label>
                                                <input className="input-field" type="number" placeholder="e.g. 80000" name="jobPreferences.salary.max" value={formData.jobPreferences.salary?.max ?? ''} onChange={handleChange} />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-semibold text-gray-700">Employment Type</label>
                                                <input className="input-field" placeholder="e.g. Full-time, Remote, Contract" value={formData.jobPreferences.employmentType} onChange={(e) => handleChange({ target: { name: 'jobPreferences.employmentType', value: e.target.value } })} />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-semibold text-gray-700">Notice Period</label>
                                                <input className="input-field" placeholder="e.g. Immediate, 15 days, 3 Months" value={formData.jobPreferences.noticePeriod} onChange={(e) => handleChange({ target: { name: 'jobPreferences.noticePeriod', value: e.target.value } })} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 pt-8">
                                        <h3 className="text-xl font-bold mb-6">Documents <span className="text-red-500">*</span></h3>
                                        <div className="group border-2 border-dashed border-primary-100 hover:border-primary-500 bg-primary-50/30 rounded-2xl p-8 text-center transition-all cursor-pointer">
                                            <label className="cursor-pointer block w-full h-full">
                                                <div className="w-16 h-16 bg-white rounded-full text-primary-600 flex items-center justify-center text-3xl shadow-sm mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                    📄
                                                </div>
                                                <h4 className="text-lg font-semibold text-gray-900 mb-1">Upload Resume</h4>
                                                <p className="text-sm text-gray-500 mb-4">PDF or DOCX (Max 5MB)</p>
                                                <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => handleFileUpload(e, 'resume')} />

                                                {formData.resume ? (
                                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                        Resume Uploaded Successfully
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-primary-600 font-bold underline decoration-2 underline-offset-2">Browse Files</span>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Navigation Buttons for BOTH Roles */}
                    <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
                        <button
                            onClick={() => setStep(s => Math.max(0, s - 1))}
                            disabled={step === 0}
                            className="px-8 py-3 rounded-xl text-gray-600 font-semibold hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        >
                            Back
                        </button>

                        {step < steps.length - 1 ? (
                            <button
                                onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
                                className="px-8 py-3 rounded-xl bg-gray-900 text-white font-bold shadow-lg hover:bg-gray-800 hover:-translate-y-0.5 transition-all"
                            >
                                Next Step →
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-10 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Completing Profile...' : 'Finish & Go to Dashboard 🎉'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
