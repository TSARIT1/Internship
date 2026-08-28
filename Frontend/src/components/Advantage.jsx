import React, { useRef, useEffect } from 'react';
import { Award, CheckCircle, Users, Zap, Briefcase, TrendingUp, Sparkles, BookOpen, ShieldCheck, Video, Laptop, FileCheck2, ArrowRight } from 'lucide-react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

const StatCard = ({ stat, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const springValue = useSpring(0, { stiffness: 60, damping: 15 });
    const displayValue = useTransform(springValue, (latest) => {
        if (stat.value % 1 !== 0) {
            return latest.toFixed(1);
        }
        return Math.floor(latest);
    });

    useEffect(() => {
        if (isInView) {
            springValue.set(stat.value);
        }
    }, [isInView, stat.value, springValue]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex flex-col items-center justify-center p-6 text-center"
        >
            <div className="text-4xl lg:text-5xl font-black text-slate-900 mb-1.5 flex items-center tracking-tight font-display">
                <motion.span>{displayValue}</motion.span>
                <span className="text-blue-600">{stat.suffix}</span>
            </div>
            {stat.stars && <div className="text-amber-400 text-sm mb-1.5 flex gap-1">★★★★★</div>}
            <div className="text-xs text-slate-500 font-extrabold uppercase tracking-widest">{stat.label}</div>
        </motion.div>
    );
};

const Advantage = () => {
    const roadmapSteps = [
        { step: "01", title: "Enroll & Mentor Match", desc: "Select your tech domain, receive your LMS access, and get paired with a senior industry mentor." },
        { step: "02", title: "Hands-on Live Classes", desc: "Attend live coding workshops, mastering foundational and advanced frameworks through practical assignments." },
        { step: "03", title: "Enterprise Capstones", desc: "Build 4+ production-grade projects using standard Git workflows, CI/CD, and peer code reviews." },
        { step: "04", title: "Placement Training", desc: "Resume building, GitHub portfolio optimization, LinkedIn profile makeover, and mock technical interviews." },
        { step: "05", title: "Job Placement & Certificate", desc: "Receive Govt. MSME verified certificate with QR verification and direct interview opportunities." }
    ];

    const benefits = [
        {
            icon: FileCheck2,
            title: "Govt. MSME Recognized Certification",
            desc: "Nationally recognized credentials with instant online QR code verification accepted across top tech employers.",
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            icon: Laptop,
            title: "Live Production Projects",
            desc: "Work on live full-stack, cloud, and AI architectures identical to top tier tech enterprise standards.",
            color: "text-indigo-600",
            bg: "bg-indigo-50"
        },
        {
            icon: Users,
            title: "1-on-1 Mentorship",
            desc: "Direct access to senior tech leads and software architects for code reviews and continuous doubt clearing.",
            color: "text-teal-600",
            bg: "bg-teal-50"
        },
        {
            icon: Briefcase,
            title: "100% Placement Support",
            desc: "Dedicated recruitment drives, technical interview preparation, and referral pipelines across 120+ partners.",
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            icon: Video,
            title: "Recorded Lecture Access",
            desc: "Lifetime access to all recorded sessions, project source code, architectural slides, and cheat sheets.",
            color: "text-amber-600",
            bg: "bg-amber-50"
        },
        {
            icon: ShieldCheck,
            title: "Govt. & MSME Recognized",
            desc: "Compliant with national technical training standards and college academic credit requirements.",
            color: "text-purple-600",
            bg: "bg-purple-50"
        }
    ];

    return (
        <section id="benefits" className="py-20 bg-slate-50 border-t border-slate-200 font-sans">
            <div className="container mx-auto px-6">
                {/* Statistics Row */}
                <div className="mb-16 bg-white rounded-3xl p-8 lg:p-10 border border-slate-200 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                        {[
                            { label: 'Student Rating', value: 4.9, suffix: '', stars: true },
                            { label: 'Interns Trained', value: 5000, suffix: '+' },
                            { label: 'Placement Rate', value: 94, suffix: '%' },
                            { label: 'Hiring Partners', value: 120, suffix: '+' }
                        ].map((stat, idx) => (
                            <StatCard key={idx} stat={stat} index={idx} />
                        ))}
                    </div>
                </div>

                {/* Features Header */}
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-extrabold text-xs uppercase tracking-wider mb-4">
                        <TrendingUp size={14} />
                        <span>Why Choose TSAR IT INTERNSHIP</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-slate-900 mb-5 leading-tight">
                        Bridging The Gap Between <br />
                        <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
                            Academics and High-Paying Tech Jobs
                        </span>
                    </h2>
                    <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                        We don't just teach syntax. You will build production applications, containerize systems, train models, configure clouds, and deploy real products just like full-time software engineers.
                    </p>
                </div>

                {/* 6 Advantages Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                    {benefits.map((b, idx) => {
                        const IconComponent = b.icon;
                        return (
                            <div
                                key={idx}
                                className="bg-white p-7 rounded-3xl border border-slate-200 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                            >
                                <div className={`w-12 h-12 rounded-2xl ${b.bg} ${b.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <IconComponent size={24} />
                                </div>
                                <h4 className="font-bold text-slate-900 text-base mb-2">
                                    {b.title}
                                </h4>
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                    {b.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* 5-Step Internship Roadmap (Clean Light Styling) */}
                <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">Structured Roadmap</span>
                        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 font-display">Your 5-Phase Internship Journey</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {roadmapSteps.map((s, idx) => (
                            <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 relative group hover:border-blue-300 hover:bg-blue-50/30 transition-colors">
                                <div className="text-2xl font-black text-blue-600 font-display mb-2">
                                    {s.step}
                                </div>
                                <h5 className="font-bold text-sm text-slate-900 mb-1.5">{s.title}</h5>
                                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Advantage;
