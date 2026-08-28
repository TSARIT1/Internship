import React from 'react';
import { Calendar, Clock, Trophy, ArrowRight, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HackathonCard = ({ hackathon }) => {
    const navigate = useNavigate();

    const getStatus = () => {
        if (!hackathon.date) return { label: 'No Date', color: 'bg-slate-500' };

        // This is a naive implementation. A robust one would parse dates properly.
        // Given the data "March 15-16", we'll rely on the backend status.
        switch (hackathon.status) {
            case 'Upcoming':
                return { label: 'Upcoming', color: 'bg-blue-500' };
            case 'Open':
                return { label: 'Open for Registration', color: 'bg-green-500' };
            case 'In Progress':
                return { label: 'Live Now', color: 'bg-red-500' };
            case 'Completed':
                return { label: 'Completed', color: 'bg-slate-500' };
            default:
                return { label: 'Event', color: 'bg-slate-500' };
        }
    };

    const status = getStatus();
    const isCompleted = status.label === 'Completed';

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300"
        >
            <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10" />
                <img
                    src={hackathon.image || 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80'}
                    alt={hackathon.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className={`absolute top-4 left-4 z-20 ${status.color} text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm`}>
                    {status.label}
                </div>
                <div className="absolute top-4 right-4 z-20 bg-slate-900/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                    <Zap size={14} />
                    {hackathon.mode || 'Online'}
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold font-display text-slate-900 mb-3 group-hover:text-teal-600 transition-colors line-clamp-2">
                    {hackathon.title}
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-slate-600 text-sm bg-slate-50 p-2 rounded-lg">
                        <Calendar size={16} className="text-teal-500" />
                        <span>{hackathon.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 text-sm bg-slate-50 p-2 rounded-lg">
                        <Clock size={16} className="text-teal-500" />
                        <span>{hackathon.time}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                    <Trophy size={16} className="text-amber-500" />
                    <span className="font-medium">Prize Pool: {hackathon.prizePool}</span>
                </div>
                
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                    <Users size={16} className="text-cyan-500" />
                    <span className="font-medium">{hackathon.participantCount || 0} participants registered</span>
                </div>

                <div className="mt-auto">
                    <button
                        onClick={() => navigate(`/hackathon/${hackathon.id}`)}
                        disabled={isCompleted}
                        className={`w-full font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                            isCompleted
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-slate-900 hover:bg-teal-600 text-white shadow-lg shadow-slate-900/10 hover:shadow-teal-600/20'
                        }`}
                    >
                        {isCompleted ? 'View Results' : 'View Details'}
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default HackathonCard;
