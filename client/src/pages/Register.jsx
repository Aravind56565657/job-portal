import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import AuthContext from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('job_seeker');
    const [error, setError] = useState(null);
    const { register, googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const data = await register(name, email, password, role);
            if (data.role === 'employer') {
                navigate('/dashboard/employer');
            } else {
                navigate('/dashboard/seeker');
            }
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 pt-20 bg-gray-50">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse min-h-[600px] animate-fade-in">

                {/* Right Side - Hero / Illustration */}
                <div className="md:w-1/2 bg-gradient-to-bl from-secondary-500 to-primary-800 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-4xl font-serif font-bold mb-4">Join Us Today!</h1>
                        <p className="text-primary-100 text-lg">Create an account to unlock exclusive job opportunities and professional tools.</p>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -ml-10 -mb-10"></div>

                    <div className="relative z-10">
                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                            <p className="font-semibold">Start building your future.</p>
                            <div className="flex gap-2 mt-2">
                                <span className="px-2 py-1 bg-white/20 rounded text-xs">Job Seeker</span>
                                <span className="px-2 py-1 bg-white/20 rounded text-xs">Employer</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Left Side - Register Form */}
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
                    <div className="w-full max-w-md mx-auto">
                        <h2 className="text-3xl font-bold text-dark-900 mb-2">Create Account</h2>
                        <p className="text-gray-500 mb-6">Already have an account? <Link to="/login" className="text-primary-600 font-semibold hover:underline">Log in</Link></p>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r shadow-sm animate-pulse" role="alert">
                                <p className="font-bold">Error</p>
                                <p>{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="John Doe" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="you@example.com" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="••••••••" required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">I want to...</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className={`cursor-pointer border rounded-lg p-3 text-center transition-all ${role === 'job_seeker' ? 'border-primary-500 bg-primary-50 text-primary-700 ring-1 ring-primary-500' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <input type="radio" name="role" value="job_seeker" checked={role === 'job_seeker'} onChange={(e) => setRole(e.target.value)} className="sr-only" />
                                        <span className="font-semibold block">Find a Job</span>
                                    </label>
                                    <label className={`cursor-pointer border rounded-lg p-3 text-center transition-all ${role === 'employer' ? 'border-primary-500 bg-primary-50 text-primary-700 ring-1 ring-primary-500' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <input type="radio" name="role" value="employer" checked={role === 'employer'} onChange={(e) => setRole(e.target.value)} className="sr-only" />
                                        <span className="font-semibold block">Hire Talent</span>
                                    </label>
                                </div>
                            </div>

                            <button type="submit" className="w-full btn-primary text-lg mt-2">
                                Register
                            </button>
                        </form>

                        <div className="mt-6">
                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-gray-200"></div>
                                <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">OR</span>
                                <div className="flex-grow border-t border-gray-200"></div>
                            </div>
                            <div className="flex justify-center mt-4">
                                <div className="p-1 border border-gray-100 rounded-lg hover:shadow-lg transition-shadow bg-white pb-2 overflow-hidden">
                                    <GoogleLogin
                                        onSuccess={async (credentialResponse) => {
                                            try {
                                                const data = await googleLogin(credentialResponse.credential);
                                                if (data.role === 'employer') {
                                                    navigate('/dashboard/employer');
                                                } else {
                                                    navigate('/dashboard/seeker');
                                                }
                                            } catch (err) {
                                                setError(typeof err === 'string' ? err : 'Google Login Failed');
                                            }
                                        }}
                                        onError={() => setError('Google Login Failed')}
                                        shape="pill"
                                        width="300"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
