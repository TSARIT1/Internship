import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Database, Cloud, Code, Server, Coffee, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const internships = [
    {
        title: 'Data Science',
        duration: '4 Months',
        level: 'Intermediate',
        description: 'Master data analysis, visualization, and machine learning with Python and R.',
        icon: Database,
        color: 'text-blue-500',
        bg: 'bg-blue-50',
        shadow: 'hover:shadow-blue-500/20',
        border: 'hover:border-blue-200'
    },
    {
        title: 'Machine Learning',
        duration: '5 Months',
        level: 'Advanced',
        description: 'Learn to build and deploy machine learning models with Python and TensorFlow.',
        icon: Brain,
        color: 'text-purple-500',
        bg: 'bg-purple-50',
        shadow: 'hover:shadow-purple-500/20',
        border: 'hover:border-purple-200'
    },
    {
        title: 'AI',
        duration: '6 Months',
        level: 'Advanced',
        description: 'Dive deep into artificial intelligence, neural networks, and deep learning.',
        icon: Brain,
        color: 'text-indigo-500',
        bg: 'bg-indigo-50',
        shadow: 'hover:shadow-indigo-500/20',
        border: 'hover:border-indigo-200'
    },
    {
        title: 'MERN Stack',
        duration: '5 Months',
        level: 'Intermediate',
        description: 'Build full-stack applications with MongoDB, Express, React, and Node.js.',
        icon: Server,
        color: 'text-orange-500',
        bg: 'bg-orange-50',
        shadow: 'hover:shadow-orange-500/20',
        border: 'hover:border-orange-200'
    },
    {
        title: 'DevOps',
        duration: '4 Months',
        level: 'Intermediate',
        description: 'Learn CI/CD, Docker, Kubernetes, and infrastructure as code.',
        icon: Cloud,
        color: 'text-sky-500',
        bg: 'bg-sky-50',
        shadow: 'hover:shadow-sky-500/20',
        border: 'hover:border-sky-200'
    },
    {
        title: 'Java Full-stack',
        duration: '6 Months',
        level: 'Advanced',
        description: 'Build robust enterprise applications with Java, Spring Boot, Microservices, and React.',
        icon: Coffee,
        color: 'text-green-500',
        bg: 'bg-green-50',
        shadow: 'hover:shadow-green-500/20',
        border: 'hover:border-green-200'
    },
    {
        title: 'Python Programming',
        duration: '3 Months',
        level: 'Beginner',
        description: 'Start your coding journey with Python, the most versatile programming language.',
        icon: Code,
        color: 'text-yellow-500',
        bg: 'bg-yellow-50',
        shadow: 'hover:shadow-yellow-500/20',
        border: 'hover:border-yellow-200'
    },
    {
        title: 'AWS Cloud Computing',
        duration: '5 Months',
        level: 'Advanced',
        description: 'Become a certified AWS solutions architect and master cloud infrastructure.',
        icon: Cloud,
        color: 'text-teal-500',
        bg: 'bg-teal-50',
        shadow: 'hover:shadow-teal-500/20',
        border: 'hover:border-teal-200'
    },
    {
        title: 'Cyber Security',
        duration: '6 Months',
        level: 'Advanced',
        description: 'Protect organizations from cyber threats and become an ethical hacker.',
        icon: Shield,
        color: 'text-rose-500',
        bg: 'bg-rose-50',
        shadow: 'hover:shadow-rose-500/20',
        border: 'hover:border-rose-200'
    }
];

const InternshipCards = () => {
    return (
        <section id="internships" className="py-24 bg-slate-50/50 relative overflow-hidden">
            {/* Background blobs for depth */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl lg:text-5xl font-bold font-display text-slate-900 mb-6"
                    >
                        Select Your <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Internship Domain</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed"
                    >
                        Explore our wide range of industry-aligned internship programs designed to make you job-ready.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {internships.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`group bg-white rounded-2xl border border-slate-100 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${item.shadow} ${item.border}`}
                        >
                            <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                <item.icon size={32} />
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 mb-3 font-display group-hover:text-blue-600 transition-colors">{item.title}</h3>

                            <div className="flex flex-wrap gap-2 mb-6 text-xs font-bold uppercase tracking-wider">
                                <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg">{item.duration}</span>
                                <span className={`bg-opacity-10 px-3 py-1.5 rounded-lg ${item.bg.replace('50', '100')} ${item.color}`}>
                                    {item.level}
                                </span>
                            </div>

                            <p className="text-slate-600 mb-8 leading-relaxed text-sm">
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
                                className="inline-flex items-center gap-2 font-bold text-blue-600 group-hover:gap-3 transition-all"
                            >
                                View Details <ArrowRight size={18} />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default InternshipCards;
