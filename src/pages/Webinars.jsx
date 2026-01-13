import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WebinarCard from '../components/WebinarCard';
import { getWebinars, registerForWebinar } from '../services/webinarApi';
import { motion } from 'framer-motion';
import { Search, MonitorPlay } from 'lucide-react';

const Webinars = () => {
    const [webinars, setWebinars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchWebinars();
    }, []);

    const fetchWebinars = async () => {
        try {
            const response = await getWebinars();
            setWebinars(response.data);
        } catch (error) {
            console.error("Error fetching webinars:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (id) => {
        try {
            const response = await registerForWebinar(id, { studentId: 101 }); // Mock student ID
            if (response.data.success) {
                alert("Successfully registered for the webinar! details sent to email.");
            }
        } catch (error) {
            console.error("Registration failed:", error);
            alert("Failed to register. Please try again.");
        }
    };

    const filteredWebinars = webinars.filter(webinar =>
        webinar.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        webinar.speaker.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
            <Header />

            {/* Hero Section */}
            <div className="pt-32 pb-20 bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/50 border border-blue-800 text-blue-300 font-bold text-xs uppercase tracking-wider mb-6 backdrop-blur-md">
                            <MonitorPlay size={16} />
                            <span>Live Learning Series</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 font-display tracking-tight">
                            Unlock Your Potential with <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                                Expert-Led Webinars
                            </span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Join industry leaders and tech experts for interactive sessions on the latest technologies, career growth, and real-world projects.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-xl mx-auto relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search webinars by title or speaker..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/10 backdrop-blur-md border border-slate-700 text-white pl-12 pr-6 py-4 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white/20 transition-all placeholder:text-slate-500"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Webinars Grid */}
            <div id="webinar" className="container mx-auto px-6 py-20 flex-grow">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                    </div>
                ) : filteredWebinars.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredWebinars.map((webinar) => (
                            <WebinarCard
                                key={webinar.id}
                                webinar={webinar}
                                onRegister={handleRegister}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">No webinars found</h3>
                        <p className="text-slate-500">Try adjusting your search terms.</p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Webinars;
