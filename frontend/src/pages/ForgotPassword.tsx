import { useState } from 'react';
import type { FormEvent } from 'react';
import { authApi } from '../api/auth.api';
import { toast } from 'react-hot-toast';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { getErrorMessage } from '../utils/error';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authApi.forgotPassword(email);
            setSent(true);
            toast.success('Reset link sent to your email!');
        } catch (err: any) {
            toast.error(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-[#E5E7EB] text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Mail className="text-green-600" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-[#111827] mb-2">Check your email</h2>
                    <p className="text-[#6B7280] mb-8">
                        We have sent a password reset link to <strong>{email}</strong>.
                    </p>
                    <a href="/login" className="text-[#4F46E5] font-bold hover:underline flex items-center justify-center gap-2">
                        <ArrowLeft size={16} /> Back to Login
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-[#E5E7EB]">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-[#111827]">Reset Password</h1>
                    <p className="text-[#6B7280] mt-2">Enter your email to receive a reset link</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent outline-none transition-all font-medium text-[#111827]"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Link'}
                    </button>

                    <div className="text-center">
                        <a href="/login" className="text-[#6B7280] hover:text-[#111827] text-sm font-medium transition-colors">
                            Back to Login
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}
