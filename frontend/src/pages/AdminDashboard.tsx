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
        } finally {
            if (!silent) setTodosLoading(false);
        }
    };

    const toggleStatus = async (user: User) => {
        if (user.isDeleted) {
            await userApi.restoreUser(user._id);
        } else {
            await userApi.softDeleteUser(user._id);
        }
        fetchUsers(true);
    };

    const changeRole = async (id: string, newRole: string) => {
        await userApi.updateUser(id, { role: newRole });
        fetchUsers(true);
    };

    const getAvatarUrl = (avatar?: string) => {
        if (!avatar) return '/default-avatar.png';
        if (avatar.startsWith('http')) return avatar;
        return `${import.meta.env.VITE_API_URL}${avatar}`;
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#111827] pb-20">
            <Navbar />

            <div className="container mx-auto p-6 pt-16 max-w-7xl">
                <h1 className="text-3xl font-bold mb-8">Administration</h1>

                <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-[#F9FAFB] text-xs font-bold uppercase">
                            <tr>
                                <th className="p-6">User</th>
                                <th className="p-6">Role</th>
                                <th className="p-6">Status</th>
                                <th className="p-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-10 text-center">
                                        Loading...
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u._id} className="border-t">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={getAvatarUrl(u.avatar)}
                                                    className="w-12 h-12 rounded-xl object-cover"
                                                    alt={u.name}
                                                />
                                                <div>
                                                    <div className="font-bold">{u.name}</div>
                                                    <div className="text-xs text-gray-500">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-6">
                                            <select
                                                value={u.role}
                                                onChange={(e) =>
                                                    changeRole(u._id, e.target.value)
                                                }
                                                className="border p-1 rounded"
                                            >
                                                <option value="USER">User</option>
                                                <option value="ADMIN">Admin</option>
                                            </select>
                                        </td>

                                        <td className="p-6">
                                            {u.isDeleted ? 'Suspended' : 'Active'}
                                        </td>

                                        <td className="p-6 text-right">
                                            <button
                                                onClick={() => toggleStatus(u)}
                                                disabled={
                                                    u._id === currentUser?._id &&
                                                    !u.isDeleted
                                                }
                                                className="px-3 py-1 border rounded"
                                            >
                                                {u.isDeleted ? 'Activate' : 'Suspend'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    <div className="p-4 flex justify-between border-t">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <button
                            disabled={page * 10 >= total}
                            onClick={() => setPage(page + 1)}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {showModal && selectedUser && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-xl">
                        <div className="flex items-center gap-4 mb-4">
                            <img
                                src={getAvatarUrl(selectedUser.avatar)}
                                className="w-10 h-10 rounded-xl"
                                alt=""
                            />
                            <div>
                                <h2 className="font-bold">
                                    {selectedUser.name}'s Tasks
                                </h2>
                                <p className="text-xs text-gray-500">
                                    {selectedUser.email}
                                </p>
                            </div>
                        </div>

                        {userTodos.map((t) => (
                            <div key={t._id} className="border p-3 rounded mb-2">
                                <div className="font-bold">{t.title}</div>
                                {t.description && (
                                    <div className="text-sm text-gray-500">
                                        {t.description}
                                    </div>
                                )}
                                <div className="text-xs text-gray-400 mt-2">
                                    <Clock size={12} className="inline mr-1" />
                                    {new Date(t.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={() => setShowModal(false)}
                            className="mt-4 px-4 py-2 border rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
