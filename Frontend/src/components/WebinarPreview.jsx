import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, MonitorPlay, ArrowRight, Users, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getWebinars, guestRegisterForWebinar } from '../services/webinarApi';

const WebinarPreview = () => {
    const [webinars, setWebinars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWebinars = async () => {
            try {
                const response = await getWebinars();
                if (response.data && response.data.length > 0) {
                    // Filter upcoming webinars (date in the future or today)
                    const now = new Date();
                    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

                    const upcoming = response.data.filter(w => {
                        if (!w.date) return true; // include if no date
                        const wDate = new Date(w.date);
                        return wDate >= today;
                    });

                    // Take up to 3 upcoming, or fall back to latest 3
                    setWebinars(upcoming.length > 0 ? upcoming.slice(0, 3) : response.data.slice(0, 3));
                }
            } catch (error) {
                console.error("Failed to fetch webinars for preview", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWebinars();
    }, []);

    if (loading) return null;
    if (webinars.length === 0) return null;

    return (
        <section id="webinars" className="py-24 bg-white relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] opacity-50 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block"
                    >
                        <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-4 inline-flex items-center gap-2 border border-indigo-100">
                            <MonitorPlay size={16} />
                            Live Sessions
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-bold font-display text-slate-900 mb-6 mt-4">
                            Upcoming{' '}
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Webinars
                            </span>
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
                            Learn from industry experts in live, interactive sessions. Free and paid webinars on trending technologies.
                        </p>
                    </motion.div>
                </div>

                {/* Webinar Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {webinars.map((webinar, index) => (
                        <motion.div
                            key={webinar.id || index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                        >
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />
                                {webinar.image ? (
                                    <img
                                        src={webinar.image}
                                        alt={webinar.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                        <Video size={48} className="text-white/50" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 z-20 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                    Upcoming
                                </div>
                                <div className={`absolute top-4 right-4 z-20 ${webinar.isPaid ? 'bg-amber-500' : 'bg-green-500'} text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm`}>
                                    {webinar.isPaid ? `₹${webinar.price}` : 'FREE'}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                    {webinar.title}
                                </h3>

                                {webinar.speaker && (
                                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                                        <User size={14} className="text-indigo-500" />
                                        <span className="font-medium">{webinar.speaker}</span>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-3 mb-4">
                                    {webinar.date && (
                                        <div className="flex items-center gap-1.5 text-slate-600 text-xs bg-slate-50 px-3 py-1.5 rounded-lg">
                                            <Calendar size={14} className="text-indigo-500" />
                                            <span>{webinar.date}</span>
                                        </div>
                                    )}
                                    {webinar.time && (
                                        <div className="flex items-center gap-1.5 text-slate-600 text-xs bg-slate-50 px-3 py-1.5 rounded-lg">
                                            <Clock size={14} className="text-indigo-500" />
                                            <span>{webinar.time}</span>
                                        </div>
                                    )}
                                </div>

                                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4">
                                    {webinar.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link
                            to="/webinars"
                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 hover:gap-3"
                        >
                            View All Webinars <ArrowRight size={18} />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default WebinarPreview;
