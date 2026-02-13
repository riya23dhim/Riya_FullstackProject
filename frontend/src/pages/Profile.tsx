import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { notificationApi } from '../api/notification.api';
import { io } from 'socket.io-client';
import { useLocation, useNavigate } from 'react-router-dom';

import { Bell, Shield, User as UserIcon, LogOut, AppWindow, Inbox } from 'lucide-react';
import type { Notification } from '../types/notification';

export default function Navbar() {
    const { user, logout, tokens } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const location = useLocation();
    const navigate = useNavigate();

    // Click outside listener for dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    // WebSocket connection for notifications
    useEffect(() => {
        if (user && tokens?.accessToken) {
            const newSocket = io(import.meta.env.VITE_SOCKET_URL!, {
                query: { token: tokens.accessToken },
            });

            newSocket.on('notification', (notif: Notification) => {
                setNotifications((prev) => [notif, ...prev]);
            });

            // Fetch initial notifications
            notificationApi.getAll(1, 10).then((res) => {
                setNotifications(res.data.data);
            });

            return () => {
                newSocket.disconnect();
            };
        }
    }, [user, tokens]);

    const markRead = async (id: string) => {
        await notificationApi.markAsRead(id);
        setNotifications((prev) =>
            prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
    };

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <nav className="bg-white sticky top-0 z-50 border-b border-[#E5E7EB] py-2.5">
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/* Logo Section */}
                <div
                    className="flex items-center gap-2.5 cursor-pointer group"
                    onClick={() => navigate('/')}
                >
                    <div className="w-8 h-8 bg-[#4F46E5] rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-100/50 transition-transform group-hover:scale-105">
                        <AppWindow size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-[#111827] tracking-tight">Nexus</span>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Admin Access Control */}
                    {user?.role === 'ADMIN' && (
                        <div className="flex items-center space-x-3 border-r border-[#E5E7EB] pr-4">
                            {location.pathname === '/admin' ? (
                                <button
                                    onClick={() => navigate('/')}
                                    className="flex items-center space-x-2 text-[#10B981] hover:text-[#059669] text-[11px] font-bold transition-all"
                                >
                                    <UserIcon size={14} />
                                    <span>User Panel</span>
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate('/admin')}
                                    className="flex items-center space-x-2 text-[#4F46E5] hover:text-[#4338CA] text-[11px] font-bold transition-all"
                                >
                                    <Shield size={14} />
                                    <span>Admin Panel</span>
                                </button>
                            )}
                        </div>
                    )}

                    {/* Notification System */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className={`p-2 rounded-lg transition-all relative ${showDropdown ? 'bg-[#F3F4F6] text-[#4F46E5]' : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]'}`}
                        >
                            <Bell size={16} strokeWidth={2.2} className={unreadCount > 0 ? 'animate-swing' : ''} />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 bg-[#EF4444] border-2 border-white rounded-full w-2.5 h-2.5 animate-pulse"></span>
                            )}
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl z-50 overflow-hidden border border-[#E5E7EB] animate-in fade-in slide-in-from-top-1">
                                <div className="px-4 py-3 border-b border-[#F3F4F6] flex items-center justify-between bg-white">
                                    <span className="text-[#111827] text-xs font-bold tracking-tight">Activity</span>
                                    {unreadCount > 0 && <span className="text-[#4F46E5] text-[10px] font-bold bg-[#EEF2FF] px-2 py-0.5 rounded-full">{unreadCount} New</span>}
                                </div>
                                <div className="max-h-72 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                                            <div className="w-10 h-10 bg-[#FAFAFA] rounded-full flex items-center justify-center mb-3">
                                                <Inbox size={18} className="text-[#D1D5DB]" />
                                            </div>
                                            <p className="text-[#9CA3AF] text-[11px] font-medium leading-tight">Your notification queue is currently empty.</p>
                                        </div>
                                    ) : (
                                        notifications.map((n) => (
                                            <div
                                                key={n._id}
                                                className={`px-4 py-3 border-b border-[#F9FAFB] transition-all cursor-pointer flex items-start gap-3 last:border-0 ${n.isRead ? 'opacity-60 grayscale-[0.5]' : 'bg-[#EEF2FF]/20 hover:bg-[#EEF2FF]/40'}`}
                                                onClick={() => markRead(n._id)}
                                            >
                                                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${n.isRead ? 'bg-[#D1D5DB]' : 'bg-[#4F46E5]'}`}></div>
                                                <div className="flex-1">
                                                    <p className={`text-[#374151] text-[12px] leading-[1.4] mb-1 ${!n.isRead ? 'font-bold' : 'font-medium'}`}>{n.message}</p>
                                                    <span className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-wider">Just now</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                {notifications.length > 0 && (
                                    <div className="px-4 py-2 border-t border-[#F3F4F6] bg-[#FAFAFA] text-center">
                                        <button className="text-[10px] font-bold text-[#6B7280] hover:text-[#4F46E5] transition-colors">View All Activity</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* User Profile Action Area */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate('/profile')}
                            className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#F9FAFB] transition-all group border border-transparent hover:border-[#F3F4F6]"
                        >
                            <div className="relative">
                                <img
                                    src={user?.avatar ? `${import.meta.env.VITE_API_URL}${user.avatar}` : '/default-avatar.png'}
                                    className="w-7 h-7 rounded-lg object-cover ring-2 ring-white shadow-sm transition-transform group-hover:scale-105"
                                />
                                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#10B981] border-2 border-white rounded-full"></div>
                            </div>
                            <div className="hidden lg:block pr-1">
                                <div className="text-[#111827] font-bold text-xs tracking-tight leading-none">{user?.name}</div>
                            </div>
                        </button>
                        <button
                            onClick={() => {
                                logout();
                                toast.success('Logged out successfully');
                            }}
                            className="p-1.5 text-[#9CA3AF] hover:text-[#EF4444] hover:bg-rose-50 rounded-lg transition-all"
                            title="Sign Out"
                        >
                            <LogOut size={16} strokeWidth={2} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
