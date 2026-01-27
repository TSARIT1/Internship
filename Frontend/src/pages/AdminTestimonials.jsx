import React, { useState, useEffect } from 'react';
import { Trash2, Plus, MessageSquareQuote } from 'lucide-react';
import { getTestimonials, addTestimonial, deleteTestimonial } from '../services/testimonialApi';

const AdminTestimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [form, setForm] = useState({ name: '', course: '', message: '', image: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTestimonials();
    }, []);

    const loadTestimonials = async () => {
        const response = await getTestimonials();
        setTestimonials(response.data);
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this testimonial?')) {
            await deleteTestimonial(id);
            setTestimonials(testimonials.filter(t => t.id !== id));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await addTestimonial(form);
        setTestimonials([...testimonials, response.data]);
        setForm({ name: '', course: '', message: '', image: '' });
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
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Photo URL</label>
                                <input
                                    type="url" required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                    placeholder="https://..."
                                    value={form.image} onChange={e => setForm({ ...form, image: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Message</label>
                                <textarea
                                    required rows="4"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                                    value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md">
                                Add Testimonial
                            </button>
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {testimonials.map(item => (
                        <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-full object-cover" />
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
