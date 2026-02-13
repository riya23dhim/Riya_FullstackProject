import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/user.api';
import Navbar from '../components/Navbar';
import { Camera, User, Mail, Save, CheckCircle, Smartphone, LogOut } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';
import { toast } from 'react-hot-toast';

export default function Profile() {
    const { user, login } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const uploadAvatar = async () => {
        if (!selectedFile) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const { data } = await userApi.uploadAvatar(formData);
            setAvatarPreview(data.avatar);
            setSelectedFile(null);
            if (user) {
                const updatedUser = { ...user, avatar: data.avatar };
                login({ accessToken: localStorage.getItem('accessToken')!, refreshToken: localStorage.getItem('refreshToken')! }, updatedUser);
            }
            toast.success('Avatar updated successfully');
        } catch (err) {
            toast.error('Avatar upload failed');
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await userApi.updateMe({ name, email });
            login({ accessToken: localStorage.getItem('accessToken')!, refreshToken: localStorage.getItem('refreshToken')! }, data);
            toast.success('Profile updated');
        } catch (err) {
            toast.error('Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handleLogoutAll = async () => {
        try {
            await userApi.logoutAll();
            toast.success('Logged out from all devices');
            login({ accessToken: '', refreshToken: '' }, null as any); // Force logout locally
            window.location.href = '/login';
        } catch (err) {
            toast.error('Failed to logout from all devices');
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#111827] font-sans pb-20">
            <ConfirmationModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogoutAll}
                title="Logout from all devices?"
                message="This will invalidate all active sessions across all your devices. You will need to log in again on this device as well."
                confirmText="Logout All"
                isDanger={true}
            />
            <Navbar />
            <div className="container mx-auto p-6 max-w-5xl pt-16">
                <div className="mb-12">
                    <h1 className="text-3xl font-bold tracking-tight text-[#111827]">Account Settings</h1>
                    <p className="text-[#6B7280] font-medium mt-1">Manage your identity and communication preferences.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Sidebar / Photo Selection */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-8 rounded-2xl border border-[#E5E7EB] shadow-sm text-center">
                            <div className="relative inline-block group">
                                <img
                                    src={avatarPreview ? (avatarPreview.startsWith('http') || avatarPreview.startsWith('data:') || avatarPreview.startsWith('blob:') ? avatarPreview : `http://localhost:3000${avatarPreview}`) : '/default-avatar.png'}
                                    alt="Profile"
                                    className="w-40 h-40 rounded-2xl object-cover ring-4 ring-[#FAFAFA] shadow-lg transition-transform hover:scale-[1.02] border border-[#E5E7EB]"
                                />
                                <label className="absolute bottom-3 right-3 bg-white p-2.5 rounded-xl shadow-xl border border-[#E5E7EB] text-[#4F46E5] cursor-pointer hover:bg-[#EEF2FF] transition-all">
                                    <Camera size={18} />
                                    <input type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
                                </label>
                            </div>

                            <div className="mt-6">
                                <h2 className="text-lg font-bold text-[#111827]">{user?.name}</h2>
                                <p className="text-[#6B7280] text-xs font-medium uppercase tracking-wider mt-1">{user?.role} Profile</p>
                            </div>

                            {selectedFile && !loading && (
                                <button
                                    onClick={uploadAvatar}
                                    className="mt-6 w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                                >
                                    <CheckCircle size={14} /> Update Photo
                                </button>
                            )}

                            {loading && (
                                <div className="mt-6 py-3 text-[#4F46E5] text-xs font-bold animate-pulse uppercase tracking-widest bg-[#EEF2FF] rounded-xl">
                                    Syncing metadata...
                                </div>
                            )}
                        </div>

                        <div className="bg-[#EEF2FF] p-6 rounded-2xl border border-[#E0E7FF]">
                            <h3 className="text-[#4F46E5] text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Smartphone size={14} /> System Access
                            </h3>
                            <p className="text-[#6B7280] text-xs leading-relaxed font-medium mb-4">
                                Your profile is synced across all workspace nodes. Changes may take up to 60 seconds to propagate across the workspace.
                            </p>
                            <button
                                onClick={() => setShowLogoutModal(true)}
                                className="w-full bg-white text-[#EF4444] border border-[#FECACA] hover:bg-[#FEF2F2] hover:border-[#FCA5A5] py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                            >
                                <LogOut size={14} /> Logout All Devices
                            </button>
                        </div>
                    </div>

                    {/* Main Settings Form */}
                    <div className="lg:col-span-8">
                        <div className="bg-white p-10 rounded-2xl border border-[#E5E7EB] shadow-sm">
                            <form onSubmit={updateProfile} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider flex items-center gap-2">
                                            <User size={14} className="text-[#4F46E5]" /> Display Name
                                        </label>
                                        <input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-[#FAFAFA] text-[#111827] px-4 py-3 rounded-xl border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/10 focus:bg-white focus:border-[#4F46E5] transition-all font-bold placeholder:text-[#9CA3AF]"
                                            placeholder="Enter your name"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider flex items-center gap-2">
                                            <Mail size={14} className="text-[#4F46E5]" /> Email Address
                                        </label>
                                        <input
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-[#FAFAFA] text-[#111827] px-4 py-3 rounded-xl border border-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/10 focus:bg-white focus:border-[#4F46E5] transition-all font-bold placeholder:text-[#9CA3AF]"
                                            placeholder="you@company.com"
                                        />
                                    </div>
                                </div>

                                <div className="pt-10 border-t border-[#F3F4F6]">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                        <p className="text-[#6B7280] text-xs font-medium max-w-sm">
                                            Ensure your email is active to receive security notifications and nexus updates.
                                        </p>
                                        <button
                                            disabled={loading}
                                            className="w-full md:w-auto bg-[#111827] hover:bg-[#1f2937] text-white px-10 py-3.5 rounded-xl font-bold text-sm shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            <Save size={18} /> Save Settings
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
