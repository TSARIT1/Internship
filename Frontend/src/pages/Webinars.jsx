import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WebinarCard from '../components/WebinarCard';
import { getWebinars, registerForWebinar, getMyWebinarRegistrations, guestRegisterForWebinar } from '../services/webinarApi';
import { motion } from 'framer-motion';
import { Search, MonitorPlay, Sparkles, Video, Calendar, Users, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WhatsAppButton from '../components/WhatsAppButton';
import AIChatWidget from '../components/AIChatWidget';
import ScrollButtons from '../components/ScrollButtons';
import SEO from '../components/SEO';

const Webinars = () => {
    const [webinars, setWebinars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [registeredIds, setRegisteredIds] = useState([]);
    const navigate = useNavigate();

    const student = JSON.parse(sessionStorage.getItem('student') || 'null');
    const isGuest = !student || !student.id;

    useEffect(() => {
        fetchWebinars();
    }, []);

    const fetchWebinars = async () => {
        try {
            const userId = student?.id;

            const [webinarsRes, registrationsRes] = await Promise.all([
                getWebinars(userId),
                userId ? getMyWebinarRegistrations(userId) : Promise.resolve({ data: [] })
            ]);

            setWebinars(webinarsRes.data || []);

            const serverIds = registrationsRes.data || [];
            const guestIds = JSON.parse(localStorage.getItem('guestWebinarRegistrations') || '[]');
            const mergedIds = [...new Set([...serverIds, ...guestIds])];
            setRegisteredIds(mergedIds);
        } catch (error) {
            console.error("Error fetching webinars:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (id) => {
        try {
            const response = await registerForWebinar(id, student.id);
            if (response.data.success) {
                setRegisteredIds(prev => [...prev, id]);
                alert("Successfully registered for the webinar! 🎉");
            }
        } catch (error) {
            console.error("Registration failed:", error);
            const message = error.response?.data?.error || "Failed to register. Please try again.";
            alert(message);
        }
    };

    const handleGuestRegister = async (webinarId, name, email) => {
        try {
            const response = await guestRegisterForWebinar(webinarId, name, email);
            if (response.data.success) {
                const existing = JSON.parse(localStorage.getItem('guestWebinarRegistrations') || '[]');
                const updated = [...new Set([...existing, webinarId])];
                localStorage.setItem('guestWebinarRegistrations', JSON.stringify(updated));

                setRegisteredIds(prev => [...prev, webinarId]);
                alert("Successfully registered for the webinar! 🎉 Check your email for details.");
            }
        } catch (error) {
            console.error("Guest registration failed:", error);
            const message = error.response?.data?.error || "Failed to register. Please try again.";
            alert(message);
            throw error;
        }
    };

    const filteredWebinars = webinars.filter(webinar =>
        webinar.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        webinar.speaker?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col font-sans selection:bg-blue-100">
            <SEO
                title="Live Tech Masterclasses & Free Webinars"
                description="Attend interactive live masterclasses on AI, Full Stack, Cloud, DevOps, and Cyber Security led by senior software architects at TSAR IT."
                keywords="Free IT Webinars, Online Tech Masterclasses, AI Webinar, Cloud DevOps Workshop, Live Coding Sessions"
                canonicalUrl="https://tsaritservices.com/webinars"
            />
            <Header />

            {/* Bright, Modern Hero Section */}
            <div className="pt-32 pb-16 bg-gradient-to-b from-white via-blue-50/40 to-slate-50 border-b border-slate-200/80 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c70a_1px,transparent_1px),linear-gradient(to_bottom,#0284c70a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-extrabold text-xs uppercase tracking-wider mb-5">
                            <MonitorPlay size={15} />
                            <span>TSAR IT Live Masterclass Series</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-5 font-display tracking-tight leading-tight">
                            Interactive Tech Webinars & <br />
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
                                Live Masterclasses
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
                            Join senior software architects and industry leaders for interactive technical deep-dives into AI, Cloud Computing, Full Stack Development, and Cyber Security.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-xl mx-auto relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search webinars by topic, technology, or speaker..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white shadow-md border border-slate-200 text-slate-900 pl-11 pr-5 py-3.5 rounded-2xl focus:outline-none focus:border-blue-600 transition-all placeholder:text-slate-400 text-sm font-medium"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Webinars Grid */}
            <div id="webinar" className="container mx-auto px-6 py-16 flex-grow">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
                    </div>
                ) : filteredWebinars.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredWebinars.map((webinar) => (
                            <WebinarCard
                                key={webinar.id}
                                webinar={webinar}
                                onRegister={handleRegister}
                                onGuestRegister={handleGuestRegister}
                                isRegistered={registeredIds.includes(webinar.id)}
                                isGuest={isGuest}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto shadow-sm">
                        <Video size={40} className="text-slate-300 mx-auto mb-3" />
                        <h3 className="text-xl font-bold text-slate-900 mb-1">No webinars found</h3>
                        <p className="text-slate-500 text-xs">Try adjusting your search terms or check back for upcoming scheduled sessions.</p>
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

export default Webinars;
