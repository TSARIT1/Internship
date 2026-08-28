import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { getTestimonials } from '../services/testimonialApi';

// Initials avatar for when image fails or is missing
const InitialsAvatar = ({ name }) => {
    const initials = (name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#f97316'];
    const color = colors[name ? name.charCodeAt(0) % colors.length : 0];
    return (
        <div style={{
            width: 48, height: 48, borderRadius: '50%',
            backgroundColor: color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 700, color: '#fff', flexShrink: 0
        }}>
            {initials}
        </div>
    );
};

const SmartAvatar = ({ src, name }) => {
    const [imgError, setImgError] = useState(false);
    if (!src || imgError) return <InitialsAvatar name={name} />;
    return (
        <img
            src={src}
            alt={name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md flex-shrink-0"
            onError={() => setImgError(true)}
        />
    );
};

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getTestimonials();
            setTestimonials(response.data);
        };
        fetchData();
    }, []);

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl lg:text-5xl font-bold font-display text-slate-900 mb-6"
                    >
                        Success <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Stories</span>
                    </motion.h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                        Hear from our students who transformed their careers with us.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={item.id || index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-lg relative hover:-translate-y-2 transition-transform duration-300"
                        >
                            <Quote className="absolute top-8 right-8 text-teal-100" size={48} />

                            <div className="flex gap-1 mb-6 text-amber-400">
                                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                            </div>

                            <p className="text-slate-700 mb-8 leading-relaxed relative z-10 font-medium h-24 overflow-y-auto">
                                "{item.message}"
                            </p>

                            <div className="flex items-center gap-4">
                                <SmartAvatar src={item.image} name={item.name} />
                                <div>
                                    <div className="font-bold text-slate-900">{item.name}</div>
                                    <div className="text-xs text-teal-600 font-bold uppercase tracking-wide">{item.course}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
