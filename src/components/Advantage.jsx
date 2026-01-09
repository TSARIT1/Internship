import { useRef, useEffect, useState } from 'react';
import { Award, CheckCircle, Users, Zap, Briefcase, BookOpen } from 'lucide-react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

const StatCard = ({ stat, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const springValue = useSpring(0, { stiffness: 60, damping: 15 });
    const displayValue = useTransform(springValue, (latest) => {
        if (stat.value % 1 !== 0) {
            return latest.toFixed(1); // 4.9
        }
        return Math.floor(latest); // 5000
    });

    useEffect(() => {
        if (isInView) {
            springValue.set(stat.value);
        }
    }, [isInView, stat.value, springValue]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
        >
            <div className="text-4xl font-bold text-blue-600 mb-2 flex items-center">
                <motion.span>{displayValue}</motion.span>
                {stat.suffix}
            </div>
            {stat.stars && <div className="text-amber-400 text-sm mb-2">★★★★★</div>}
            <div className="text-sm text-slate-500 font-bold uppercase tracking-wide">{stat.label}</div>
        </motion.div>
    );
};

const Advantage = () => {
    return (
        <section id="benefits" className="py-20 bg-slate-50">
            <div className="container mx-auto px-6">

                {/* Why Choose Us */}
                <div className="mb-24">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <h2 className="text-3xl lg:text-4xl font-bold font-display text-slate-900 mb-6">
                            Why Choose Our Internship?
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed mb-10">
                            Our IT internship program is designed to bridge the gap between academic knowledge and industry requirements.
                            You'll work on live projects using technologies like React, Node.js, Python, AI/ML, and Cloud Computing.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-left">
                            {[
                                { label: 'Average Rating', value: 4.9, suffix: '', stars: true },
                                { label: 'Students Trained', value: 5000, suffix: '+' },
                                { label: 'Placement Rate', value: 85, suffix: '%' },
                                { label: 'Industry Mentors', value: 50, suffix: '+' }
                            ].map((stat, idx) => (
                                <StatCard key={idx} stat={stat} index={idx} />
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-blue-50 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform duration-300">
                            <Award className="text-blue-600 mb-4" size={40} />
                            <span className="font-bold text-slate-800 text-lg">Accredited</span>
                            <span className="text-sm text-slate-500 mt-2">Recognized certificates</span>
                        </div>
                        <div className="bg-indigo-50 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform duration-300">
                            <Users className="text-indigo-600 mb-4" size={40} />
                            <span className="font-bold text-slate-800 text-lg">Networking</span>
                            <span className="text-sm text-slate-500 mt-2">Connect with peers</span>
                        </div>
                        <div className="bg-amber-50 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform duration-300">
                            <Zap className="text-amber-600 mb-4" size={40} />
                            <span className="font-bold text-slate-800 text-lg">Skill Up</span>
                            <span className="text-sm text-slate-500 mt-2">Live Projects</span>
                        </div>
                        <div className="bg-green-50 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform duration-300">
                            <CheckCircle className="text-green-600 mb-4" size={40} />
                            <span className="font-bold text-slate-800 text-lg">Placement</span>
                            <span className="text-sm text-slate-500 mt-2">Career Support</span>
                        </div>
                    </div>
                </div>

                {/* Our Advantage */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold font-display text-slate-900">Our Internship Advantage</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
                        <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                            <Zap size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Training</h3>
                            <p className="text-slate-600">Hands-on training with industry experts and modern tech stacks. We focus on practical application over theory.</p>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
                        <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
                            <Award size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Skills</h3>
                            <p className="text-slate-600">Develop in-demand skills through real-world projects. Master the tools used by top tech companies.</p>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
                        <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
                            <Users size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Mentorship</h3>
                            <p className="text-slate-600">Get 1-on-1 guidance from experienced industry professionals who help navigate your career path.</p>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
                        <div className="bg-teal-100 p-3 rounded-lg text-teal-600">
                            <Briefcase size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Experience</h3>
                            <p className="text-slate-600">Gain valuable work experience to add to your resume and stand out to future employers.</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Advantage;
