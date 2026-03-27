import React, { useState, useEffect, useRef } from 'react';
import { getWebinarsAdmin, addWebinar, deleteWebinar, updateWebinar, getWebinarRegistrations } from '../services/webinarApi';
import { Trash2, Plus, Calendar, Clock, Video, Image as ImageIcon, Pencil, X, IndianRupee, Unlock, Users, Mail, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

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

// Format time from "HH:mm:ss.SSSSSS" or "HH:mm" → "HH:mm AM/PM"
const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    let h = parseInt(parts[0], 10);
    const m = parts[1] || '00';
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
};

const AdminWebinars = () => {
    const [webinars, setWebinars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [expandedWebinar, setExpandedWebinar] = useState(null);
    const [registrations, setRegistrations] = useState({});
    const [loadingRegs, setLoadingRegs] = useState({});
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const fileInputRef = useRef(null);

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
            ...(name === 'isPaid' && !checked ? { price: '' } : {})
        }));
        if (name === 'image') setImagePreview(value);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const localUrl = URL.createObjectURL(file);
        setImagePreview(localUrl);
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append('file', file);
            const res = await axios.post(`${API_BASE}/upload`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            const uploadedUrl = res.data.fileUrl;
            setFormData(prev => ({ ...prev, image: uploadedUrl }));
            setImagePreview(uploadedUrl);
        } catch {
            alert('Image upload failed. Please paste a URL instead.');
        } finally {
            setUploading(false);
        }
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
            setImagePreview('');
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
            time: webinar.time ? webinar.time.substring(0, 5) : '',
            description: webinar.description || '',
            meetingLink: webinar.meetingLink || '',
            image: webinar.image || '',
            isPaid: webinar.isPaid || false,
            price: webinar.price != null ? String(webinar.price) : ''
        });
        // Only show preview for http URLs, not base64
        const img = webinar.image || '';
        setImagePreview(img.startsWith('http') ? img : '');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData(emptyForm);
        setImagePreview('');
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this webinar?")) return;
        try {
            await deleteWebinar(id);
            setWebinars(webinars.filter(w => w.id !== id));
        } catch (error) {
            alert("Failed to delete webinar.");
        }
    };

    const toggleRegistrations = async (webinarId) => {
        if (expandedWebinar === webinarId) { setExpandedWebinar(null); return; }
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

    // Default gradient banner for webinars without a proper image
    const WebinarBanner = ({ src, title }) => {
        const [imgError, setImgError] = useState(false);
        const isValidUrl = src && src.startsWith('http');
        if (!isValidUrl || imgError) {
            return (
                <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 hidden sm:flex items-center justify-center flex-shrink-0">
                    <Video size={28} className="text-white" />
                </div>
            );
        }
        return <img src={src} alt={title} className="w-24 h-24 rounded-lg object-cover hidden sm:block flex-shrink-0" onError={() => setImgError(true)} />;
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
                                <input type="text" name="title" required value={formData.title} onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="e.g. React Masterclass" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Speaker</label>
                                <input type="text" name="speaker" required value={formData.speaker} onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="e.g. John Doe" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
                                    <input type="date" name="date" required value={formData.date} onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Time</label>
                                    <input type="time" name="time" required value={formData.time} onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Meeting Link</label>
                                <div className="relative">
                                    <Video className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input type="url" name="meetingLink" required value={formData.meetingLink} onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="https://meet.google.com/..." />
                                </div>
                            </div>

                            {/* Banner Image - Upload or URL */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Banner Image</label>

                                {/* Preview */}
                                {imagePreview && (
                                    <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-slate-100">
                                        <img src={imagePreview} alt="preview" className="w-full h-full object-cover"
                                            onError={() => setImagePreview('')} />
                                    </div>
                                )}

                                {/* Upload button */}
                                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                                    className="w-full flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 hover:bg-slate-100 text-slate-700 font-medium text-sm transition-colors disabled:opacity-50 mb-2">
                                    <Upload size={16} />
                                    {uploading ? 'Uploading...' : 'Upload Image'}
                                </button>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

                                <div className="relative my-2 flex items-center">
                                    <div className="flex-grow border-t border-slate-200"></div>
                                    <span className="mx-2 text-xs text-slate-400 flex-shrink-0">or paste URL</span>
                                    <div className="flex-grow border-t border-slate-200"></div>
                                </div>
                                <div className="relative">
                                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input type="url" name="image" value={formData.image} onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                                        placeholder="https://images.unsplash.com/..." />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                                <textarea name="description" required rows="3" value={formData.description} onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Brief description of the session..." />
                            </div>

                            {/* Paid / Free Toggle */}
                            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                                <label className="block text-sm font-bold text-slate-700 mb-3">Webinar Type</label>
                                <div className="flex gap-3">
                                    <label className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg border-2 cursor-pointer transition-all font-semibold text-sm ${!formData.isPaid ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-200 bg-white text-slate-500'}`}>
                                        <input type="radio" name="isPaid" className="hidden" checked={!formData.isPaid}
                                            onChange={() => setFormData(prev => ({ ...prev, isPaid: false, price: '' }))} />
                                        <Unlock size={15} /> Free
                                    </label>
                                    <label className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg border-2 cursor-pointer transition-all font-semibold text-sm ${formData.isPaid ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-200 bg-white text-slate-500'}`}>
                                        <input type="radio" name="isPaid" className="hidden" checked={formData.isPaid}
                                            onChange={() => setFormData(prev => ({ ...prev, isPaid: true }))} />
                                        <IndianRupee size={15} /> Paid
                                    </label>
                                </div>
                                {formData.isPaid && (
                                    <div className="mt-3">
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Price (₹)</label>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                                            <input type="number" name="price" min="1" step="1" required={formData.isPaid}
                                                value={formData.price} onChange={handleChange}
                                                className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-amber-500 transition-colors"
                                                placeholder="e.g. 499" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button type="submit" disabled={uploading}
                                className={`w-full text-white font-bold py-3 rounded-xl transition-colors shadow-md disabled:opacity-50 ${editingId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
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
                                    <div className="p-4 flex gap-4 items-center">
                                        <WebinarBanner src={webinar.image} title={webinar.title} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <h3 className="text-lg font-bold text-slate-900 truncate">{webinar.title}</h3>
                                                {webinar.isPaid ? (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                                                        <IndianRupee size={11} />{webinar.price}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">FREE</span>
                                                )}
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${status.color}`}>{status.label}</span>
                                            </div>
                                            <p className="text-sm text-slate-500 mb-2">by {webinar.speaker}</p>
                                            <div className="flex gap-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                                                <span className="flex items-center gap-1"><Calendar size={14} /> {webinar.date}</span>
                                                <span className="flex items-center gap-1"><Clock size={14} /> {formatTime(webinar.time)}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 flex-shrink-0">
                                            <button type="button" onClick={() => toggleRegistrations(webinar.id)}
                                                className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors" title="View Registrations">
                                                <Users size={20} />
                                            </button>
                                            <button type="button" onClick={() => handleEdit(webinar)}
                                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Webinar">
                                                <Pencil size={20} />
                                            </button>
                                            <button type="button" onClick={() => handleDelete(webinar.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Webinar">
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
                                                        <Users size={16} /> Registered Students ({regs.length})
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
                                                                        <span className="text-slate-400 ml-2 inline-flex items-center gap-1">
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
