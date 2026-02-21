import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/auth.api';
import { useNavigate } from 'react-router-dom';
import { AppWindow, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getErrorMessage } from '../utils/error';
import {useNavigate} from 'react-router-dom';
    export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data: any) => {
        try {
            const res = await authApi.login(data);
            login(res.data, res.data.user);
            toast.success('Logged in successfully');
            navigate('/');
        } catch (e) {
            toast.error(getErrorMessage(e));
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#FAFAFA] p-6 text-[#111827]">
            <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-2 duration-700">
                <div className="bg-white p-12 rounded-2xl shadow-xl shadow-gray-200/40 border border-[#E5E7EB]">
                    <div className="mb-10">
                        <div className="w-12 h-12 bg-[#4F46E5] rounded-xl flex items-center justify-center mb-10 shadow-lg shadow-indigo-100 transition-transform hover:scale-105 active:scale-95">
                            <AppWindow size={24} strokeWidth={2.5} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-[#111827] mb-2">Welcome back</h2>
                        <p className="text-[#6B7280] font-medium text-base">Enter your credentials to access the nexus.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider ml-1">Email Address</label>
                            <input
                                {...register('email', { required: true })}
                                placeholder="name@company.com"
                                className="w-full bg-[#FAFAFA] text-[#111827] p-4 rounded-xl border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/10 focus:bg-white focus:border-[#4F46E5] transition-all font-bold placeholder:text-[#9CA3AF]"
                            />
                            {errors.email && <span className="text-[#EF4444] text-[10px] font-bold uppercase tracking-wider ml-1">Email Required</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider ml-1">Password</label>
                            <input
                                type="password"
                                {...register('password', { required: true })}
                                placeholder="••••••••"
                                className="w-full bg-[#FAFAFA] text-[#111827] p-4 rounded-xl border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/10 focus:bg-white focus:border-[#4F46E5] transition-all font-bold placeholder:text-[#9CA3AF]"
                            />
                            {errors.password && <span className="text-[#EF4444] text-[10px] font-bold uppercase tracking-wider ml-1">Password Required</span>}
                        </div>

                        <div className="flex justify-end">
                            <a href="/forgot-password" className="text-xs font-bold text-[#4F46E5] hover:text-[#4338CA] hover:underline transition-all">
                                Forgot password?
                            </a>
                        </div>

                        <button type="submit" className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white py-4 rounded-xl font-bold text-sm shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group">
                            Sign In
                            <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
                        </button>

                        <div className="pt-6 text-center text-sm">
                            <p className="text-[#6B7280] font-medium">
                                Don't have a workspace? <button onClick={()=>navigate("/signup")}>Get started for free</button>
                            </p>
                        </div>
                    </form>
                </div>
                <div className="text-center mt-10">
                    <p className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-[0.2em]">Powered by Nexus Enterprise v3.0</p>
                </div>
            </div>
        </div>
    );
}
