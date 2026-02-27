import React, { useState, useEffect } from 'react';
import { getWebinarsAdmin, addWebinar, deleteWebinar, updateWebinar, getWebinarRegistrations } from '../services/webinarApi';
import { Trash2, Plus, Calendar, Clock, Video, Image as ImageIcon, Pencil, X, IndianRupee, Unlock, Users, ChevronDown, ChevronUp, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const emptyForm = {
    title: '',
    speaker: '',
    date: '',
    time: '',
    description: '',
    meetingLink: '',
    image: '',
    isPaid: false,
    price: ''
};

const AdminWebinars = () => {
    const [webinars, setWebinars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [expandedWebinar, setExpandedWebinar] = useState(null);
    const [registrations, setRegistrations] = useState({});
    const [loadingRegs, setLoadingRegs] = useState({});

    useEffect(() => {
        fetchWebinars();
    }, []);

    const fetchWebinars = async () => {
        try {
            const response = await getWebinarsAdmin();
            setWebinars(response.data);
        } catch (error) {
            console.error("Error fetching webinars:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
            // clear price if switching to free
            ...(name === 'isPaid' && !checked ? { price: '' } : {})
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            isPaid: formData.isPaid,
            price: formData.isPaid && formData.price !== '' ? parseFloat(formData.price) : null
        };
        try {
            if (editingId) {
                const response = await updateWebinar(editingId, payload);
                setWebinars(webinars.map(w => w.id === editingId ? response.data : w));
                setEditingId(null);
                alert("Webinar updated successfully!");
            } else {
                const response = await addWebinar(payload);
                setWebinars([...webinars, response.data]);
                alert("Webinar added successfully!");
            }
            setFormData(emptyForm);
        } catch (error) {
            console.error("Error saving webinar:", error);
            alert("Failed to save webinar.");
        }
    };

    const handleEdit = (webinar) => {
        setEditingId(webinar.id);
        setFormData({
            title: webinar.title || '',
            speaker: webinar.speaker || '',
            date: webinar.date || '',
            time: webinar.time || '',
            description: webinar.description || '',
            meetingLink: webinar.meetingLink || '',
            image: webinar.image || '',
            isPaid: webinar.isPaid || false,
            price: webinar.price != null ? String(webinar.price) : ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData(emptyForm);
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

    const toggleRegistrations = async (webinarId) => {
        if (expandedWebinar === webinarId) {
            setExpandedWebinar(null);
            return;
        }
        setExpandedWebinar(webinarId);
        if (!registrations[webinarId]) {
            setLoadingRegs(prev => ({ ...prev, [webinarId]: true }));
            try {
                const response = await getWebinarRegistrations(webinarId);
                setRegistrations(prev => ({ ...prev, [webinarId]: response.data }));
            } catch (error) {
                console.error("Error fetching registrations:", error);
            } finally {
                setLoadingRegs(prev => ({ ...prev, [webinarId]: false }));
            }
        }
    };

    // Helper to get webinar status
    const getWebinarStatus = (webinar) => {
        if (!webinar.date) return { label: 'No Date', color: 'bg-slate-100 text-slate-600' };
        const now = new Date();
        const webinarDate = new Date(webinar.date);
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const wDate = new Date(webinarDate.getFullYear(), webinarDate.getMonth(), webinarDate.getDate());

        if (wDate > today) return { label: 'Upcoming', color: 'bg-blue-100 text-blue-700' };
        if (wDate < today) return { label: 'Completed', color: 'bg-slate-100 text-slate-600' };
        return { label: 'Live Today', color: 'bg-green-100 text-green-700' };
    };

    return (
        <div className="p-6 md:p-12 max-w-7xl mx-auto">
            <header className="mb-12">
                <h1 className="text-3xl font-bold text-slate-900 font-display">Webinars</h1>
                <p className="text-slate-500">Manage upcoming sessions</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add/Edit Webinar Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                {editingId ? <Pencil size={20} className="text-blue-600" /> : <Plus size={20} className="text-blue-600" />}
                                {editingId ? 'Edit Webinar' : 'Add New Webinar'}
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

                            {/* Paid / Free Toggle */}
                            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                                <label className="block text-sm font-bold text-slate-700 mb-3">Webinar Type</label>
                                <div className="flex gap-3">
                                    <label className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg border-2 cursor-pointer transition-all font-semibold text-sm ${!formData.isPaid ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 bg-white text-slate-500'}`}>
                                        <input
                                            type="radio" name="isPaid" className="hidden"
                                            checked={!formData.isPaid}
                                            onChange={() => setFormData(prev => ({ ...prev, isPaid: false, price: '' }))}
                                        />
                                        <Unlock size={15} />
                                        Free
                                    </label>
                                    <label className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg border-2 cursor-pointer transition-all font-semibold text-sm ${formData.isPaid ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-200 bg-white text-slate-500'}`}>
                                        <input
                                            type="radio" name="isPaid" className="hidden"
                                            checked={formData.isPaid}
                                            onChange={() => setFormData(prev => ({ ...prev, isPaid: true }))}
                                        />
                                        <IndianRupee size={15} />
                                        Paid
                                    </label>
                                </div>

                                {/* Price input — visible only when Paid */}
                                {formData.isPaid && (
                                    <div className="mt-3">
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Price (₹)</label>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                                            <input
                                                type="number" name="price" min="1" step="1"
                                                required={formData.isPaid}
                                                value={formData.price} onChange={handleChange}
                                                className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-amber-500 transition-colors"
                                                placeholder="e.g. 499"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button type="submit" className={`w-full text-white font-bold py-3 rounded-xl transition-colors shadow-md ${editingId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                {editingId ? 'Update Webinar' : 'Create Webinar'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Webinar List */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-slate-900">All Webinars</h2>
                    {loading ? (
                        <div className="flex justify-center p-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-slate-600"></div>
                        </div>
                    ) : webinars.length === 0 ? (
                        <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center text-slate-500">
                            No webinars scheduled yet.
                        </div>
                    ) : (
                        webinars.map((webinar) => {
                            const status = getWebinarStatus(webinar);
                            const regs = registrations[webinar.id] || [];
                            const isExpanded = expandedWebinar === webinar.id;

                            return (
                                <motion.div
                                    key={webinar.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${editingId === webinar.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'}`}
                                >
                                    <div className="p-4 flex gap-6 items-center">
                                        <img
                                            src={webinar.image}
                                            alt={webinar.title}
                                            className="w-24 h-24 rounded-lg object-cover hidden sm:block"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <h3 className="text-lg font-bold text-slate-900">{webinar.title}</h3>
                                                {webinar.isPaid ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                                        <IndianRupee size={11} />{webinar.price}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                                        FREE
                                                    </span>
                                                )}
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${status.color}`}>
                                                    {status.label}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 mb-2">by {webinar.speaker}</p>
                                            <div className="flex gap-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                                                <span className="flex items-center gap-1"><Calendar size={14} /> {webinar.date}</span>
                                                <span className="flex items-center gap-1"><Clock size={14} /> {webinar.time}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <button
                                                type="button"
                                                onClick={() => toggleRegistrations(webinar.id)}
                                                className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors relative"
                                                title="View Registrations"
                                            >
                                                <Users size={20} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(webinar)}
                                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit Webinar"
                                            >
                                                <Pencil size={20} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(webinar.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Webinar"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Registrations Expandable Section */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="border-t border-slate-100 overflow-hidden"
                                            >
                                                <div className="p-4 bg-slate-50">
                                                    <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                                        <Users size={16} />
                                                        Registered Students ({regs.length})
                                                    </h4>
                                                    {loadingRegs[webinar.id] ? (
                                                        <div className="flex justify-center py-4">
                                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-300 border-t-slate-600"></div>
                                                        </div>
                                                    ) : regs.length === 0 ? (
                                                        <p className="text-sm text-slate-400 text-center py-4">No registrations yet.</p>
                                                    ) : (
                                                        <div className="space-y-2 max-h-60 overflow-y-auto">
                                                            {regs.map((reg, idx) => (
                                                                <div key={reg.id || idx} className="flex items-center justify-between bg-white rounded-lg px-4 py-2 text-sm border border-slate-100">
                                                                    <div>
                                                                        <span className="font-semibold text-slate-800">{reg.studentName}</span>
                                                                        <span className="text-slate-400 ml-2 flex items-center gap-1 inline-flex">
                                                                            <Mail size={12} /> {reg.studentEmail}
                                                                        </span>
                                                                    </div>
                                                                    <span className="text-xs text-slate-400">
                                                                        {reg.registeredAt ? new Date(reg.registeredAt).toLocaleDateString() : ''}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminWebinars;
