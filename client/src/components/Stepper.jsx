const Stepper = ({ steps, currentStep }) => {
    return (
        <div className="w-full py-4">
            <div className="flex justify-between">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;

                    return (
                        <div key={index} className="flex flex-col items-center w-full relative">
                            {/* Line Connector */}
                            {index !== 0 && (
                                <div className={`absolute top-4 right-1/2 w-full h-1 -z-10 ${index <= currentStep ? 'bg-primary-500' : 'bg-gray-200'
                                    }`}></div>
                            )}

                            {/* Circle */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${isCompleted ? 'bg-primary-500 text-white' :
                                    isCurrent ? 'bg-white border-2 border-primary-500 text-primary-500 shadow-md transform scale-110' :
                                        'bg-gray-200 text-gray-500'
                                }`}>
                                {isCompleted ? '✓' : index + 1}
                            </div>

                            {/* Label */}
                            <div className={`mt-2 text-xs font-medium hidden sm:block ${isCurrent ? 'text-primary-600' : 'text-gray-400'
                                }`}>
                                {step}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Stepper;
