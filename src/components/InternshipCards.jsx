import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Database, Cloud, Code, Server, Coffee, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import SpotlightCard from './ui/SpotlightCard';

import { internships } from '../data/internships';

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
                                                                item.title === 'Java Full Stack' ? "/java-full-stack" :
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
