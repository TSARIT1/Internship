import React, { useEffect, useState } from 'react';
import { getHackathons, registerForHackathon } from '../../services/studentApi';
import { Calendar, Clock, Award, Trophy, ArrowRight, CheckCircle, Search, Filter, Sparkles, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const StudentHackathons = () => {
    const navigate = useNavigate();
    const [hackathons, setHackathons] = useState([]);
    const [filteredHackathons, setFilteredHackathons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All'); // All, Live, Upcoming, Completed

    useEffect(() => {
        loadHackathons();
    }, []);

    const getHackathonStatus = (hackathon) => {
        if (!hackathon.date) return 'Upcoming';

        try {
            // Parse "YYYY-MM-DD" and "HH:mm"
            const dateParts = hackathon.date.split('-');
            const timeParts = hackathon.time ? hackathon.time.split(':') : ['00', '00'];

            if (dateParts.length === 3) {
                const eventDate = new Date(
                    parseInt(dateParts[0]),
                    parseInt(dateParts[1]) - 1,
                    parseInt(dateParts[2]),
                    parseInt(timeParts[0]),
                    parseInt(timeParts[1])
                );

                const now = new Date();
                const diffTime = eventDate - now;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays < 0) return 'Completed';
                if (diffDays === 0 || (diffDays === 1 && diffTime < 0)) return 'Live'; // Simple logic: Same day is Live
                return 'Upcoming';
            }
        } catch (e) {
            console.error("Date parse error", e);
        }
        return hackathon.status || 'Upcoming';
    };

    const loadHackathons = async () => {
        try {
            const response = await getHackathons();
            if (response.success) {
                const dataWithStatus = (response.data || []).map(h => ({
                    ...h,
                    derivedStatus: getHackathonStatus(h)
                }));
                setHackathons(dataWithStatus);
                setFilteredHackathons(dataWithStatus);
            }
        } catch (error) {
            console.error("Failed to load hackathons", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (filter === 'All') {
            setFilteredHackathons(hackathons);
        } else {
            setFilteredHackathons(hackathons.filter(h => h.derivedStatus === filter));
        }
    }, [filter, hackathons]);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Live': return 'bg-green-500/20 text-green-400 border-green-500/50';
            case 'Upcoming': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
            case 'Completed': return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* Hero Section */}
            <div className="relative bg-[#0F172A] text-white overflow-hidden rounded-3xl mb-12 mx-4 mt-4 lg:mx-0">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-blue-900/20 to-slate-900/50"></div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10 p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-purple-400 font-bold mb-4 bg-purple-500/10 w-fit px-4 py-1 rounded-full border border-purple-500/20"
                        >
                            <Sparkles size={16} />
                            <span>Innovate. Build. Win.</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-black mb-6 leading-tight font-display"
                        >
                            Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Hackathon</span> <br />
                            Arena
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-slate-300 mb-8 leading-relaxed max-w-xl"
                        >
                            Join the world's most exciting coding challenges. Compete with top developers, showcase your skills, and win prestigious awards.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="relative hidden md:block"
                    >
                        <div className="w-64 h-64 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-2xl rotate-6 opacity-50 blur-xl absolute inset-0"></div>
                        <div className="w-64 h-64 bg-slate-800 rounded-2xl border border-white/10 relative z-10 flex items-center justify-center shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                            <Trophy size={80} className="text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Filters */}
            <div className="px-4 lg:px-0 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                    {['All', 'Live', 'Upcoming', 'Completed'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${filter === f
                                ? 'bg-slate-900 text-white shadow-md'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="text-slate-500 font-medium">
                    Showing {filteredHackathons.length} Events
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400/50">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-purple-600 mb-4"></div>
                    <p>Loading events...</p>
                </div>
            ) : (
                <AnimatePresence>
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 lg:px-0"
                    >
                        {filteredHackathons.map((hackathon) => (
                            <motion.div
                                key={hackathon.id}
                                variants={item}
                                layout
                                className="group bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300 relative"
                            >
                                {/* Card Header / Gradient */}
                                <div className="h-32 bg-slate-900 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 opacity-90"></div>
                                    <div className="absolute -right-4 -top-8 text-white/5 transform rotate-12">
                                        <Trophy size={150} />
                                    </div>

                                    <div className="absolute top-4 left-4 z-10">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${getStatusColor(hackathon.derivedStatus)}`}>
                                            {hackathon.derivedStatus}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 relative">
                                    {/* Icon Badge */}
                                    <div className="absolute -top-10 left-6 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center border-2 border-slate-50 z-20 group-hover:scale-110 transition-transform">
                                        {hackathon.derivedStatus === 'Live' ?
                                            <Zap size={32} className="text-amber-500 fill-amber-500" /> :
                                            <Trophy size={32} className="text-purple-600" />
                                        }
                                    </div>

                                    <div className="pt-6 mb-4">
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-purple-600 transition-colors">
                                            {hackathon.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                                            {hackathon.description}
                                        </p>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Prize Pool</p>
                                            <p className="font-bold text-purple-600">{hackathon.prizePool}</p>
                                        </div>
                                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Date</p>
                                            <div className="flex items-center gap-1.5 font-bold text-slate-700">
                                                <Calendar size={14} className="text-blue-500" />
                                                <span className="text-sm">{hackathon.date}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm text-slate-500 px-1">
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-slate-400" />
                                                <span>{hackathon.time}</span>
                                            </div>
                                            <div className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-xs">
                                                {hackathon.entryFee ? `₹${hackathon.entryFee}` : 'Free Entry'}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => navigate(`/hackathon/${hackathon.id}`)}
                                            className="w-full py-4 rounded-xl font-bold bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:bg-purple-600 hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2 group-hover:gap-4 mt-2"
                                        >
                                            View Details <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            )}

            {!loading && filteredHackathons.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                    <div className="inline-flex p-4 bg-slate-50 rounded-full mb-4">
                        <Filter size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No hackathons found</h3>
                    <p className="text-slate-500">Try changing your filters.</p>
                </div>
            )}
        </div>
    );
};

export default StudentHackathons;
