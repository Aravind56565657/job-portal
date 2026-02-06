import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="font-sans">
            {/* Hero Section */}
            <header className="relative bg-gradient-to-r from-primary-700 to-dark-900 text-white pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                    </svg>
                </div>

                <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0 animate-slide-up">
                        <span className="inline-block py-1 px-3 rounded-full bg-primary-600/30 border border-primary-500/30 text-primary-100 text-sm font-semibold mb-4 backdrop-blur-sm">
                            #1 Job Platform 🚀
                        </span>
                        <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight mb-6">
                            Find Your <span className="text-secondary-500">Dream Job</span> <br />
                            Without The Hassle.
                        </h1>
                        <p className="text-lg text-primary-100 mb-8 max-w-lg mx-auto md:mx-0">
                            Connecting top talent with world-class employers. Whether you're hiring or searching, we make it effortless.
                        </p>
                        <div className="flex gap-4 justify-center md:justify-start">
                            <Link to="/jobs" className="bg-white text-primary-700 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 shadow-xl transition-all hover:-translate-y-1">
                                Browse Jobs
                            </Link>
                            <Link to="/register" className="border border-white/30 bg-white/10 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white/20 backdrop-blur-sm transition-all">
                                Post a Job
                            </Link>
                        </div>
                    </div>

                    {/* Illustration / Graphic Placeholder */}
                    <div className="md:w-1/2 flex justify-center animate-fade-in delay-200">
                        <div className="relative w-80 h-80 md:w-96 md:h-96 bg-gradient-to-tr from-primary-500 to-secondary-500 rounded-full blur-3xl opacity-30 absolute"></div>
                        <div className="relative bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl max-w-md transform rotate-2 hover:rotate-0 transition-transform duration-500">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary-600 font-bold text-xl">G</div>
                                <div>
                                    <h3 className="font-bold text-lg text-white">Senior Developer</h3>
                                    <p className="text-primary-100 text-sm">Google Inc. • $120k - $150k</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="h-2 bg-white/20 rounded w-full"></div>
                                <div className="h-2 bg-white/20 rounded w-5/6"></div>
                                <div className="h-2 bg-white/20 rounded w-4/6"></div>
                            </div>
                            <button className="w-full mt-6 bg-secondary-500 text-white py-2 rounded-lg font-semibold shadow-lg">Apply Now</button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats Section */}
            <section className="py-10 bg-white shadow-sm relative z-20 -mt-8 mx-4 md:mx-10 rounded-xl border border-gray-100">
                <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <h4 className="text-3xl font-bold text-primary-600">10k+</h4>
                        <p className="text-gray-500 font-medium">Active Jobs</p>
                    </div>
                    <div>
                        <h4 className="text-3xl font-bold text-primary-600">500+</h4>
                        <p className="text-gray-500 font-medium">Companies</p>
                    </div>
                    <div>
                        <h4 className="text-3xl font-bold text-primary-600">50k+</h4>
                        <p className="text-gray-500 font-medium">Job Seekers</p>
                    </div>
                    <div>
                        <h4 className="text-3xl font-bold text-primary-600">24/7</h4>
                        <p className="text-gray-500 font-medium">Support</p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-secondary-500 font-semibold tracking-wider uppercase text-sm">Why Choose Us</span>
                        <h2 className="text-4xl font-bold text-dark-900 mt-2">Platform Features</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {[
                            { title: 'Smart Search', icon: '🔍', desc: 'Advanced algorithms to find the perfect match for your skills.' },
                            { title: 'Easy Application', icon: '⚡', desc: 'One-click apply to save time and track your applications easily.' },
                            { title: 'Verified Companies', icon: '✅', desc: 'We verify every employer so you can apply with trust and confidence.' },
                        ].map((feature, idx) => (
                            <div key={idx} className="card hover:-translate-y-2 group">
                                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
