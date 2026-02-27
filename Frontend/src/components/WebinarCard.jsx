import React, { useState } from 'react';
import { Calendar, Clock, User, ArrowRight, Video, IndianRupee, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const WebinarCard = ({ webinar, onRegister, isRegistered = false }) => {
    const [loading, setLoading] = useState(false);

    // Helper to get webinar status
    const getWebinarStatus = () => {
        if (!webinar.date) return { label: 'No Date', color: 'bg-slate-500' };
        const now = new Date();
        const webinarDate = new Date(webinar.date);
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const wDate = new Date(webinarDate.getFullYear(), webinarDate.getMonth(), webinarDate.getDate());

        if (wDate > today) return { label: 'Upcoming', color: 'bg-blue-500' };
        if (wDate < today) return { label: 'Completed', color: 'bg-slate-500' };
        return { label: 'Live Today', color: 'bg-green-500' };
    };

    const status = getWebinarStatus();
    const isCompleted = status.label === 'Completed';

    const handleRegister = async () => {
        setLoading(true);
        await onRegister(webinar.id);
        setLoading(false);
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300"
        >
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />
                <img
                    src={webinar.image}
                    alt={webinar.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Video size={14} />
                    Webinar
                </div>
                {/* Status badge */}
                <div className={`absolute top-4 left-4 z-20 ${status.color} text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm`}>
                    {status.label}
                </div>
                {/* Paid / Free badge */}
                {webinar.isPaid ? (
                    <div className="absolute bottom-14 left-4 z-20 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                        <IndianRupee size={12} />{webinar.price}
                    </div>
                ) : (
                    <div className="absolute bottom-14 left-4 z-20 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                        FREE
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-6">
                <h3 className="text-xl font-bold font-display text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {webinar.title}
                </h3>

                <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                    <User size={16} className="text-blue-500" />
                    <span className="font-medium">{webinar.speaker}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-slate-600 text-sm bg-slate-50 p-2 rounded-lg">
                        <Calendar size={16} className="text-blue-500" />
                        <span>{webinar.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 text-sm bg-slate-50 p-2 rounded-lg">
                        <Clock size={16} className="text-blue-500" />
                        <span>{webinar.time}</span>
                    </div>
                </div>

                <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {webinar.description}
                </p>

                {/* Show meeting link if registered */}
                {isRegistered && webinar.meetingLink && (
                    <a
                        href={webinar.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center mb-3 py-2 px-4 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-colors"
                    >
                        🔗 Join Meeting
                    </a>
                )}

                <button
                    onClick={handleRegister}
                    disabled={loading || isRegistered || isCompleted}
                    className={`w-full font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${isRegistered
                            ? 'bg-emerald-50 text-emerald-600 cursor-default'
                            : isCompleted
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-slate-900 hover:bg-blue-600 text-white shadow-lg shadow-slate-900/10 hover:shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed'
                        }`}
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Registering...
                        </>
                    ) : isRegistered ? (
                        <>
                            <CheckCircle size={18} /> Registered
                        </>
                    ) : isCompleted ? (
                        "Webinar Ended"
                    ) : (
                        <>
                            Register Now <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    );
};

export default WebinarCard;
