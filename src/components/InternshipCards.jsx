import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Database, Cloud, Code, Server, Coffee, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import SpotlightCard from './ui/SpotlightCard';

const internships = [
    {
        title: 'Data Science',
        duration: '4 Months',
        level: 'Intermediate',
        description: 'Master data analysis, visualization, and machine learning with Python and R.',
        icon: Database,
        color: 'text-blue-600',
        bg: 'bg-blue-600/10',
        border: 'group-hover:border-blue-500/50',
        gradient: 'from-blue-600 to-cyan-500',
        shadow: 'group-hover:shadow-blue-500/20'
    },
    {
        title: 'Machine Learning',
        duration: '5 Months',
        level: 'Advanced',
        description: 'Learn to build and deploy machine learning models with Python and TensorFlow.',
        icon: Brain,
        color: 'text-purple-600',
        bg: 'bg-purple-600/10',
        border: 'group-hover:border-purple-500/50',
        gradient: 'from-purple-600 to-pink-500',
        shadow: 'group-hover:shadow-purple-500/20'
    },
    {
        title: 'AI',
        duration: '6 Months',
        level: 'Advanced',
        description: 'Dive deep into artificial intelligence, neural networks, and deep learning.',
        icon: Brain,
        color: 'text-indigo-600',
        bg: 'bg-indigo-600/10',
        border: 'group-hover:border-indigo-500/50',
        gradient: 'from-indigo-600 to-violet-500',
        shadow: 'group-hover:shadow-indigo-500/20'
    },
    {
        title: 'MERN Stack',
        duration: '5 Months',
        level: 'Intermediate',
        description: 'Build full-stack applications with MongoDB, Express, React, and Node.js.',
        icon: Server,
        color: 'text-orange-600',
        bg: 'bg-orange-600/10',
        border: 'group-hover:border-orange-500/50',
        gradient: 'from-orange-600 to-amber-500',
        shadow: 'group-hover:shadow-orange-500/20'
    },
    {
        title: 'DevOps',
        duration: '4 Months',
        level: 'Intermediate',
        description: 'Learn CI/CD, Docker, Kubernetes, and infrastructure as code.',
        icon: Cloud,
        color: 'text-sky-600',
        bg: 'bg-sky-600/10',
        border: 'group-hover:border-sky-500/50',
        gradient: 'from-sky-600 to-blue-500',
        shadow: 'group-hover:shadow-sky-500/20'
    },
    {
        title: 'Java Full-stack',
        duration: '6 Months',
        level: 'Advanced',
        description: 'Build robust enterprise applications with Java, Spring Boot, Microservices, and React.',
        icon: Coffee,
        color: 'text-red-600',
        bg: 'bg-red-600/10',
        border: 'group-hover:border-red-500/50',
        gradient: 'from-red-600 to-rose-500',
        shadow: 'group-hover:shadow-red-500/20'
    },
    {
        title: 'Python Programming',
        duration: '3 Months',
        level: 'Beginner',
        description: 'Start your coding journey with Python, the most versatile programming language.',
        icon: Code,
        color: 'text-yellow-600',
        bg: 'bg-yellow-600/10',
        border: 'group-hover:border-yellow-500/50',
        gradient: 'from-yellow-600 to-amber-500',
        shadow: 'group-hover:shadow-yellow-500/20'
    },
    {
        title: 'AWS Cloud Computing',
        duration: '5 Months',
        level: 'Advanced',
        description: 'Become a certified AWS solutions architect and master cloud infrastructure.',
        icon: Cloud,
        color: 'text-teal-600',
        bg: 'bg-teal-600/10',
        border: 'group-hover:border-teal-500/50',
        gradient: 'from-teal-600 to-emerald-500',
        shadow: 'group-hover:shadow-teal-500/20'
    },
    {
        title: 'Cyber Security',
        duration: '6 Months',
        level: 'Advanced',
        description: 'Protect organizations from cyber threats and become an ethical hacker.',
        icon: Shield,
        color: 'text-rose-600',
        bg: 'bg-rose-600/10',
        border: 'group-hover:border-rose-500/50',
        gradient: 'from-rose-600 to-pink-500',
        shadow: 'group-hover:shadow-rose-500/20'
    }
];

const InternshipCards = () => {
    return (
        <section id="internships" className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block"
                    >
                        <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-4 inline-block border border-blue-100">
                            Career Tracks
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-bold font-display text-slate-900 mb-6">
                            Select Your <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Internship Domain</span>
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
                            Explore our wide range of industry-aligned internship programs designed to make you job-ready from day one.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {internships.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <SpotlightCard className={`h-full group hover:-translate-y-2 transition-all duration-300 border-slate-200 ${item.border} ${item.shadow}`}>
                                <div className="p-8 h-full flex flex-col">
                                    {/* Icon with Gradient Background */}
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${item.gradient} text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                                        <item.icon size={32} />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-2xl font-bold text-slate-900 mb-3 font-display group-hover:text-blue-600 transition-colors">
                                        {item.title}
                                    </h3>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <span className="bg-slate-50 border border-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                            {item.duration}
                                        </span>
                                        <span className={`bg-opacity-10 border border-opacity-20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${item.bg} border-${item.color.split('-')[1]}-200 ${item.color}`}>
                                            {item.level}
                                        </span>
                                    </div>

                                    <p className="text-slate-500 mb-8 leading-relaxed text-sm flex-grow">
                                        {item.description}
                                    </p>

                                    <Link
                                        to={
                                            item.title === 'Data Science' ? "/data-science" :
                                                item.title === 'Machine Learning' ? "/machine-learning" :
                                                    item.title === 'AI' ? "/ai" :
                                                        item.title === 'MERN Stack' ? "/mern-stack" :
                                                            item.title === 'DevOps' ? "/devops" :
                                                                item.title === 'Java Full-stack' ? "/java-full-stack" :
                                                                    item.title === 'Python Programming' ? "/python-programming" :
                                                                        item.title === 'AWS Cloud Computing' ? "/aws-cloud-computing" :
                                                                            item.title === 'Cyber Security' ? "/cyber-security" :
                                                                                "/internship/data-science"
                                        }
                                        className="mt-auto w-full inline-flex items-center justify-center gap-2 font-bold text-slate-700 bg-white border border-slate-200 py-3.5 rounded-xl group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all duration-300 shadow-sm"
                                    >
                                        View Program <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default InternshipCards;
