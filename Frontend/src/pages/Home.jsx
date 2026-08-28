import React, { useState } from 'react';
import ScrollButtons from '../components/ScrollButtons';
import Header from '../components/Header';
import Hero from '../components/Hero';
import InternshipCards from '../components/InternshipCards';
import Testimonials from '../components/Testimonials';
import Advantage from '../components/Advantage';
import Technologies from '../components/Technologies';
import Footer from '../components/Footer';
import VideoTestimonials from '../components/VideoTestimonials';
import Hackathon from '../components/Hackathon';
import AIChatWidget from '../components/AIChatWidget';
import WhatsAppButton from '../components/WhatsAppButton';
import LeadModal from '../components/LeadModal';
import SEO from '../components/SEO';
import { Play, Sparkles, Award, Users, BookOpen, CheckCircle, ArrowRight, Download, Phone } from 'lucide-react';
import ShinyButton from '../components/ui/ShinyButton';

const Home = () => {
    const [leadModalOpen, setLeadModalOpen] = useState(false);
    const [videoModalOpen, setVideoModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900 font-sans">
            <SEO
                title="TSAR IT INTERNSHIP - Premier Online IT Training & Placement Programs"
                description="Join TSAR IT INTERNSHIP for online certified training in Data Science, AI & Generative AI, Java Full Stack, MERN, AWS Cloud, DevOps, and Cyber Security with 100% placement support and Govt. MSME credentials."
                keywords="TSAR IT, IT Internship 2026, Online Tech Courses, Data Science Certification, AI Internship, Java Full Stack Training, DevOps Kubernetes, AWS Solutions Architect, Placement Assistance"
                canonicalUrl="https://tsaritservices.com/"
            />
            <Header />

            <main>
                {/* 1. Hero Section */}
                <Hero />

                {/* 2. Key Advantages & Stats */}
                <Advantage />

                {/* 3. All 9 Tech Internship Programs Grid */}
                <InternshipCards />

                {/* 4. Interactive Live Demo Class & Campus Tour Banner (Clean Light Styling) */}
                <section className="py-16 bg-white border-y border-slate-200 relative overflow-hidden">
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50 rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm flex flex-col lg:flex-row items-center gap-10">
                            {/* Left Content */}
                            <div className="flex-1 space-y-5 text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
                                    <Sparkles size={14} className="text-amber-500" />
                                    <span>Watch Live Class Experience</span>
                                </div>
                                <h2 className="text-3xl sm:text-4xl font-black font-display text-slate-900 tracking-tight leading-tight">
                                    Experience TSAR IT's Practical <br className="hidden sm:inline" />
                                    <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
                                        Live Code-Along Learning
                                    </span>
                                </h2>
                                <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
                                    See how our senior tech architects teach real-time debugging, full-stack deployment, AI model optimization, and AWS infrastructure configuration.
                                </p>
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                                    <button
                                        onClick={() => setVideoModalOpen(true)}
                                        className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-sm flex items-center gap-2 shadow-md shadow-blue-600/20 hover:scale-105 transition-all cursor-pointer"
                                    >
                                        <Play size={16} className="fill-white" />
                                        <span>Watch Class Preview</span>
                                    </button>
                                    <button
                                        onClick={() => setLeadModalOpen(true)}
                                        className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-full font-bold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                                    >
                                        <Download size={16} />
                                        <span>Download Curriculum Pack</span>
                                    </button>
                                </div>
                            </div>

                            {/* Right Video Thumbnail / Player */}
                            <div className="flex-1 w-full max-w-md lg:max-w-none">
                                <div
                                    onClick={() => setVideoModalOpen(true)}
                                    className="relative rounded-3xl overflow-hidden shadow-lg border-4 border-white group cursor-pointer aspect-video bg-slate-900"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
                                        alt="Class Demo Video"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                                    />
                                    <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/15 transition-colors flex items-center justify-center">
                                        <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/40 group-hover:scale-110 transition-transform">
                                            <Play size={28} className="fill-white ml-1" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-white/10 text-xs flex items-center justify-between text-white">
                                        <span className="font-bold">Full Stack & AI Live Session Demo</span>
                                        <span className="text-teal-400 font-semibold">HD 1080p</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. Video Student Testimonials */}
                <VideoTestimonials />

                {/* 6. Hackathons & Coding Competitions */}
                <Hackathon />

                {/* 7. Written Testimonials & Reviews */}
                <Testimonials />

                {/* 8. Technologies Stack Logos */}
                <Technologies />

                {/* 9. High-Impact Lead Generation Banner (Clean Light/Blue Gradient) */}
                <section className="py-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 text-white relative overflow-hidden">
                    <div className="container mx-auto px-6 text-center max-w-4xl relative z-10 space-y-5">
                        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold uppercase tracking-widest text-white">
                            <Sparkles size={14} className="text-amber-300" />
                            <span>Early-Bird Scholarship Discount</span>
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight leading-tight">
                            Ready to Launch Your IT Career in 2026?
                        </h2>
                        <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                            Join 5,000+ ambitious interns building production applications with TSAR IT INTERNSHIP. Book your free counseling session today.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                            <button
                                onClick={() => setLeadModalOpen(true)}
                                className="w-full sm:w-auto px-8 py-4 bg-white text-blue-700 hover:bg-blue-50 font-extrabold text-sm uppercase tracking-wider rounded-full shadow-xl hover:scale-105 transition-all cursor-pointer"
                            >
                                Book Free 1-on-1 Counseling
                            </button>
                            <div className="flex flex-wrap gap-2 justify-center">
                                <a
                                    href="tel:+919491301258"
                                    className="px-6 py-4 bg-slate-900/50 hover:bg-slate-900/70 border border-white/30 text-white font-bold text-xs sm:text-sm rounded-full flex items-center justify-center gap-2 transition-all"
                                >
                                    <Phone size={15} />
                                    <span>Call: +91 9491301258</span>
                                </a>
                                <a
                                    href="tel:+918142616767"
                                    className="px-6 py-4 bg-slate-900/50 hover:bg-slate-900/70 border border-white/30 text-white font-bold text-xs sm:text-sm rounded-full flex items-center justify-center gap-2 transition-all"
                                >
                                    <Phone size={15} />
                                    <span>Call: +91 8142616767</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
            <ScrollButtons />
            <AIChatWidget />
            <WhatsAppButton />

            {/* Universal Lead Modal */}
            <LeadModal
                isOpen={leadModalOpen}
                onClose={() => setLeadModalOpen(false)}
                title="Book Free Career Counseling & Syllabus"
            />

            {/* Video Demo Modal */}
            {videoModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
                    <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                        <button
                            onClick={() => setVideoModalOpen(false)}
                            className="absolute top-4 right-4 z-10 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
                            aria-label="Close video"
                        >
                            ✕
                        </button>
                        <div className="aspect-video w-full">
                            <iframe
                                className="w-full h-full"
                                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                                title="TSAR IT Class Preview"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
