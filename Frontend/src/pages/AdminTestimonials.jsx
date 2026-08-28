import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, Upload, User, Image } from 'lucide-react';
import { getTestimonials, addTestimonial, deleteTestimonial } from '../services/testimonialApi';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

// Helper: Initials Avatar fallback
const InitialsAvatar = ({ name, size = 48 }) => {
    const initials = (name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#f97316'];
    const color = colors[name ? name.charCodeAt(0) % colors.length : 0];
    return (
        <div
            style={{ width: size, height: size, backgroundColor: color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.36, fontWeight: 700, color: '#fff', flexShrink: 0 }}
        >
            {initials}
        </div>
    );
};

// Smart avatar: shows image if valid, initials otherwise
const SmartAvatar = ({ src, name, size = 48 }) => {
    const [imgError, setImgError] = useState(false);
    if (!src || imgError) return <InitialsAvatar name={name} size={size} />;
    return (
        <img
            src={src}
            alt={name}
            style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
            onError={() => setImgError(true)}
        />
    );
};

const AdminTestimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [form, setForm] = useState({ name: '', course: '', message: '', image: '' });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');
    const fileInputRef = useRef(null);

    const loadTestimonials = async () => {
        const response = await getTestimonials();
        setTestimonials(response.data);
        setLoading(false);
    };

    useEffect(() => {
        loadTestimonials();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Delete this testimonial?')) {
            await deleteTestimonial(id);
            setTestimonials(testimonials.filter(t => t.id !== id));
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show local preview immediately
        const localUrl = URL.createObjectURL(file);
        setPreviewUrl(localUrl);

        // Upload to backend
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await axios.post(`${API_BASE}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const uploadedUrl = res.data.fileUrl;
            setForm(prev => ({ ...prev, image: uploadedUrl }));
            setPreviewUrl(uploadedUrl);
        } catch (err) {
            alert('Image upload failed. Please try a URL instead.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await addTestimonial(form);
        setTestimonials([...testimonials, response.data]);
        setForm({ name: '', course: '', message: '', image: '' });
        setPreviewUrl('');
        alert('Testimonial Added!');
    };

    return (
        <div className="p-6 md:p-12 max-w-7xl mx-auto">
            <header className="mb-12">
                <h1 className="text-3xl font-bold text-slate-900 font-display">Testimonials</h1>
                <p className="text-slate-500">Manage student feedback</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Plus size={20} className="text-blue-600" /> Add New
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Student Name</label>
                                <input
                                    type="text" required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Course/Webinar</label>
                                <input
                                    type="text" required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                    value={form.course} onChange={e => setForm({ ...form, course: e.target.value })}
                                />
                            </div>

                            {/* Photo Upload */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Student Photo</label>

                                {/* Preview */}
                                <div className="flex items-center gap-3 mb-3">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="preview" className="w-14 h-14 rounded-full object-cover border-2 border-blue-200" onError={() => setPreviewUrl('')} />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-300">
                                            <User size={22} className="text-slate-400" />
                                        </div>
                                    )}
                                    <div className="flex-1 text-xs text-slate-500">
                                        {uploading ? 'Uploading...' : previewUrl ? 'Photo selected' : 'No photo selected'}
                                    </div>
                                </div>

                                {/* Upload button */}
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="w-full flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 hover:bg-slate-100 text-slate-700 font-medium text-sm transition-colors disabled:opacity-50"
                                >
                                    <Upload size={16} />
                                    {uploading ? 'Uploading...' : 'Upload Photo'}
                                </button>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

                                {/* Or paste URL */}
                                <div className="relative my-2 flex items-center">
                                    <div className="flex-grow border-t border-slate-200"></div>
                                    <span className="mx-2 text-xs text-slate-400 flex-shrink-0">or paste URL</span>
                                    <div className="flex-grow border-t border-slate-200"></div>
                                </div>
                                <div className="relative">
                                    <Image size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="url"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:border-blue-500 text-sm"
                                        placeholder="https://..."
                                        value={form.image}
                                        onChange={e => {
                                            setForm({ ...form, image: e.target.value });
                                            setPreviewUrl(e.target.value);
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Message</label>
                                <textarea
                                    required rows="4"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                    value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                                />
                            </div>
                            <button type="submit" disabled={uploading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md disabled:opacity-50">
                                Add Testimonial
                            </button>
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {loading && (
                        <p className="col-span-2 text-center text-slate-400 py-12">Loading...</p>
                    )}
                    {!loading && testimonials.length === 0 && (
                        <p className="col-span-2 text-center text-slate-400 py-12">No testimonials yet.</p>
                    )}
                    {testimonials.map(item => (
                        <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <SmartAvatar src={item.image} name={item.name} size={48} />
                                    <div>
                                        <h3 className="font-bold text-slate-900">{item.name}</h3>
                                        <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">{item.course}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="text-slate-400 hover:text-red-500 transition-colors p-2"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <p className="text-slate-600 text-sm italic relative pl-4 border-l-2 border-slate-200">
                                "{item.message}"
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminTestimonials;
