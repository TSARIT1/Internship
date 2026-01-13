import React, { useState, useEffect } from 'react';
import { getWebinars, addWebinar, deleteWebinar } from '../services/webinarApi';
import { Trash2, Plus, Calendar, Clock, Video, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminWebinars = () => {
    const [webinars, setWebinars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        speaker: '',
        date: '',
        time: '',
        description: '',
        meetingLink: '',
        image: ''
    });

    useEffect(() => {
        fetchWebinars();
    }, []);

    const fetchWebinars = async () => {
        try {
            const response = await getWebinars();
            setWebinars(response.data);
        } catch (error) {
            console.error("Error fetching webinars:", error);
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
            const response = await addWebinar(formData);
            setWebinars([...webinars, response.data]);
            setFormData({
                title: '',
                speaker: '',
                date: '',
                time: '',
                description: '',
                meetingLink: '',
                image: ''
            });
            alert("Webinar added successfully!");
        } catch (error) {
            console.error("Error adding webinar:", error);
            alert("Failed to add webinar.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this webinar?")) return;
        try {
            await deleteWebinar(id);
            setWebinars(webinars.filter(w => w.id !== id));
            alert("Webinar deleted successfully!");
        } catch (error) {
            console.error("Error deleting webinar:", error);
            alert("Failed to delete webinar.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-3xl font-bold text-slate-900 font-display">Webinar Management</h1>
                    <p className="text-slate-500">Admin Dashboard</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add Webinar Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-8">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Plus size={20} className="text-blue-600" />
                                Add New Webinar
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
                                    <input
                                        type="text" name="title" required
                                        value={formData.title} onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="e.g. React Masterclass"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Speaker</label>
                                    <input
                                        type="text" name="speaker" required
                                        value={formData.speaker} onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
                                        <input
                                            type="date" name="date" required
                                            value={formData.date} onChange={handleChange}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Time</label>
                                        <input
                                            type="time" name="time" required
                                            value={formData.time} onChange={handleChange}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Meeting Link</label>
                                    <div className="relative">
                                        <Video className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="url" name="meetingLink" required
                                            value={formData.meetingLink} onChange={handleChange}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                                            placeholder="https://meet.google.com/..."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Banner Image URL</label>
                                    <div className="relative">
                                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="url" name="image" required
                                            value={formData.image} onChange={handleChange}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                                            placeholder="https://images.unsplash.com/..."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                                    <textarea
                                        name="description" required rows="3"
                                        value={formData.description} onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="Brief description of the session..."
                                    />
                                </div>
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md">
                                    Create Webinar
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Webinar List */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold text-slate-900">Upcoming Webinars</h2>
                        {loading ? (
                            <div className="flex justify-center p-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-slate-600"></div>
                            </div>
                        ) : webinars.length === 0 ? (
                            <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center text-slate-500">
                                No webinars scheduled yet.
                            </div>
                        ) : (
                            webinars.map((webinar) => (
                                <motion.div
                                    key={webinar.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex gap-6 items-center"
                                >
                                    <img
                                        src={webinar.image}
                                        alt={webinar.title}
                                        className="w-24 h-24 rounded-lg object-cover hidden sm:block"
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-slate-900 mb-1">{webinar.title}</h3>
                                        <p className="text-sm text-slate-500 mb-2">by {webinar.speaker}</p>
                                        <div className="flex gap-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                                            <span className="flex items-center gap-1"><Calendar size={14} /> {webinar.date}</span>
                                            <span className="flex items-center gap-1"><Clock size={14} /> {webinar.time}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(webinar.id)}
                                        className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Webinar"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminWebinars;
