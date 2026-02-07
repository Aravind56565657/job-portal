import JobForm from '../components/JobForm';

const PostJob = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-900">Post a New Opportunity</h1>
                    <p className="text-gray-500 mt-2">Reach thousands of job seekers by creating a detailed job posting.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                        <span className="uppercase text-xs font-bold tracking-wider text-gray-500">Job Details Form</span>
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">New Draft</span>
                    </div>

                    <div className="p-8">
                        <JobForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostJob;
