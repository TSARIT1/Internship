import React from 'react';
import { ArrowRight, Play, Briefcase, GraduationCap, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-32 overflow-hidden bg-white">
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-left"
                    >
                        <h1 className="text-5xl lg:text-7xl font-bold font-display tracking-tight text-slate-900 mb-6 leading-[1.1]">
                            Build Your Future with <br />
                            <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">Smart Internships</span>
                        </h1>
                        <p className="text-lg text-slate-600 max-w-lg mb-8 leading-relaxed">
                            Practical learning, expert guidance, and career-focused training.
                            The only platform that guarantees real-world work experience.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-orange-500/30 hover:-translate-y-1 flex items-center gap-2">
                                <Briefcase size={20} /> Companies: Hire
                            </button>
                            <button className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:border-blue-500 hover:text-blue-600 shadow-sm hover:shadow-md flex items-center gap-2">
                                <GraduationCap size={20} /> Students: Apply
                            </button>
                        </div>
                        <div className="mt-6">
                            <button className="bg-gradient-to-r from-blue-600 to-teal-500 hover:opacity-90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-blue-500/30 w-full sm:w-auto flex items-center justify-center gap-2 hover:-translate-y-1">
                                <Users size={20} /> Interns: Apply
                            </button>
                        </div>
                    </motion.div>

                    {/* Right Image/Graphic area */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Abstract Background Shapes mimicking the reference */}
                        <div className="absolute top-0 right-0 w-[120%] h-[120%] bg-teal-50 rounded-full blur-3xl -z-10 translate-x-1/4 -translate-y-1/4"></div>

                        {/* Main Circular Graphic */}
                        <div className="relative z-10">
                            <div className="relative rounded-full overflow-hidden border-8 border-white shadow-2xl bg-teal-600 aspect-square max-w-md mx-auto">
                                {/* Placeholder for student image - using a gradient/abstract fallback if no image provided yet, but structure is ready for img tag */}
                                <img
                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="Student learning"
                                    className="w-full h-full object-cover"
                                />

                                {/* Overlay shapes from reference */}
                                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-teal-900/50 to-transparent"></div>
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl animate-bounce duration-[3000ms]">
                                <div className="flex items-center gap-3">
                                    <div className="bg-orange-100 p-2 rounded-lg">
                                        <Briefcase className="text-orange-600" size={24} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">95%</div>
                                        <div className="text-xs text-slate-500">Hiring Rate</div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute top-10 -right-4 bg-white p-4 rounded-xl shadow-xl animate-pulse">
                                <div className="flex items-center gap-3">
                                    <div className="bg-teal-100 p-2 rounded-lg">
                                        <Users className="text-teal-600" size={24} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">5000+</div>
                                        <div className="text-xs text-slate-500">Active Interns</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Circles */}
                        <div className="absolute top-1/2 right-0 w-64 h-64 border-2 border-orange-300 rounded-full -z-10 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    </motion.div>

                </div>
            </div>

            {/* Wave Separator at bottom */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
                <svg className="relative block w-[calc(100%+1.3px)] h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-slate-900"></path>
                </svg>
            </div>
        </section>
    );
};

export default Hero;
