import React, { useState } from 'react';
import { Calendar, Clock, User, ArrowRight, Video, IndianRupee, CheckCircle, Mail, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Format time from 'HH:mm:ss' or 'HH:mm' → '12:30 PM'
const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    let h = parseInt(parts[0], 10);
    const m = parts[1] || '00';
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
};

// Banner image with gradient fallback
const SmartBannerImage = ({ src, title }) => {
    const [error, setError] = useState(false);
    const isValidUrl = src && src.startsWith('http');
    if (!isValidUrl || error) {
        return (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex flex-col items-center justify-center">
                <Video size={48} className="text-white/40 mb-2" />
                <span className="text-white/70 text-sm font-semibold text-center px-4 line-clamp-2">{title}</span>
            </div>
        );
    }
    return (
        <img src={src} alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setError(true)} />
    );
};

const WebinarCard = ({ webinar, onRegister, onGuestRegister, isRegistered = false, isGuest = false }) => {
    const [loading, setLoading] = useState(false);
    const [showGuestForm, setShowGuestForm] = useState(false);
    const [guestName, setGuestName] = useState('');
    const [guestEmail, setGuestEmail] = useState('');

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
        if (isGuest) {
            setShowGuestForm(true);
            return;
        }
        setLoading(true);
        await onRegister(webinar.id);
        setLoading(false);
    };

    const handleGuestSubmit = async (e) => {
        e.preventDefault();
        if (!guestName.trim() || !guestEmail.trim()) return;
        setLoading(true);
        try {
            await onGuestRegister(webinar.id, guestName.trim(), guestEmail.trim());
            setShowGuestForm(false);
            setGuestName('');
            setGuestEmail('');
        } catch (err) {
            // error is handled by the parent
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300"
        >
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />
                <SmartBannerImage src={webinar.image} title={webinar.title} />
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
                        <span>{formatTime(webinar.time)}</span>
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

                {/* Guest Registration Form */}
                <AnimatePresence>
                    {showGuestForm && !isRegistered && !isCompleted && (
                        <motion.form
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            onSubmit={handleGuestSubmit}
                            className="mb-4 overflow-hidden"
                        >
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-semibold text-blue-800">Register for this Webinar</p>
                                    <button
                                        type="button"
                                        onClick={() => setShowGuestForm(false)}
                                        className="text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="relative">
                                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        value={guestName}
                                        onChange={(e) => setGuestName(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    />
                                </div>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        value={guestEmail}
                                        onChange={(e) => setGuestEmail(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading || !guestName.trim() || !guestEmail.trim()}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Registering...
                                        </>
                                    ) : (
                                        <>
                                            Confirm Registration <ArrowRight size={16} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>

                {/* Main Register Button */}
                {!showGuestForm && (
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
                )}
            </div>
        </motion.div>
    );
};

export default WebinarCard;
