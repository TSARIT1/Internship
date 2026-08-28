import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, ArrowRight, Code, Cpu, Globe, Server, Cloud, Database, Zap, Sparkles, CheckCircle2, ShieldCheck, Download, Users, Star } from 'lucide-react';
import ShinyButton from './ui/ShinyButton';
import LeadModal from './LeadModal';

const LogoMarquee = () => {
    const hiringCompanies = [
        { name: 'Google', icon: Globe },
        { name: 'Microsoft', icon: Code },
        { name: 'Amazon AWS', icon: Cloud },
        { name: 'TCS', icon: Server },
        { name: 'Infosys', icon: Cpu },
        { name: 'Wipro', icon: Database },
        { name: 'Cognizant', icon: Zap },
        { name: 'Accenture', icon: Globe },
        { name: 'Capgemini', icon: Code },
        { name: 'IBM', icon: Server },
    ];

    return (
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-10 [&_img]:max-w-none animate-infinite-scroll">
                {hiringCompanies.map((comp, index) => (
                    <li key={index} className="flex items-center gap-2.5 text-slate-400 font-bold text-lg uppercase tracking-wider hover:text-blue-600 transition-colors cursor-default whitespace-nowrap">
                        <comp.icon size={22} className="text-slate-400" />
                        <span>{comp.name}</span>
                    </li>
                ))}
            </ul>
            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-10 [&_img]:max-w-none animate-infinite-scroll" aria-hidden="true">
                {hiringCompanies.map((comp, index) => (
                    <li key={`dup-${index}`} className="flex items-center gap-2.5 text-slate-400 font-bold text-lg uppercase tracking-wider hover:text-blue-600 transition-colors cursor-default whitespace-nowrap">
                        <comp.icon size={22} className="text-slate-400" />
                        <span>{comp.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const Hero = () => {
    const [leadModalOpen, setLeadModalOpen] = useState(false);

    return (
        <div className="relative bg-gradient-to-b from-slate-50 via-white to-slate-100 overflow-hidden font-sans">
            {/* Background Tech Mesh Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c710_1px,transparent_1px),linear-gradient(to_bottom,#0284c710_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
            <div className="absolute top-20 right-10 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl pointer-events-none mix-blend-multiply" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal-400/15 rounded-full blur-3xl pointer-events-none mix-blend-multiply" />

            <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-28 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                        {/* Text & Lead Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex-1 text-center lg:text-left z-10"
                        >
                            {/* Badges */}
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 mb-6">
                                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 shadow-xs text-xs font-extrabold text-blue-700">
                                    <Sparkles size={14} className="text-amber-500" />
                                    <span>2026 Batch Admissions Open</span>
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-extrabold text-emerald-700">
                                    <ShieldCheck size={14} />
                                    <span>100% Placement Assistance</span>
                                </span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-slate-900 mb-5 leading-[1.12]">
                                Master Real IT Skills with <br className="hidden sm:inline" />
                                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
                                    TSAR IT INTERNSHIP
                                </span>
                            </h1>

                            {/* Strong Quotation */}
                            <div className="mb-6 p-4 rounded-2xl bg-blue-50/70 border-l-4 border-blue-600 text-slate-700 text-sm sm:text-base italic font-medium leading-relaxed">
                                “Bridging the gap between academic theory and high-paying tech careers through enterprise project architectures, 1-on-1 mentorship, and corporate placement pipelines.”
                            </div>

                            <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                Accelerate your career across <strong className="text-slate-900">Data Science, AI & GenAI, Java Full Stack, MERN Stack, Cloud Computing, DevOps & Cyber Security</strong> with verified <strong className="text-slate-900">Govt. MSME credentials</strong>.
                            </p>

                            {/* Clean, Sleek Professional CTAs */}
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                                <button
                                    onClick={() => document.getElementById('internships')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/35 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <span>Explore Tech Internships</span>
                                    <ArrowRight size={16} />
                                </button>
                                
                                <button
                                    onClick={() => setLeadModalOpen(true)}
                                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-blue-600 hover:text-blue-600 font-bold text-sm shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Download size={16} />
                                    <span>Download 2026 Syllabus Pack</span>
                                </button>
                            </div>

                            {/* Trust Signals with 5 Verified Working Avatars */}
                            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-6 border-t border-slate-200/80">
                                <div className="flex -space-x-3">
                                    {[
                                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
                                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
                                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80",
                                        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80",
                                        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&h=120&q=80"
                                    ].map((url, i) => (
                                        <img
                                            key={i}
                                            src={url}
                                            alt="TSAR IT Graduate"
                                            className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-xs"
                                            loading="lazy"
                                        />
                                    ))}
                                    <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                                        +5K
                                    </div>
                                </div>
                                <div className="text-center sm:text-left">
                                    <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                                        ))}
                                        <span className="text-xs font-bold text-slate-800 ml-1.5">4.9 / 5</span>
                                    </div>
                                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                                        Trusted by <span className="text-slate-900 font-bold">5,000+ Students</span> across 80+ Engineering Colleges
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Interactive Hero Tech Graphic */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex-1 w-full max-w-lg lg:max-w-none relative z-10"
                        >
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/25 border-4 border-white bg-slate-900 group">
                                <img
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                                    alt="TSAR IT Internship Project Collaboration"
                                    className="w-full h-[380px] sm:h-[460px] object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                                {/* Floating Stat Card 1 */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="absolute bottom-6 left-6 right-6 bg-slate-900/85 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-white/20 shadow-2xl text-white"
                                >
                                    <div className="flex items-center justify-between gap-4 mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-400">
                                                <Briefcase size={20} />
                                            </div>
                                            <div>
                                                <div className="text-[11px] text-slate-300 font-bold uppercase tracking-wider">Placement Success</div>
                                                <div className="text-2xl font-black text-white">94% Placement Rate</div>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-teal-400 bg-teal-950/80 px-2.5 py-1 rounded-full border border-teal-800">
                                            ₹4.5 - ₹18 LPA
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <div className="bg-gradient-to-r from-teal-400 to-blue-500 h-full w-[94%] rounded-full shadow-[0_0_12px_rgba(20,184,166,0.8)]" />
                                    </div>
                                </motion.div>

                                {/* Floating Live Badge */}
                                <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 flex items-center gap-2 shadow-lg">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                                    <span className="text-xs font-bold text-white tracking-wide">Live Interactive Batches</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Hiring Partners Marquee */}
            <div className="py-8 border-y border-slate-200 bg-white/70 backdrop-blur-sm relative z-10">
                <div className="container mx-auto px-6 mb-4 text-center">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.25em]">
                        Our Interns & Alumni Work At Leading Companies
                    </p>
                </div>
                <LogoMarquee />
            </div>

            {/* Lead Modal */}
            <LeadModal
                isOpen={leadModalOpen}
                onClose={() => setLeadModalOpen(false)}
                title="Download 2026 Internship Curriculum Pack"
            />
        </div>
    );
};

export default Hero;
