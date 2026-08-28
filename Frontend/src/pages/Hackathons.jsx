import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HackathonCard from '../components/HackathonCard';
import { getHackathons } from '../services/studentApi';
import { motion } from 'framer-motion';
import { Search, Trophy, Sparkles, Award, Code2, Users } from 'lucide-react';
import WhatsAppButton from '../components/WhatsAppButton';
import AIChatWidget from '../components/AIChatWidget';
import ScrollButtons from '../components/ScrollButtons';
import SEO from '../components/SEO';

const Hackathons = () => {
    const [hackathons, setHackathons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchHackathons();
    }, []);

    const fetchHackathons = async () => {
        try {
            const response = await getHackathons();
            if (response.success) {
                setHackathons(response.data || []);
            }
        } catch (error) {
            console.error("Error fetching hackathons:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredHackathons = hackathons.filter(hackathon =>
        hackathon.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col font-sans selection:bg-teal-100">
            <SEO
                title="Online Coding Hackathons & National Challenges"
                description="Compete in real-world software engineering hackathons, solve algorithmic challenges, win cash prizes, and get noticed by top hiring tech companies."
                keywords="Online Hackathons 2026, Coding Competition, Software Engineering Challenges, Tech Prizes, Student Hackathons"
                canonicalUrl="https://tsaritservices.com/hackathons"
            />
            <Header />

            {/* Bright, Modern Hero Section */}
            <div className="pt-32 pb-16 bg-gradient-to-b from-white via-teal-50/40 to-slate-50 border-b border-slate-200/80 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0d94880a_1px,transparent_1px),linear-gradient(to_bottom,#0d94880a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 font-extrabold text-xs uppercase tracking-wider mb-5">
                            <Trophy size={15} />
                            <span>TSAR IT National Hackathon Arena</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-5 font-display tracking-tight leading-tight">
                            Build, Compete & Win with <br />
                            <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-blue-600 bg-clip-text text-transparent">
                                Live Coding Hackathons
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
                            Challenge yourself with real-world engineering problem statements, build production prototypes, get evaluated by senior tech architects, and win prizes & job offers.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-xl mx-auto relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search hackathons by domain or title..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white shadow-md border border-slate-200 text-slate-900 pl-11 pr-5 py-3.5 rounded-2xl focus:outline-none focus:border-teal-600 transition-all placeholder:text-slate-400 text-sm font-medium"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Hackathons Grid */}
            <div className="container mx-auto px-6 py-16 flex-grow">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-200 border-t-teal-600"></div>
                    </div>
                ) : filteredHackathons.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredHackathons.map((hackathon) => (
                            <HackathonCard
                                key={hackathon.id}
                                hackathon={hackathon}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto shadow-sm">
                        <Trophy size={40} className="text-slate-300 mx-auto mb-3" />
                        <h3 className="text-xl font-bold text-slate-900 mb-1">No active hackathons found</h3>
                        <p className="text-slate-500 text-xs">New hackathons for the 2026 season are being scheduled. Check back soon!</p>
                    </div>
                )}
            </div>

            <Footer />
            <WhatsAppButton />
            <AIChatWidget />
            <ScrollButtons />
        </div>
    );
};

export default Hackathons;
