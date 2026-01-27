import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Video, ExternalLink } from 'lucide-react';
import { getVideoTestimonials, addVideoTestimonial, deleteVideoTestimonial } from '../services/testimonialApi';

const AdminVideoTestimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [form, setForm] = useState({ name: '', course: '', message: '', videoUrl: '', thumbnail: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTestimonials();
    }, []);

    const loadTestimonials = async () => {
        const response = await getVideoTestimonials();
        setTestimonials(response.data);
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this video testimonial?')) {
            await deleteVideoTestimonial(id);
            setTestimonials(testimonials.filter(t => t.id !== id));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSubmit = {
            ...form,
            thumbnail: form.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600" // Default generic tech image
        };
        const response = await addVideoTestimonial(dataToSubmit);
        setTestimonials([...testimonials, response.data]);
        setForm({ name: '', course: '', message: '', videoUrl: '', thumbnail: '' });
        alert('Video Testimonial Added!');
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
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Video URL (YouTube/Embed)</label>
                                <input
                                    type="url" required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                    placeholder="https://www.youtube.com/embed/..."
                                    value={form.videoUrl} onChange={e => setForm({ ...form, videoUrl: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Thumbnail URL <span className="text-slate-400 font-normal">(Optional)</span></label>
                                <input
                                    type="url"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                    placeholder="https://..."
                                    value={form.thumbnail} onChange={e => setForm({ ...form, thumbnail: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Message</label>
                                <textarea
                                    required rows="3"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                    value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md">
                                Add Video
                            </button>
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {testimonials.map(item => (
                        <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative group">
                            {/* Thumbnail Preview */}
                            <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-slate-100">
                                <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                    <div className="p-2 bg-white/90 rounded-full shadow-sm">
                                        <Video size={20} className="text-blue-600" />
                                    </div>
                                </div>
                                <a
                                    href={item.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute bottom-2 right-2 p-1.5 bg-black/60 text-white rounded-lg hover:bg-black/80 transition-colors"
                                    title="Open Video"
                                >
                                    <ExternalLink size={14} />
                                </a>
                            </div>

                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-bold text-slate-900">{item.name}</h3>
                                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">{item.course}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="text-slate-400 hover:text-red-500 transition-colors p-2"
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <p className="text-slate-600 text-sm mt-3 line-clamp-2">
                                "{item.message}"
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminVideoTestimonials;
