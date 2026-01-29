import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Database, Cloud, Code, Server, Coffee, Shield, Video, Globe, Lock, Tablet, Layout } from 'lucide-react';
import { motion } from 'framer-motion';
import SpotlightCard from './ui/SpotlightCard';
import EnrollButton from './EnrollButton';
import { getAllCourses } from '../services/studentApi';

const iconMap = {
    'Brain': Brain,
    'Database': Database,
    'Cloud': Cloud,
    'Code': Code,
    'Server': Server,
    'Coffee': Coffee,
    'Shield': Shield,
    'Video': Video,
    'Globe': Globe,
    'Lock': Lock,
    'Tablet': Tablet,
    'Layout': Layout
};

const InternshipCards = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await getAllCourses();
                if (response.success) {
                    setCourses(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch courses", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) {
        return <div className="py-24 text-center text-slate-500">Loading courses...</div>;
    }

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
                    {courses.map((item, index) => {
                        const IconComponent = iconMap[item.iconName] || Code; // Fallback icon

                        return (
                            <motion.div
                                key={item.id || index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <SpotlightCard className={`h-full group hover:-translate-y-2 transition-all duration-300 border-slate-200 ${item.borderColor || 'group-hover:border-blue-500/50'} ${item.shadow || 'group-hover:shadow-blue-500/20'}`}>
                                    <div className="p-8 h-full flex flex-col">
                                        {/* Icon with Gradient Background */}
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${item.gradient || 'from-blue-600 to-cyan-500'} text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                                            <IconComponent size={32} />
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-2xl font-bold text-slate-900 mb-3 font-display group-hover:text-blue-600 transition-colors">
                                            {item.name}
                                        </h3>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            <span className="bg-slate-50 border border-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                {item.duration}
                                            </span>
                                            <span className={`bg-opacity-10 border border-opacity-20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${item.bgColor || 'bg-blue-100'} border-slate-200 ${item.color || 'text-blue-600'}`}>
                                                {item.level}
                                            </span>
                                        </div>

                                        <p className="text-slate-500 mb-8 leading-relaxed text-sm flex-grow">
                                            {item.description}
                                        </p>

                                        <div className="mt-auto flex gap-3">
                                            <EnrollButton
                                                course={item.name}
                                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
                                            >
                                                Enroll
                                            </EnrollButton>
                                            <Link
                                                to={
                                                    item.name === 'Data Science' ? "/data-science" :
                                                        item.name === 'Machine Learning' ? "/machine-learning" :
                                                            item.name === 'AI' ? "/ai" :
                                                                item.name === 'MERN Stack' ? "/mern-stack" :
                                                                    item.name === 'DevOps' ? "/devops" :
                                                                        item.name === 'Java Full Stack' ? "/java-full-stack" :
                                                                            item.name === 'Python Programming' ? "/python-programming" :
                                                                                item.name === 'AWS Cloud Computing' ? "/aws-cloud-computing" :
                                                                                    item.name === 'Cyber Security' ? "/cyber-security" :
                                                                                        "/internship/data-science"
                                                }
                                                className="flex-1 inline-flex items-center justify-center gap-2 font-bold text-slate-600 bg-white border border-slate-200 py-3.5 rounded-xl hover:bg-slate-50 transition-all duration-300"
                                            >
                                                Details
                                            </Link>
                                        </div>
                                    </div>
                                </SpotlightCard>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
};

export default InternshipCards;
