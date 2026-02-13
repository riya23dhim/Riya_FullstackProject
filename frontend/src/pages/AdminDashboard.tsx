import { useEffect, useState } from 'react';
import { userApi } from '../api/user.api';
import { todoApi } from '../api/todo.api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import type { User } from '../types/user';
import type { Todo } from '../types/todo';
import { Users, ChevronLeft, ChevronRight, X, Clock, ExternalLink } from 'lucide-react';

export default function AdminDashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userTodos, setUserTodos] = useState<Todo[]>([]);
    const [todoPage, setTodoPage] = useState(1);
    const [todoTotal, setTodoTotal] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [todosLoading, setTodosLoading] = useState(false);
    const { user: currentUser } = useAuth();

    // Edit User Modal State
    const [showEditModal, setShowEditModal] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);

    useEffect(() => {
        fetchUsers();
    }, [page]);

    useEffect(() => {
        if (selectedUser) {
            fetchUserTodos(selectedUser._id);
        }
    }, [selectedUser, todoPage]);

    const fetchUsers = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const { data } = await userApi.getAllUsers(page, 10);
            setUsers(data.data);
            setTotal(data.total);
        } catch (err) {
            console.error(err);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const fetchUserTodos = async (userId: string, silent = false) => {
        if (!silent) setTodosLoading(true);
        try {
            const { data } = await todoApi.getUserTodos(userId, todoPage, 5);
            setUserTodos(data.data);
            setTodoTotal(data.total);
        } catch (err) {
            console.error(err);
        } finally {
            if (!silent) setTodosLoading(false);
        }
    };

    const toggleStatus = async (user: User) => {
        try {
            if (user.isDeleted) {
                await userApi.restoreUser(user._id);
            } else {
                await userApi.softDeleteUser(user._id);
            }
            fetchUsers(true);
        } catch (err) {
            alert('Action failed');
        }
    };

    const changeRole = async (id: string, newRole: string) => {
        try {
            await userApi.updateUser(id, { role: newRole });
            fetchUsers(true);
        } catch (err) {
            alert('Role update failed');
        }
    };

    const openTaskModal = (user: User) => {
        setSelectedUser(user);
        setTodoPage(1);
        setShowModal(true);
    };

    const openEditModal = (user: User) => {
        setEditUser(user);
        setShowEditModal(true);
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#111827] font-sans pb-20">
            <Navbar />
            <div className="container mx-auto p-6 pt-16 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-[#111827]">Administration</h1>
                        <p className="text-[#6B7280] font-medium mt-1">Management of nexus users and permissions.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-[#EEF2FF] px-5 py-2.5 rounded-xl border border-[#E0E7FF] text-xs font-bold text-[#4F46E5] flex items-center gap-2">
                            <Users size={16} />
                            <span>{total} Total Members</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#F9FAFB] text-[#6B7280] uppercase text-[11px] font-bold tracking-wider border-b border-[#E5E7EB]">
                                <tr>
                                    <th className="p-6">Member Identity</th>
                                    <th className="p-6">System Role</th>
                                    <th className="p-6">Status</th>
                                    <th className="p-6">Metrics</th>
                                    <th className="p-6 text-right">Administrative</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F3F4F6]">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="p-32 text-center">
                                            <div className="w-10 h-10 border-3 border-[#E5E7EB] border-t-[#4F46E5] rounded-full animate-spin mx-auto mb-4"></div>
                                            <p className="text-[#6B7280] text-sm font-medium animate-pulse">Loading user data...</p>
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-32 text-center">
                                            <p className="text-[#6B7280] text-sm font-medium italic">No member records found in the database.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((u) => (
                                        <tr key={u._id} className="hover:bg-[#F9FAFB] transition-all group">
                                            <td className="p-6">
                                                <div className="flex items-center space-x-4">
                                                    <div className="relative">
                                                        <img
                                                            src={u.avatar ? (u.avatar.startsWith('http') ? u.avatar : `${import.meta.env.VITE_API_URL}${selectedUser.avatar}`) : '/default-avatar.png'}
                                                            className="w-12 h-12 rounded-xl object-cover ring-2 ring-[#FAFAFA] shadow-sm"
                                                            alt={u.name}
                                                        />
                                                        <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${u.isDeleted ? 'bg-[#EF4444]' : 'bg-[#10B981]'}`}></div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-[#111827] leading-none mb-1 group-hover:text-[#4F46E5] transition-colors">{u.name}</div>
                                                        <div className="text-[#6B7280] text-xs font-medium">{u.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6 text-sm">
                                                <select
                                                    value={u.role}
                                                    onChange={(e) => changeRole(u._id, e.target.value)}
                                                    className={`bg-[#FAFAFA] border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-xs font-bold focus:ring-2 focus:ring-[#4F46E5]/20 focus:outline-none transition-all ${u.role === 'ADMIN' ? 'text-[#4F46E5]' : 'text-[#374151]'}`}
                                                >
                                                    <option value="USER">User</option>
                                                    <option value="ADMIN">Admin</option>
                                                </select>
                                            </td>
                                            <td className="p-6">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-tight uppercase border ${!u.isDeleted ? 'bg-[#ECFDF5] text-[#059669] border-[#D1FAE5]' : 'bg-[#FEF2F2] text-[#DC2626] border-[#FEE2E2]'}`}>
                                                    {u.isDeleted ? 'Suspended' : 'Active'}
                                                </span>
                                            </td>
                                            <td className="p-6 font-medium">
                                                <button
                                                    onClick={() => openTaskModal(u)}
                                                    className="inline-flex items-center gap-1.5 text-[#4F46E5] hover:text-[#4338CA] text-xs font-bold transition-all px-4 py-2 bg-[#FAFAFA] rounded-xl border border-[#E5E7EB] hover:bg-white"
                                                >
                                                    <ExternalLink size={14} /> View Tasks
                                                </button>
                                            </td>
                                            <td className="p-6 text-right space-x-2">
                                                <button
                                                    onClick={() => openEditModal(u)}
                                                    className="px-4 py-2 rounded-xl text-xs font-bold border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-[#374151] transition-all shadow-xs"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => toggleStatus(u)}
                                                    disabled={u._id === currentUser?._id && !u.isDeleted}
                                                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${u.isDeleted ? 'bg-[#F9FAFB] text-[#059669] border-[#D1FAE5] hover:bg-[#ECFDF5]' : 'bg-white text-[#DC2626] border-[#FEE2E2] hover:bg-[#FEF2F2]'} disabled:opacity-20 disabled:cursor-not-allowed shadow-xs`}
                                                >
                                                    {u.isDeleted ? 'Activate' : 'Suspend'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-5 bg-[#F9FAFB] flex justify-between items-center border-t border-[#E5E7EB]">
                        <span className="text-[#9CA3AF] text-[11px] font-bold uppercase tracking-wider ml-2">Page {page} • System Nodes</span>
                        <div className="flex space-x-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="px-4 py-2 bg-white rounded-lg text-xs font-bold disabled:opacity-30 border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-all flex items-center gap-1.5"
                            >
                                <ChevronLeft size={16} /> Previous
                            </button>
                            <button
                                disabled={page * 10 >= total}
                                onClick={() => setPage(page + 1)}
                                className="px-4 py-2 bg-white rounded-lg text-xs font-bold disabled:opacity-30 border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-all flex items-center gap-1.5"
                            >
                                Next <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit User Modal */}
            {showEditModal && editUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#111827]/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-2xl border border-[#E5E7EB] shadow-2xl overflow-hidden animate-in zoom-in-95">
                        <div className="p-6 border-b border-[#F3F4F6] flex justify-between items-center">
                            <h2 className="text-xl font-bold text-[#111827]">Edit User</h2>
                            <button onClick={() => setShowEditModal(false)}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const name = formData.get('name') as string;
                                const email = formData.get('email') as string;
                                try {
                                    await userApi.updateUser(editUser._id, { name, email });
                                    setShowEditModal(false);
                                    fetchUsers(true);
                                } catch (err) {
                                    alert('Update failed');
                                }
                            }}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                                        <input name="name" defaultValue={editUser.name} className="w-full p-2 border rounded-lg" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                                        <input name="email" type="email" defaultValue={editUser.email} className="w-full p-2 border rounded-lg" required />
                                    </div>
                                    <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2 rounded-xl mt-4">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Tasks Modal */}
            {showModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#111827]/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-2xl border border-[#E5E7EB] shadow-2xl overflow-hidden animate-in zoom-in-95">
                        <div className="p-6 border-b border-[#F3F4F6] flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={selectedUser.avatar ? (selectedUser.avatar.startsWith('http') ? selectedUser.avatar : `http://localhost:3000${selectedUser.avatar}`) : '/default-avatar.png'}
                                    className="w-10 h-10 rounded-xl object-cover shadow-sm bg-[#FAFAFA]"
                                    alt=""
                                />
                                <div>
                                    <h2 className="text-xl font-bold text-[#111827]">{selectedUser.name}'s Queue</h2>
                                    <p className="text-[#6B7280] text-xs font-medium">{selectedUser.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 text-[#9CA3AF] hover:text-[#111827] bg-[#F9FAFB] rounded-lg transition-all"
                            >
                                <X size={20} strokeWidth={2.5} />
                            </button>
                        </div>
                        <div className="p-6 max-h-[50vh] overflow-y-auto space-y-4 bg-[#FAFAFA]">
                            {todosLoading ? (
                                <div className="text-center py-16 bg-white rounded-xl border border-[#E5E7EB]">
                                    <div className="w-8 h-8 border-2 border-[#E5E7EB] border-t-[#4F46E5] rounded-full animate-spin mx-auto mb-3"></div>
                                    <p className="text-[#6B7280] text-xs font-medium">Loading session data...</p>
                                </div>
                            ) : userTodos.length > 0 ? (
                                userTodos.map((t) => (
                                    <div key={t._id} className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-sm group">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-[#111827] text-base mb-1">{t.title}</h3>
                                                {t.description && <p className="text-[#6B7280] text-sm font-medium">{t.description}</p>}
                                                <div className="mt-4 flex items-center space-x-2 text-[10px] font-bold text-[#9CA3AF] uppercase">
                                                    <Clock size={12} />
                                                    <span>Created {new Date(t.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-[#E5E7EB]">
                                    <p className="text-[#9CA3AF] font-bold text-xs uppercase tracking-wider">No active tasks found</p>
                                </div>
                            )}
                        </div>
                        <div className="p-5 border-t border-[#F3F4F6] flex justify-between items-center bg-white">
                            <div className="flex space-x-2">
                                <button
                                    disabled={todoPage === 1}
                                    onClick={() => setTodoPage(todoPage - 1)}
                                    className="p-2 bg-[#FAFAFA] rounded-md text-[#6B7280] disabled:opacity-20 border border-[#E5E7EB]"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    disabled={todoPage * 5 >= todoTotal}
                                    onClick={() => setTodoPage(todoPage + 1)}
                                    className="p-2 bg-[#FAFAFA] rounded-md text-[#6B7280] disabled:opacity-20 border border-[#E5E7EB]"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                            <span className="text-[#9CA3AF] text-[10px] font-bold tracking-widest uppercase">{todoTotal} Entries</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
