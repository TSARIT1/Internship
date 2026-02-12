import React, { useState, useEffect } from 'react';
import { getHackathons, addHackathon, updateHackathon, deleteHackathon } from '../services/hackathonApi';
import { Trash2, Plus, Calendar, Clock, Trophy, MapPin, Pencil, X, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminHackathons = () => {
    const [hackathons, setHackathons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        prizePool: '',
        status: 'Upcoming', // Default
        mode: 'Online' // Default
    });

    useEffect(() => {
        fetchHackathons();
    }, []);

    const fetchHackathons = async () => {
        try {
            const response = await getHackathons();
            if (response.success) {
                setHackathons(response.data);
            }
        } catch (error) {
            console.error("Error fetching hackathons:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                const response = await updateHackathon(editingId, formData);
                if (response.success) {
                    setHackathons(hackathons.map(h => h.id === editingId ? response.data : h));
                    setEditingId(null);
                    alert("Hackathon updated successfully!");
                } else {
                    alert("Failed to update hackathon.");
                }

            } else {
                const response = await addHackathon(formData);
                if (response.success) {
                    setHackathons([...hackathons, response.data]);
                    alert("Hackathon added successfully!");
                } else {
                    alert("Failed to add hackathon.");
                }
            }
            setFormData({
                title: '', description: '', date: '', time: '', prizePool: '', status: 'Upcoming', mode: 'Online'
            });
        } catch (error) {
            console.error("Error saving hackathon:", error);
            alert("Failed to save hackathon.");
        }
    };

    const handleEdit = (hackathon) => {
        setEditingId(hackathon.id);
        setFormData({
            title: hackathon.title || '',
            description: hackathon.description || '',
            date: hackathon.date || '',
            time: hackathon.time || '',
            prizePool: hackathon.prizePool || '',
            status: hackathon.status || 'Upcoming',
            mode: hackathon.mode || 'Online'
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({
            title: '', description: '', date: '', time: '', prizePool: '', status: 'Upcoming', mode: 'Online'
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this hackathon?")) return;
        try {
            const response = await deleteHackathon(id);
            if (response.success) {
                setHackathons(hackathons.filter(h => h.id !== id));
                alert("Hackathon deleted successfully!");
            } else {
                alert("Failed to delete hackathon.");
            }
        } catch (error) {
            console.error("Error deleting hackathon:", error);
            alert("Failed to delete hackathon.");
        }
    };

    return (
        <div className="p-6 md:p-12 max-w-7xl mx-auto">
            <header className="mb-12">
                <h1 className="text-3xl font-bold text-slate-900 font-display">Hackathons</h1>
                <p className="text-slate-500">Manage coding challenges and events</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add/Edit Hackathon Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                {editingId ? <Pencil size={20} className="text-blue-600" /> : <Plus size={20} className="text-blue-600" />}
                                {editingId ? 'Edit Hackathon' : 'Add New Hackathon'}
                            </h2>
                            {editingId && (
                                <button onClick={handleCancelEdit} className="text-slate-400 hover:text-slate-600">
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
                                <input
                                    type="text" name="title" required
                                    value={formData.title} onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="e.g. Code The Future 2024"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                                <textarea
                                    name="description" required rows="3"
                                    value={formData.description} onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Event details..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
                                    <input
                                        type="text" name="date" required
                                        value={formData.date} onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="e.g. March 15-16, 2024"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Time</label>
                                    <input
                                        type="text" name="time" required
                                        value={formData.time} onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="e.g. 24 Hours"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Prize Pool</label>
                                <div className="relative">
                                    <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text" name="prizePool" required
                                        value={formData.prizePool} onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="e.g. ₹ 50,000"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Mode</label>
                                    <select
                                        name="mode"
                                        value={formData.mode} onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                                    >
                                        <option value="Online">Online</option>
                                        <option value="Offline">Offline</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status} onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                                    >
                                        <option value="Upcoming">Upcoming</option>
                                        <option value="Ongoing">Ongoing</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" className={`w-full text-white font-bold py-3 rounded-xl transition-colors shadow-md ${editingId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                {editingId ? 'Update Hackathon' : 'Create Hackathon'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Hackathon List */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-slate-900">Upcoming Hackathons</h2>
                    {loading ? (
                        <div className="flex justify-center p-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-slate-600"></div>
                        </div>
                    ) : hackathons.length === 0 ? (
                        <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center text-slate-500">
                            No updated hackathons found.
                        </div>
                    ) : (
                        hackathons.map((hackathon) => (
                            <motion.div
                                key={hackathon.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`bg-white rounded-2xl border shadow-sm p-4 flex gap-6 items-center transition-all ${editingId === hackathon.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'}`}
                            >
                                <div className="hidden sm:flex w-16 h-16 bg-blue-50 rounded-xl items-center justify-center text-blue-600">
                                    <Trophy size={32} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-lg font-bold text-slate-900">{hackathon.title}</h3>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${hackathon.status === 'Upcoming' ? 'bg-emerald-100 text-emerald-700' :
                                                hackathon.status === 'Ongoing' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-slate-100 text-slate-700'
                                            }`}>
                                            {hackathon.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-2 line-clamp-2">{hackathon.description}</p>
                                    <div className="flex gap-4 text-xs font-bold text-slate-500 uppercase tracking-wide flex-wrap">
                                        <span className="flex items-center gap-1"><Calendar size={14} /> {hackathon.date}</span>
                                        <span className="flex items-center gap-1"><Clock size={14} /> {hackathon.time}</span>
                                        <span className="flex items-center gap-1"><MapPin size={14} /> {hackathon.mode}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleEdit(hackathon)}
                                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit Hackathon"
                                    >
                                        <Pencil size={20} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(hackathon.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Hackathon"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminHackathons;
