import { useState } from 'react';
import type { FormEvent } from 'react';
import { authApi } from '../api/auth.api';
import { toast } from 'react-hot-toast';
import { Lock, Loader2, CheckCircle } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../utils/error';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const id = searchParams.get('id');
    const navigate = useNavigate();


    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {

        e.preventDefault();


        if (!token || !id) {
            toast.error('Invalid reset link');
            return;
        }


        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await authApi.resetPassword(token, id, password);
            toast.success('Password reset successfully!');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err: any) {
            toast.error(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    if (!token || !id) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-[#E5E7EB] text-center">
                    <p className="text-red-500 font-bold">Invalid or missing reset token.</p>
                    <a href="/login" className="text-[#4F46E5] font-bold mt-4 inline-block hover:underline">Return to Login</a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-[#E5E7EB]">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-[#111827]">New Password</h1>
                    <p className="text-[#6B7280] mt-2">Enter your new secure password</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent outline-none transition-all font-medium text-[#111827]"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent outline-none transition-all font-medium text-[#111827]"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <span className="flex items-center gap-2"><CheckCircle size={18} /> Reset Password</span>}
                    </button>
                </form>
            </div>
        </div>
    );
}
