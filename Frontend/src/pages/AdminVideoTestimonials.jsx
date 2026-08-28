import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, Video, ExternalLink, Upload, User, Image } from 'lucide-react';
import { getVideoTestimonials, addVideoTestimonial, deleteVideoTestimonial } from '../services/testimonialApi';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

// Helper: Initials Avatar fallback
const InitialsAvatar = ({ name, size = 48 }) => {
    const initials = (name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#f97316'];
    const color = colors[name ? name.charCodeAt(0) % colors.length : 0];
    return (
        <div style={{ width: size, height: size, backgroundColor: color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.36, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {initials}
        </div>
    );
};

const SmartAvatar = ({ src, name, size = 48 }) => {
    const [imgError, setImgError] = useState(false);
    if (!src || imgError) return <InitialsAvatar name={name} size={size} />;
    return (
        <img src={src} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} onError={() => setImgError(true)} />
    );
};

// Auto-generate YouTube thumbnail from URL
const getYouTubeThumbnail = (url) => {
    if (!url) return null;
    const patterns = [
        /youtu\.be\/([^?&]+)/,
        /youtube\.com\/watch\?v=([^&]+)/,
        /youtube\.com\/shorts\/([^?&]+)/,
        /youtube\.com\/embed\/([^?&]+)/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
    }
    return null;
};

const AdminVideoTestimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [form, setForm] = useState({ name: '', course: '', message: '', videoUrl: '', thumbnail: '' });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [thumbPreview, setThumbPreview] = useState('');
    const thumbInputRef = useRef(null);

    const loadTestimonials = async () => {
        const response = await getVideoTestimonials();
        setTestimonials(response.data);
        setLoading(false);
    };

    useEffect(() => {
        loadTestimonials();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Delete this video testimonial?')) {
            await deleteVideoTestimonial(id);
            setTestimonials(testimonials.filter(t => t.id !== id));
        }
    };

    // When video URL changes, auto-extract YouTube thumbnail
    const handleVideoUrlChange = (url) => {
        setForm(prev => ({ ...prev, videoUrl: url }));
        if (!form.thumbnail) {
            const autoThumb = getYouTubeThumbnail(url);
            if (autoThumb) {
                setThumbPreview(autoThumb);
                setForm(prev => ({ ...prev, videoUrl: url, thumbnail: autoThumb }));
            }
        }
    };

    const handleThumbUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const localUrl = URL.createObjectURL(file);
        setThumbPreview(localUrl);
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await axios.post(`${API_BASE}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            const uploadedUrl = res.data.fileUrl;
            setForm(prev => ({ ...prev, thumbnail: uploadedUrl }));
            setThumbPreview(uploadedUrl);
        } catch {
            alert('Thumbnail upload failed.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // If no thumbnail set, auto-use YouTube thumbnail
            const autoThumb = getYouTubeThumbnail(form.videoUrl);
            const dataToSubmit = {
                ...form,
                thumbnail: form.thumbnail || autoThumb || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600'
            };
            const response = await addVideoTestimonial(dataToSubmit);
            setTestimonials([...testimonials, response.data]);
            setForm({ name: '', course: '', message: '', videoUrl: '', thumbnail: '' });
            setThumbPreview('');
            alert('Video Testimonial Added Successfully!');
        } catch (error) {
            alert(`Failed to add video testimonial: ${error.message}`);
        }
    };

    return (
        <div className="p-6 md:p-12 max-w-7xl mx-auto">
            <header className="mb-12">
                <h1 className="text-3xl font-bold text-slate-900 font-display">Video Testimonials</h1>
                <p className="text-slate-500">Manage student video feedback</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-8">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Plus size={20} className="text-blue-600" /> Add New Video
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Student Name</label>
                                <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Course/Webinar</label>
                                <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                    value={form.course} onChange={e => setForm({ ...form, course: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Video URL (YouTube)</label>
                                <input type="url" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                    placeholder="https://youtube.com/shorts/..."
                                    value={form.videoUrl} onChange={e => handleVideoUrlChange(e.target.value)} />
                                <p className="text-xs text-slate-400 mt-1">YouTube thumbnail will be auto-generated</p>
                            </div>

                            {/* Thumbnail Upload */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Thumbnail <span className="text-slate-400 font-normal">(Optional - auto from YouTube)</span>
                                </label>
                                {thumbPreview && (
                                    <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-slate-100">
                                        <img src={thumbPreview} alt="thumb" className="w-full h-full object-cover" onError={() => setThumbPreview('')} />
                                    </div>
                                )}
                                <button type="button" onClick={() => thumbInputRef.current?.click()} disabled={uploading}
                                    className="w-full flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 hover:bg-slate-100 text-slate-700 font-medium text-sm transition-colors disabled:opacity-50">
                                    <Upload size={16} />
                                    {uploading ? 'Uploading...' : 'Upload Custom Thumbnail'}
                                </button>
                                <input ref={thumbInputRef} type="file" accept="image/*" className="hidden" onChange={handleThumbUpload} />

                                <div className="relative my-2 flex items-center">
                                    <div className="flex-grow border-t border-slate-200"></div>
                                    <span className="mx-2 text-xs text-slate-400 flex-shrink-0">or paste URL</span>
                                    <div className="flex-grow border-t border-slate-200"></div>
                                </div>
                                <div className="relative">
                                    <Image size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="url" className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:border-blue-500 text-sm"
                                        placeholder="https://..."
                                        value={form.thumbnail}
                                        onChange={e => { setForm({ ...form, thumbnail: e.target.value }); setThumbPreview(e.target.value); }} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Message</label>
                                <textarea required rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                    value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                            </div>
                            <button type="submit" disabled={uploading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md disabled:opacity-50">
                                Add Video
                            </button>
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {loading && <p className="col-span-2 text-center text-slate-400 py-12">Loading...</p>}
                    {!loading && testimonials.length === 0 && <p className="col-span-2 text-center text-slate-400 py-12">No video testimonials yet.</p>}
                    {testimonials.map(item => {
                        const displayThumb = item.thumbnail || getYouTubeThumbnail(item.videoUrl);
                        return (
                            <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative group">
                                {/* Thumbnail Preview */}
                                <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-slate-100">
                                    {displayThumb ? (
                                        <img src={displayThumb} alt={item.name} className="w-full h-full object-cover"
                                            onError={e => { e.target.style.display = 'none'; }} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Video size={32} className="text-slate-300" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                        <div className="p-2 bg-white/90 rounded-full shadow-sm">
                                            <Video size={20} className="text-blue-600" />
                                        </div>
                                    </div>
                                    <a href={item.videoUrl} target="_blank" rel="noopener noreferrer"
                                        className="absolute bottom-2 right-2 p-1.5 bg-black/60 text-white rounded-lg hover:bg-black/80 transition-colors" title="Open Video">
                                        <ExternalLink size={14} />
                                    </a>
                                </div>

                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <SmartAvatar src={item.image} name={item.name} size={38} />
                                        <div>
                                            <h3 className="font-bold text-slate-900">{item.name}</h3>
                                            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">{item.course}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-red-500 transition-colors p-2" title="Delete">
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <p className="text-slate-600 text-sm mt-3 line-clamp-2">
                                    "{item.message}"
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AdminVideoTestimonials;
