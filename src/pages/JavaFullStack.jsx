import React, { useState } from 'react';
import {
    BookOpen, CheckCircle, ChevronDown, ChevronUp,
    Code, Database, Server, Award, Users,
    ArrowRight, Globe, Layers, Cpu, Shield
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const JavaFullStack = () => {
    const data = {
        title: "Java Full Stack Development",
        description: "Build robust, scalable enterprise applications using Java, Spring Boot, Microservices, and React.",
        duration: "6 Months",
        level: "Advanced",
        heroImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        curriculum: [
            {
                title: "Java Fundamentals & DSA",
                duration: "5 weeks",
                topics: [
                    "Core Java (OOP, Collections, Streams)",
                    "Data Structures & Algorithms",
                    "Multithreading & Concurrency",
                    "Exception Handling & File I/O",
                    "Java 8+ Features"
                ]
            },
            {
                title: "Backend with Spring Boot",
                duration: "6 weeks",
                topics: [
                    "Spring Core & Dependency Injection",
                    "Spring Boot REST APIs",
                    "Spring Data JPA & Hibernate",
                    "Spring Security & JWT Auth",
                    "Microservices Architecture"
                ]
            },
            {
                title: "Frontend with React",
                duration: "5 weeks",
                topics: [
                    "React.js Fundamentals & Hooks",
                    "State Management (Redux/Context)",
                    "Responsive UI with Tailwind CSS",
                    "Connecting to Backend APIs",
                    "Form Handling & Validation"
                ]
            },
            {
                title: "DevOps & Deployment",
                duration: "4 weeks",
                topics: [
                    "Docker Containerization",
                    "CI/CD Pipelines (Jenkins/GitHub)",
                    "Cloud Deployment (AWS/Azure)",
                    "Distributed Tracing & Logging",
                    "System Design Principles"
                ]
            }
        ],
        features: [
            { icon: Server, title: "Backend Mastery", desc: "Expertise in Spring Boot" },
            { icon: Globe, title: "Modern Frontend", desc: "Interactive UIs with React" },
            { icon: Layers, title: "Microservices", desc: "Scalable Architecture" },
            { icon: Database, title: "Database Design", desc: "SQL & NoSQL Integration" },
            { icon: Shield, title: "Security", desc: "OAuth2 & JWT Implementation" },
            { icon: Cpu, title: "System Design", desc: "High-Level Architecture" }
        ],
        projects: [
            {
                title: "E-Commerce Platform",
                desc: "Full-scale shopping app with microservices backend",
                tags: ["Spring Boot", "React", "Kafka"],
                image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Banking System",
                desc: "Secure transaction processing system",
                tags: ["Spring Security", "MySQL", "Docker"],
                image: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Hospital Management",
                desc: "Patient and appointment management portal",
                tags: ["Hibernate", "React", "AWS"],
                image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            }
        ],
        outcomes: [
            "Architect scalable microservices using Spring Boot",
            "Build responsive frontends with React.js",
            "Design efficient database schemas (SQL/NoSQL)",
            "Secure applications with Spring Security",
            "Deploy full-stack apps to AWS/Cloud",
            "Implement message queues with Kafka/RabbitMQ",
            "Master containerization with Docker",
            "Write clean, testable, and maintainable code"
        ]
    };

    const tools = [
        { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
        { name: "Spring Boot", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" },
        { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
        { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
        { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
        { name: "Maven", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/maven/maven-original.svg" },
        { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
        { name: "Hibernate", icon: "https://avatars.githubusercontent.com/u/23205219?s=200&v=4" } // Hibernate logo fallback or separate URL if available
    ];

    const [openSection, setOpenSection] = useState(0);

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-100">
            <Header />

            {/* Background Decorations */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_50%)]"></div>
                <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.05),transparent_50%)]"></div>
            </div>

            <div className="relative z-10">
                {/* Hero Section */}
                <div className="relative bg-slate-900 text-white pt-32 pb-24 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src={data.heroImage}
                            alt="Hero Background"
                            className="w-full h-full object-cover opacity-20"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-slate-900/95"></div>
                    </div>

                    <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
                        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-300 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest border border-emerald-500/20 mb-8 backdrop-blur-sm">
                            <Award size={16} /> Certified Program
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
                            {data.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
                            {data.description}
                        </p>

                        <div className="flex flex-wrap justify-center gap-6">
                            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-emerald-600/30 flex items-center gap-2">
                                Enroll Now <ArrowRight size={20} />
                            </button>

                        </div>
                    </div>
                </div>

                {/* Program Outcomes */}
                <section className="py-20">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">Program Outcomes</h2>
                            <div className="w-20 h-1 bg-emerald-600 mx-auto rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {data.outcomes.map((outcome, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600">
                                        <CheckCircle size={24} />
                                    </div>
                                    <p className="text-slate-700 font-medium leading-relaxed">{outcome}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* What You'll Learn */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="lg:w-1/2">
                                <h2 className="text-4xl font-bold text-slate-900 mb-6">What You'll Learn</h2>
                                <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                                    Become a versatile developer capable of building complex enterprise systems from front to back.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        "Advanced Java Programming",
                                        "Spring Boot & Microservices",
                                        "RESTful API Development",
                                        "Frontend Development with React",
                                        "Database Management (SQL)"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                                <CheckCircle size={14} />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="lg:w-1/2 relative">
                                <div className="absolute inset-0 bg-emerald-600 rounded-3xl rotate-3 opacity-10"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                                    alt="Coding"
                                    className="relative rounded-3xl shadow-2xl z-10"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* What We Provide */}
                <section className="py-20 bg-slate-50">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">What We Provide</h2>
                            <p className="text-slate-600 max-w-2xl mx-auto">Hands-on experience with the industry's most popular tech stack.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {data.features.map((feature, idx) => (
                                <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all text-center group">
                                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                                        <feature.icon size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                    <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Tools & Technologies */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl font-bold text-slate-900 mb-12">Tools & Technologies Covered</h2>
                        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                            {tools.map((tool, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-3 group">
                                    <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center p-4 border border-slate-100 shadow-sm group-hover:shadow-md transition-all group-hover:-translate-y-2">
                                        <img src={tool.icon} alt={tool.name} className="w-full h-full object-contain" />
                                    </div>
                                    <span className="font-semibold text-slate-700">{tool.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Curriculum & Projects */}
                <div className="container mx-auto px-6 py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-16">
                            {/* Curriculum */}
                            <section>
                                <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                    <BookOpen className="text-emerald-600" /> Comprehensive Curriculum
                                </h2>
                                <div className="space-y-4">
                                    {data.curriculum.map((section, idx) => (
                                        <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                                            <button
                                                onClick={() => setOpenSection(openSection === idx ? -1 : idx)}
                                                className={`w-full flex items-center justify-between p-6 text-left transition-colors ${openSection === idx ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border ${openSection === idx ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-500 border-slate-300'}`}>
                                                        {idx + 1}
                                                    </div>
                                                    <span className={`font-bold text-lg ${openSection === idx ? 'text-emerald-700' : 'text-slate-800'}`}>{section.title}</span>
                                                </div>
                                                {openSection === idx ? <ChevronUp size={20} className="text-emerald-600" /> : <ChevronDown size={20} className="text-slate-400" />}
                                            </button>
                                            {openSection === idx && (
                                                <div className="p-6 pt-0 pl-[4.5rem] border-t border-slate-100">
                                                    <ul className="space-y-3 mt-4">
                                                        {section.topics.map((topic, i) => (
                                                            <li key={i} className="flex items-start gap-3 text-slate-600">
                                                                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></div>
                                                                {topic}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Projects */}
                            <section>
                                <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                    <Code className="text-emerald-600" /> Capstone Projects
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {data.projects.map((project, idx) => (
                                        <div key={idx} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                                            <div className="h-48 overflow-hidden">
                                                <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                            <div className="p-6">
                                                <h3 className="font-bold text-xl text-slate-900 mb-2">{project.title}</h3>
                                                <p className="text-slate-500 mb-4 text-sm">{project.desc}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {project.tags.map((tag, t) => (
                                                        <span key={t} className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-full border border-slate-100">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24">
                                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center relative overflow-hidden mb-8">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                        <Award size={120} />
                                    </div>
                                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Total Fees</p>
                                    <div className="flex items-center justify-center gap-2 mb-8">
                                        <span className="text-5xl font-bold text-slate-900">₹4,999</span>
                                        <span className="text-slate-400 line-through text-lg">₹8,999</span>
                                    </div>
                                    <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all transform hover:-translate-y-1 mb-4 flex items-center justify-center gap-2">
                                        Enroll Now <ArrowRight size={18} />
                                    </button>
                                    <p className="text-xs text-slate-400">Limited seats available for next batch</p>
                                </div>

                                <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                                    <div className="relative z-10">
                                        <h3 className="text-xl font-bold mb-4">Questions?</h3>
                                        <p className="text-slate-400 mb-6 text-sm leading-relaxed">
                                            Speak to our career counselors to get a personalized roadmap.
                                        </p>
                                        <a href="mailto:nnikhiln2002@gmail.com?subject=Inquiry%20about%20Java%20Full%20Stack%20Internship&body=Hello%20Team%2C%0A%0AI%20am%20interested%20in%20the%20Java%20Full%20Stack%20Internship%20Program.%20Please%20provide%20more%20details%20regarding%20the%20enrollment%20process.%0A%0AThanks" className="block w-full text-center bg-white text-slate-900 font-bold py-3 rounded-xl hover:bg-emerald-50 transition-colors text-sm">
                                            Book Free Session
                                        </a>
                                    </div>
                                    <div className="absolute bottom-[-20%] right-[-20%] w-32 h-32 bg-emerald-500 rounded-full blur-3xl opacity-20"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    );
};

export default JavaFullStack;
