import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { todoApi } from '../api/todo.api';
import type { Todo } from '../types/todo';
import { Plus, CheckCircle2, Clock, Trash2, Edit3, Save, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';

export default function Dashboard() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [editingTodo, setEditingTodo] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTodos();
    }, [page]);

    const fetchTodos = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const res = await todoApi.getAll(page, 5);
            setTodos(res.data.data);
            setTotal(res.data.total);
        } catch (e) {
            console.error(e);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const createTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return;
        await todoApi.create({ title, description: desc });
        setTitle('');
        setDesc('');
        if (page === 1) fetchTodos(true);
        else setPage(1);
    }

    const deleteTodo = async (id: string) => {
        await todoApi.delete(id);
        fetchTodos(true);
    }

    const startEditing = (todo: Todo) => {
        setEditingTodo(todo._id);
        setEditTitle(todo.title);
        setEditDesc(todo.description || '');
    };

    const saveEdit = async (id: string) => {
        await todoApi.update(id, { title: editTitle, description: editDesc });
        setEditingTodo(null);
        fetchTodos(true);
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-[#111827] font-sans pb-20">
            <Navbar />

            <div className="container mx-auto p-6 max-w-5xl pt-16">
                {/* Modern Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-[#111827]">Product Dashboard</h1>
                        <p className="text-[#6B7280] font-medium mt-1">Manage tasks and team productivity in real-time.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-[#E5E7EB] shadow-sm">
                        <div className="w-2 h-2 bg-[#4F46E5] rounded-full"></div>
                        <span className="text-xs font-bold text-[#111827] uppercase tracking-wider">{total} Active Tasks</span>
                    </div>
                </div>

                {/* Add Task Input Card */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E5E7EB] mb-8">
                    <form onSubmit={createTodo} className="flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-2 ml-1">Task Title</label>
                                <input
                                    placeholder="e.g. Design system audit"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-[#FAFAFA] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all font-medium placeholder:text-[#6B7280]/40"
                                />
                            </div>
                            <div className="md:w-1/3">
                                <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-2 ml-1">Context / Priority</label>
                                <input
                                    placeholder="Technical details..."
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-[#FAFAFA] border border-[#E5E7EB] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5] transition-all font-medium placeholder:text-[#6B7280]/40"
                                />
                            </div>
                            <div className="flex items-end">
                                <button className="w-full md:w-auto bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all active:scale-95">
                                    <Plus size={18} strokeWidth={2.5} />
                                    Create Task
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Task List Grid */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-2 mb-4">
                        <LayoutGrid size={18} className="text-[#4F46E5]" />
                        <h2 className="text-sm font-bold text-[#111827] uppercase tracking-widest">My Task Queue</h2>
                    </div>

                    <div className="grid gap-4">
                        {loading ? (
                            <div className="bg-white rounded-2xl p-24 text-center border border-[#E5E7EB] shadow-sm">
                                <div className="w-10 h-10 border-3 border-[#E5E7EB] border-t-[#4F46E5] rounded-full animate-spin mx-auto mb-6"></div>
                                <p className="text-[#6B7280] text-sm font-medium animate-pulse">Loading tasks...</p>
                            </div>
                        ) : todos.length === 0 ? (
                            <div className="bg-white rounded-2xl p-24 text-center border border-[#E5E7EB] shadow-sm">
                                <div className="w-16 h-16 bg-[#FAFAFA] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#E5E7EB]">
                                    <CheckCircle2 size={32} className="text-[#E5E7EB]" />
                                </div>
                                <h3 className="text-[#111827] font-bold text-lg">No active tasks</h3>
                                <p className="text-[#6B7280] text-sm mt-1">Your productivity queue is currently empty.</p>
                            </div>
                        ) : (
                            todos.map((todo) => (
                                <div key={todo._id} className="bg-white p-6 rounded-2xl shadow-sm border border-[#E5E7EB] hover:border-[#4F46E5]/30 hover:shadow-md transition-all group">
                                    {editingTodo === todo._id ? (
                                        <div className="space-y-4">
                                            <input
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                className="w-full bg-[#FAFAFA] p-4 rounded-xl border border-[#4F46E5] outline-none text-[#111827] font-bold"
                                            />
                                            <textarea
                                                value={editDesc}
                                                onChange={(e) => setEditDesc(e.target.value)}
                                                className="w-full bg-[#FAFAFA] p-4 rounded-xl border border-[#4F46E5] outline-none text-[#6B7280] h-24 font-medium"
                                            />
                                            <div className="flex space-x-2">
                                                <button onClick={() => saveEdit(todo._id)} className="bg-[#4F46E5] text-white px-6 py-2 rounded-lg font-bold text-sm shadow-md flex items-center gap-2">
                                                    <Save size={14} /> Update
                                                </button>
                                                <button onClick={() => setEditingTodo(null)} className="bg-[#FAFAFA] text-[#6B7280] px-6 py-2 rounded-lg font-bold text-sm border border-[#E5E7EB]">
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-bold text-xl text-[#111827] transition-colors group-hover:text-[#4F46E5]">{todo.title}</h3>
                                                    <span className="bg-[#EEF2FF] text-[#4F46E5] px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#E0E7FF]">In Progress</span>
                                                </div>
                                                {todo.description && <p className="text-[#6B7280] text-sm font-medium leading-relaxed max-w-3xl">{todo.description}</p>}
                                                <div className="mt-4 flex items-center gap-4">
                                                    <span className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-widest flex items-center gap-1.5">
                                                        <Clock size={12} /> {new Date(todo.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => startEditing(todo)}
                                                    className="p-2 text-[#9CA3AF] hover:text-[#4F46E5] hover:bg-[#EEF2FF] rounded-lg transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => deleteTodo(todo._id)}
                                                    className="p-2 text-[#9CA3AF] hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {todos.length > 0 && (
                        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-[#E5E7EB] mt-8">
                            <span className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-wider ml-4">Showing page {page} of {Math.ceil(total / 5) || 1}</span>
                            <div className="flex space-x-2">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                    className="px-4 py-2 bg-[#FAFAFA] rounded-lg text-[#111827] text-xs font-bold disabled:opacity-30 border border-[#E5E7EB] hover:bg-white transition-all flex items-center gap-2"
                                >
                                    <ChevronLeft size={16} /> Previous
                                </button>
                                <button
                                    disabled={page * 5 >= total}
                                    onClick={() => setPage(page + 1)}
                                    className="px-4 py-2 bg-[#FAFAFA] rounded-lg text-[#111827] text-xs font-bold disabled:opacity-30 border border-[#E5E7EB] hover:bg-white transition-all flex items-center gap-2"
                                >
                                    Next <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
