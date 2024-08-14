import { Loader } from 'lucide-react';

export const LoadingSpinner = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <Loader className="animate-spin h-16 w-16 text-purple-400" />
        </div>
    );
};

