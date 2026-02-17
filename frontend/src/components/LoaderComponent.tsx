"use client";
const LoaderComponent = ({ text }: { text?: string }) => {
    return (
        <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm flex items-center justify-center rounded-2xl">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    {text || "Loading..."}
                </p>
            </div>
        </div>
    );
};
export default LoaderComponent;
