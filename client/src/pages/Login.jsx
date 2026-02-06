import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import AuthContext from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login, googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const data = await login(email, password);
            // Redirect based on role
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
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] animate-fade-in">

                {/* Left Side - Hero / Illustration */}
                <div className="md:w-1/2 bg-gradient-to-br from-primary-600 to-primary-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <h1 className="text-4xl font-serif font-bold mb-4">Welcome Back!</h1>
                        <p className="text-primary-100 text-lg">Log in to verify your account and continue your journey to success.</p>
                    </div>

                    {/* Decorative Circles */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -ml-10 -mb-10"></div>

                    <div className="relative z-10">
                        <blockquote className="italic text-primary-200 border-l-4 border-primary-400 pl-4 py-2">
                            "Choose a job you love, and you will never have to work a day in your life."
                        </blockquote>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
                    <div className="w-full max-w-md mx-auto">
                        <h2 className="text-3xl font-bold text-dark-900 mb-2">Sign In</h2>
                        <p className="text-gray-500 mb-8">Don't have an account? <Link to="/register" className="text-primary-600 font-semibold hover:underline">Create one</Link></p>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r shadow-sm animate-pulse" role="alert">
                                <p className="font-bold">Error</p>
                                <p>{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button type="submit" className="w-full btn-primary text-lg mt-4">
                                Sign In
                            </button>
                        </form>

                        <div className="mt-8">
                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-gray-200"></div>
                                <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">OR CONTINUE WITH</span>
                                <div className="flex-grow border-t border-gray-200"></div>
                            </div>
                            <div className="flex justify-center mt-6">
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

export default Login;
