import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, ArrowRight, Code, Cpu, Globe, Server, Cloud, Database, Zap } from 'lucide-react';
import ShinyButton from './ui/ShinyButton';

const LogoMarquee = () => {
    const logos = [
        { name: 'Google', icon: Globe },
        { name: 'Microsoft', icon: Code },
        { name: 'Amazon', icon: Cloud },
        { name: 'Tesla', icon: Zap },
        { name: 'Meta', icon: Server },
        { name: 'Netflix', icon: Database },
        { name: 'Adobe', icon: Cpu },
        { name: 'Google', icon: Globe },
        { name: 'Microsoft', icon: Code },
        { name: 'Amazon', icon: Cloud },
    ];

    return (
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-12 [&_img]:max-w-none animate-infinite-scroll">
                {logos.map((logo, index) => (
                    <li key={index} className="flex items-center gap-3 text-slate-400 font-bold text-xl uppercase tracking-wider hover:text-blue-500 transition-colors cursor-default">
                        <logo.icon size={28} className="text-slate-300" />
                        {logo.name}
                    </li>
                ))}
            </ul>
            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-12 [&_img]:max-w-none animate-infinite-scroll" aria-hidden="true">
                {logos.map((logo, index) => (
                    <li key={`duplicate-${index}`} className="flex items-center gap-3 text-slate-400 font-bold text-xl uppercase tracking-wider hover:text-blue-500 transition-colors cursor-default">
                        <logo.icon size={28} className="text-slate-300" />
                        {logo.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const Hero = () => {
    return (
        <div className="relative bg-slate-50 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-grid opacity-[0.6] pointer-events-none" />
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl pointer-events-none mix-blend-multiply animate-blob" />
            <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl pointer-events-none mix-blend-multiply animate-blob animation-delay-2000" />

            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="flex-1 text-center lg:text-left z-10"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white border border-blue-100 shadow-sm shadow-blue-500/10 text-sm font-semibold text-slate-600 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                            >
                                <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                                New Batches Starting Soon
                                <ArrowRight size={14} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
                            </motion.div>

                            <h1 className="text-5xl lg:text-7xl font-extrabold font-display tracking-tight text-slate-900 mb-8 leading-[1.1]">
                                Engineering the <br />
                                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                                    Future Workforce
                                </span>
                            </h1>
                            <p className="text-lg lg:text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                Join the elite internship program designed for the AI era.
                                Master <span className="text-slate-900 font-semibold underline decoration-blue-300 underline-offset-4 decoration-2">Data Science</span>, <span className="text-slate-900 font-semibold underline decoration-indigo-300 underline-offset-4 decoration-2">Machine Learning</span>, and <span className="text-slate-900 font-semibold underline decoration-orange-300 underline-offset-4 decoration-2">Full Stack Dev</span> with direct industry mentorship.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <ShinyButton
                                    onClick={() => document.getElementById('internships')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full sm:w-auto text-lg !py-4 !px-8 hover:-translate-y-1 shadow-xl shadow-slate-900/20"
                                    icon={ArrowRight}
                                >
                                    Explore Internships
                                </ShinyButton>
                                <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-slate-900 border border-slate-200 font-bold text-lg hover:bg-slate-50 transition-all shadow-sm hover:shadow-md hover:-translate-y-1 flex items-center justify-center gap-2">
                                    Hire Talent
                                </button>
                            </div>

                            <div className="mt-12 flex items-center justify-center lg:justify-start gap-6 pt-8 border-t border-slate-200/60">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-50 bg-slate-200 overflow-hidden shadow-sm">
                                            <img src={`https://i.pravatar.cc/100?img=${10 + i}`} alt="Student" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                    <div className="w-12 h-12 rounded-full border-4 border-slate-50 bg-white flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm">
                                        +5k
                                    </div>
                                </div>
                                <div className="text-left">
                                    <div className="flex text-amber-500 mb-1">★★★★★</div>
                                    <p className="text-sm font-semibold text-slate-600">Loved by <span className="text-slate-900">5,000+</span> students</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Hero Graphic */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="flex-1 w-full max-w-xl lg:max-w-none relative z-10"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[2.8rem] opacity-20 blur-2xl -z-10 animate-pulse" />
                            <div className="relative aspect-square md:aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/20 border text-slate-200 bg-slate-900">
                                <img
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                                    alt="Collaborative working environment"
                                    className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                                {/* Floating Badge 1 */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                    className="absolute bottom-10 left-10 right-10 md:right-auto bg-white/10 backdrop-blur-xl p-5 rounded-2xl shadow-xl border border-white/20 max-w-xs"
                                >
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                                            <Briefcase size={24} />
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-300 font-bold uppercase tracking-wider mb-1">Placement Rate</div>
                                            <div className="text-3xl font-bold text-white">94%</div>
                                        </div>
                                    </div>
                                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-blue-500 h-full w-[94%] shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                    </div>
                                </motion.div>

                                {/* Floating Badge 2 */}
                                <motion.div
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.9 }}
                                    className="absolute top-10 right-10 bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-xl shadow-black/10 border border-white/40 flex items-center gap-3 transform rotate-3 hover:rotate-0 transition-all duration-300"
                                >
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <GraduationCap size={20} />
                                    </div>
                                    <div className="text-sm font-bold text-slate-900 leading-tight">
                                        ISO Certified <br /> Excellence
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Logo Marquee Section */}
            <div className="py-12 border-y border-slate-200 bg-white/50 backdrop-blur-sm relative z-10">
                <div className="container mx-auto px-6 mb-8 text-center">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Our Graduates Work At</p>
                </div>
                <LogoMarquee />
            </div>
        </div>
    );
};

export default Hero;
