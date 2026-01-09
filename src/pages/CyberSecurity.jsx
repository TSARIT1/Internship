import React, { useState } from 'react';
import {
    BookOpen, CheckCircle, ChevronDown, ChevronUp,
    Code, Database, Server, Award, Users,
    ArrowRight, Globe, Layers, Cpu, Shield, Lock, Eye
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CyberSecurity = () => {
    const data = {
        title: "Cyber Security",
        description: "Defend the digital world. Master ethical hacking, network security, and cryptography to protect critical systems.",
        duration: "6 Months",
        level: "Advanced",
        heroImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80",
        curriculum: [
            {
                title: "Introduction to Cyber Security",
                duration: "4 weeks",
                topics: [
                    "Cyber Security Fundamentals (CIA Triad)",
                    "Network Security Basics",
                    "Linux for Security Professionals",
                    "Cryptography Basics",
                    "Information Gathering & Scanning"
                ]
            },
            {
                title: "Ethical Hacking & Penetration Testing",
                duration: "6 weeks",
                topics: [
                    "Vulnerability Assessment",
                    "System Hacking & Exploitation",
                    "Web Application Security (OWASP Top 10)",
                    "Wireless Network Security",
                    "Social Engineering Attacks"
                ]
            },
            {
                title: "Network Defense & Security Operations",
                duration: "5 weeks",
                topics: [
                    "Firewalls, IDS, & IPS",
                    "Security Information & Event Management (SIEM)",
                    "Incident Response & Handling",
                    "Malware Analysis & Reverse Engineering",
                    "Cloud Security Fundamentals"
                ]
            },
            {
                title: "Governance, Risk & Compliance",
                duration: "3 weeks",
                topics: [
                    "Risk Management Frameworks",
                    "Security Laws & Regulations (GDPR, HIPAA)",
                    "Cyber Security Policies & Procedures",
                    "Security Auditing",
                    "Professional Ethics"
                ]
            }
        ],
        features: [
            { icon: Shield, title: "Network Defense", desc: "Secure Network Infrastructure" },
            { icon: Lock, title: "Cryptography", desc: "Encryption & Data Protection" },
            { icon: Eye, title: "Threat Intel", desc: "Monitor & Analyze Threats" },
            { icon: Globe, title: "Web Security", desc: "Secure Web Applications" },
            { icon: Server, title: "System Hardening", desc: "Secure Operating Systems" },
            { icon: Code, title: "Secure Coding", desc: "Write Vulnerability-Free Code" }
        ],
        projects: [
            {
                title: "Penetration Testing Report",
                desc: "Conduct a full security audit of a test environment",
                tags: ["Kali Linux", "Metasploit", "Reporting"],
                image: "https://images.unsplash.com/photo-1563206767-5b1d972e8136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Network Traffic Analysis",
                desc: "Analyze packet captures to detect malicious activity",
                tags: ["Wireshark", "Tcpdump", "Forensics"],
                image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            },
            {
                title: "Secure Web Portal",
                desc: "Implement security headers and fix vulnerabilities",
                tags: ["OWASP", "Burp Suite", "Web Sec"],
                image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            }
        ],
        outcomes: [
            "Perform vulnerability assessments and penetration testing",
            "Secure network infrastructure against cyber attacks",
            "Analyze and respond to security incidents",
            "Understand and apply cryptographic protocols",
            "Secure web applications against common vulnerabilities",
            "Implement security best practices in cloud environments",
            "Conduct digital forensics investigations",
            "Prepare for CEH and CompTIA Security+ certifications"
        ]
    };

    const tools = [
        { name: "Kali Linux", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" },
        { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
        { name: "Wireshark", icon: "https://upload.wikimedia.org/wikipedia/commons/1/13/Wireshark_icon_new.png" }, // Custom URL or fallback
        { name: "Metasploit", icon: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Metasploit_logo.svg" }, // Custom URL or fallback
        { name: "Burp Suite", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" }, // Placeholder/Java based
        { name: "Nmap", icon: "https://upload.wikimedia.org/wikipedia/commons/fa/Nmap_logo.svg?20150927164923" }, // No devicon
        { name: "Splunk", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/splunk/splunk-original-wordmark.svg" }, // May not exist in all sets, check availability
        { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" }
    ];

    const [openSection, setOpenSection] = useState(0);

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-rose-100">
            <Header />

            {/* Background Decorations */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.1),transparent_50%)]"></div>
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
                        <div className="inline-flex items-center gap-2 bg-rose-500/10 text-rose-300 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest border border-rose-500/20 mb-8 backdrop-blur-sm">
                            <Award size={16} /> Certified Program
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
                            {data.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-300 mb-10 leading-relaxed max-w-2xl mx-auto">
                            {data.description}
                        </p>

                        <div className="flex flex-wrap justify-center gap-6">
                            <button className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-rose-600/30 flex items-center gap-2">
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
                            <div className="w-20 h-1 bg-rose-600 mx-auto rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {data.outcomes.map((outcome, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1">
                                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-4 text-rose-600">
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
                                    Learn the offensive and defensive strategies used by top security professionals to secure the digital landscape.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        "Ethical Hacking Methodologies",
                                        "Network Security Protocols",
                                        "Cryptography & Encyption",
                                        "Incident Response & Forensics",
                                        "Cloud Security Architecture"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                                            <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                                                <CheckCircle size={14} />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="lg:w-1/2 relative">
                                <div className="absolute inset-0 bg-rose-500 rounded-3xl rotate-3 opacity-10"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                                    alt="Cyber Security"
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
                            <p className="text-slate-600 max-w-2xl mx-auto">Train in our state-of-the-art cyber range with real-world attack simulations.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {data.features.map((feature, idx) => (
                                <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all text-center group">
                                    <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-rose-600 group-hover:text-white transition-colors duration-300">
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
                                    <BookOpen className="text-rose-600" /> Comprehensive Curriculum
                                </h2>
                                <div className="space-y-4">
                                    {data.curriculum.map((section, idx) => (
                                        <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                                            <button
                                                onClick={() => setOpenSection(openSection === idx ? -1 : idx)}
                                                className={`w-full flex items-center justify-between p-6 text-left transition-colors ${openSection === idx ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border ${openSection === idx ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-slate-500 border-slate-300'}`}>
                                                        {idx + 1}
                                                    </div>
                                                    <span className={`font-bold text-lg ${openSection === idx ? 'text-rose-700' : 'text-slate-800'}`}>{section.title}</span>
                                                </div>
                                                {openSection === idx ? <ChevronUp size={20} className="text-rose-600" /> : <ChevronDown size={20} className="text-slate-400" />}
                                            </button>
                                            {openSection === idx && (
                                                <div className="p-6 pt-0 pl-[4.5rem] border-t border-slate-100">
                                                    <ul className="space-y-3 mt-4">
                                                        {section.topics.map((topic, i) => (
                                                            <li key={i} className="flex items-start gap-3 text-slate-600">
                                                                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></div>
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
                                    <Code className="text-rose-600" /> Capstone Projects
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
                                    <button className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-500/20 transition-all transform hover:-translate-y-1 mb-4 flex items-center justify-center gap-2">
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
                                        <a href="mailto:nnikhiln2002@gmail.com?subject=Inquiry%20about%20Cyber%20Security%20Internship&body=Hello%20Team%2C%0A%0AI%20am%20interested%20in%20the%20Cyber%20Security%20Internship%20Program.%20Please%20provide%20more%20details%20regarding%20the%20enrollment%20process.%0A%0AThanks" className="block w-full text-center bg-white text-slate-900 font-bold py-3 rounded-xl hover:bg-rose-50 transition-colors text-sm">
                                            Book Free Session
                                        </a>
                                    </div>
                                    <div className="absolute bottom-[-20%] right-[-20%] w-32 h-32 bg-rose-500 rounded-full blur-3xl opacity-20"></div>
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

export default CyberSecurity;
