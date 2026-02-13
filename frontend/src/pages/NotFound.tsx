import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPinOff } from 'lucide-react';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center">


                <h1 className="text-6xl font-bold text-[#111827] tracking-tighter mb-4">404</h1>
                <h2 className="text-xl font-bold text-[#111827] mb-3">Page not found</h2>
                <p className="text-[#6B7280] font-medium text-sm mb-10 leading-relaxed max-w-sm mx-auto">
                    The requested session or workspace coordinate does not exist. It may have been relocated or deleted.
                </p>

                <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center justify-center px-8 py-3.5 font-bold text-white bg-[#111827] rounded-xl hover:bg-[#1f2937] transition-all shadow-lg shadow-gray-200 active:scale-95 group"
                >
                    <ArrowLeft size={18} className="mr-2 transition-transform group-hover:-translate-x-1" />
                    Back to Workspace
                </button>


            </div>
        </div>
    );
}
