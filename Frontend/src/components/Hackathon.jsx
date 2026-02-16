import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Trophy, MapPin, ArrowRight, Target, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getHackathons } from '../services/studentApi';
import ShinyButton from './ui/ShinyButton';

const Hackathon = () => {
    const navigate = useNavigate();
    const [upcomingHackathon, setUpcomingHackathon] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHackathon = async () => {
            try {
                const response = await getHackathons();
                if (response.success && response.data.length > 0) {
                    // Try to find the first "Upcoming" or "Open" hackathon
                    // We avoid complex date sorting if the date format is free text (e.g. "March 15-16").
                    // Instead, we trust the backend order or just pick the first matching status.
                    const upcoming = response.data.find(h => h.status === 'Upcoming' || h.status === 'Open');

                    if (upcoming) {
                        setUpcomingHackathon(upcoming);
                    } else {
                        // Fallback to the latest one (assuming last in list is latest added)
                        setUpcomingHackathon(response.data[response.data.length - 1]);
                    }
                } else {
                    // No hackathons at all? Ensure we don't crash, but maybe set a default Placeholder for dev?
                    // Or just leave null to hide section.
                    // User said "nothing show", maybe they want to see the section.
                    // Let's set a dummy one if empty so they see *something* during dev?
                    // No, better to debug. If empty, it returns null.
                    // I will confirm if they have data. Backend said yes.
                }
            } catch (error) {
                console.error("Failed to fetch hackathon data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHackathon();
    }, []);

    const features = [
        {
            icon: Trophy,
            title: `Prize Pool: ${upcomingHackathon?.prizePool || "Exciting Prizes"}`,
            desc: "Cash prizes, internships, and exclusive swag for top performers.",
            color: "text-amber-400",
            bg: "bg-amber-400/10",
            border: "border-amber-400/20"
        },
        {
            icon: Users,
            title: "Team Participation",
            desc: "Form teams of 2-4 members and collaborate to build innovative solutions.",
            color: "text-blue-400",
            bg: "bg-blue-400/10",
            border: "border-blue-400/20"
        },
        {
            icon: Target,
            title: "Real-World Problems",
            desc: "Solve actual industry challenges provided by our hiring partners.",
            color: "text-purple-400",
            bg: "bg-purple-400/10",
            border: "border-purple-400/20"
        },
        {
            icon: Zap,
            title: "Evaluation Mode",
            desc: `${upcomingHackathon?.mode || "Online"} event with live mentoring and judging.`,
            color: "text-emerald-400",
            bg: "bg-emerald-400/10",
            border: "border-emerald-400/20"
        }
    ];

    if (loading) return null; // Or a skeleton loader
    if (!upcomingHackathon) return null; // Don't show section if no hackathon

    return (
        <section id="hackathon" className="relative py-24 bg-slate-900 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
                <div className="absolute -bottom-[20%] left-[20%] w-[40%] h-[40%] bg-amber-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Content Side */}
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-block py-1 px-3 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-semibold mb-6">
                                🚀 Upcoming Event
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-6 leading-tight">
                                {upcomingHackathon.title}
                            </h2>
                            <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                                {upcomingHackathon.description}
                            </p>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10">
                                <div className="flex items-center gap-2 text-slate-300 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700">
                                    <Calendar size={18} className="text-blue-400" />
                                    <span className="font-semibold">{upcomingHackathon.date}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-300 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700">
                                    <Clock size={18} className="text-amber-400" />
                                    <span className="font-semibold">{upcomingHackathon.time}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-300 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700">
                                    <MapPin size={18} className="text-emerald-400" />
                                    <span className="font-semibold">{upcomingHackathon.mode}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-300 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700">
                                    <Users size={18} className="text-pink-400" />
                                    <span className="font-semibold">{upcomingHackathon.participantCount || 0} Joined</span>
                                </div>
                                <div className="flex items-center gap-2 text-emerald-300 bg-emerald-900/20 px-4 py-2 rounded-lg border border-emerald-500/30">
                                    <span className="font-bold">Entry: {upcomingHackathon.entryFee ? `₹${upcomingHackathon.entryFee}` : 'Free'}</span>
                                </div>
                            </div>

                            <ShinyButton
                                onClick={() => navigate(`/hackathon/${upcomingHackathon.id}`)}
                                className="!bg-purple-600 !from-purple-500 !to-purple-700 !shadow-purple-500/25"
                                icon={ArrowRight}
                            >
                                View Details & Register
                            </ShinyButton>
                        </motion.div>
                    </div>

                    {/* Features Grid Side */}
                    <div className="flex-1 w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className={`p-6 rounded-2xl bg-slate-800/40 backdrop-blur-sm border ${feature.border} hover:bg-slate-800/60 transition-all group`}
                                >
                                    <div className={`w-12 h-12 rounded-lg ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <feature.icon className={feature.color} size={24} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                    <p className="text-sm text-slate-400">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Floating "Live" Badge */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="hidden md:flex absolute -right-4 -bottom-4 bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-xl items-center gap-3 z-20"
                        >
                            <div className="flex -space-x-3">
                                <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-xs text-white font-bold">+</div>
                            </div>
                            <div className="text-xs font-bold text-white">
                                <span className="text-green-400">●</span> {upcomingHackathon.status}
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hackathon;
