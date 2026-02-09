
import React, { useEffect, useState } from 'react';
import { getHackathons } from '../../services/studentApi';
import { Calendar, Clock, Award, Trophy, ArrowRight, CheckCircle } from 'lucide-react';

const StudentHackathons = () => {
    const [hackathons, setHackathons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHackathons();
    }, []);

    const loadHackathons = async () => {
        try {
            const response = await getHackathons();
            if (response.success) {
                setHackathons(response.data || []);
            }
        } catch (error) {
            console.error("Failed to load hackathons", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = (hackathon) => {
        // Mock Registration Logic
        alert(`Successfully registered for ${hackathon.title}!`);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                    <Trophy className="text-emerald-600" size={32} />
                    Upcoming Hackathons
                </h1>
                <p className="text-slate-500 mt-2">Challenge yourself, build innovative projects, and win exciting prizes.</p>
            </div>

            {loading ? (
                <div className="text-center py-12 text-slate-500">Loading hackathons...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hackathons.length > 0 ? (
                        hackathons.map((hackathon) => (
                            <div key={hackathon.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all group hover:border-emerald-200">
                                <div className="h-4 p-6 bg-gradient-to-r from-emerald-500 to-teal-600 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                                        <Trophy size={100} />
                                    </div>
                                </div>
                                <div className="p-6 pt-8 relative">
                                    <div className="absolute -top-6 left-6 w-12 h-12 bg-white rounded-xl shadow-md flex items-center justify-center text-emerald-600 border border-slate-50">
                                        <Trophy size={24} />
                                    </div>

                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">{hackathon.title}</h3>
                                        <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200 whitespace-nowrap ml-2">
                                            {hackathon.status}
                                        </span>
                                    </div>

                                    <p className="text-slate-500 text-sm mb-6 line-clamp-3">
                                        {hackathon.description}
                                    </p>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <Calendar size={16} className="text-blue-500" />
                                            <span className="font-medium">{hackathon.date}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <Clock size={16} className="text-purple-500" />
                                            <span>{hackathon.time}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <Award size={16} className="text-amber-500" />
                                            <span className="font-bold text-slate-900">Prize: {hackathon.prizePool}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleRegister(hackathon)}
                                        className="w-full py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                                    >
                                        Register Now <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400">
                            <Trophy size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No upcoming hackathons at the moment.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentHackathons;
