import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, X, ChevronDown, Phone, Sparkles, Brain, Database, Layout, Server, Coffee, Code, Cloud, Shield, Bot, ArrowRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ShinyButton from './ui/ShinyButton';
import LeadModal from './LeadModal';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
    const [leadModalOpen, setLeadModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const courseCategories = [
        {
            category: "Data & Artificial Intelligence",
            items: [
                { name: "Data Science", path: "/data-science", icon: Database, desc: "EDA, Pandas, ML Models & Tableau" },
                { name: "Machine Learning", path: "/machine-learning", icon: Brain, desc: "Neural Networks, Scikit & PyTorch" },
                { name: "AI & GenAI", path: "/ai", icon: Bot, desc: "LLMs, Prompt Engg & Deep Learning" },
            ]
        },
        {
            category: "Full Stack & Software Engineering",
            items: [
                { name: "MERN Full Stack", path: "/mern-stack", icon: Layout, desc: "React 19, Node.js, Express & MongoDB" },
                { name: "Java Enterprise Full Stack", path: "/java-full-stack", icon: Coffee, desc: "Spring Boot, Microservices & React" },
                { name: "Python Full Stack", path: "/python-programming", icon: Code, desc: "Django, FastAPI, Automation & APIs" },
            ]
        },
        {
            category: "Cloud, DevOps & Cyber Security",
            items: [
                { name: "AWS Cloud Computing", path: "/aws-cloud-computing", icon: Cloud, desc: "Solutions Architect, EC2, S3 & VPC" },
                { name: "DevOps Engineering", path: "/devops", icon: Server, desc: "CI/CD, Docker, Kubernetes & Terraform" },
                { name: "Cyber Security", path: "/cyber-security", icon: Shield, desc: "Ethical Hacking, SOC & Network Defense" },
            ]
        }
    ];

    const handleEnrollClick = () => {
        navigate('/enroll');
    };

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled 
                        ? 'bg-white/95 backdrop-blur-md shadow-lg py-3.5 border-b border-slate-200' 
                        : 'bg-white/90 backdrop-blur-md shadow-xs py-4 border-b border-slate-100/80'
                }`}
            >
                {/* Top Mini Bar for Contact Info */}
                <div className="hidden lg:block container mx-auto px-6 mb-2 text-xs text-slate-500">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
                        <div className="flex items-center gap-6">
                            <span className="flex items-center gap-1.5 font-medium text-slate-700">
                                <Sparkles size={13} className="text-amber-500" />
                                <span>ISO 9001:2015 Certified TSAR IT INTERNSHIP</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-5">
                            <a href="tel:+919491301258" className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 font-semibold transition-colors">
                                <Phone size={13} className="text-blue-600" />
                                <span>Helpline: +91 9491301258 / +91 8142616767</span>
                            </a>
                            <span>•</span>
                            <button
                                onClick={() => setLeadModalOpen(true)}
                                className="text-blue-600 hover:text-blue-700 font-bold hover:underline cursor-pointer"
                            >
                                Request Free Career Counseling
                            </button>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-6 flex items-center justify-between">
                    {/* Brand Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
                            TS
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl sm:text-2xl font-black font-display text-slate-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors">
                                TSAR <span className="text-blue-600">IT</span>
                            </span>
                            <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-500">
                                INTERNSHIP
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                        <Link to="/" className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors">
                            Home
                        </Link>

                        {/* Courses Mega Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setCoursesDropdownOpen(true)}
                            onMouseLeave={() => setCoursesDropdownOpen(false)}
                        >
                            <button className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors flex items-center gap-1 py-2 cursor-pointer">
                                <span>Internships & Courses</span>
                                <ChevronDown size={15} className={`transition-transform duration-200 ${coursesDropdownOpen ? 'rotate-180 text-blue-600' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {coursesDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full -left-20 w-[720px] bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 z-50 grid grid-cols-3 gap-6"
                                    >
                                        {courseCategories.map((cat, idx) => (
                                            <div key={idx} className="space-y-3">
                                                <h5 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">
                                                    {cat.category}
                                                </h5>
                                                <div className="space-y-1.5">
                                                    {cat.items.map((item, itemIdx) => {
                                                        const IconComp = item.icon;
                                                        return (
                                                            <Link
                                                                key={itemIdx}
                                                                to={item.path}
                                                                onClick={() => setCoursesDropdownOpen(false)}
                                                                className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 group transition-all"
                                                            >
                                                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                                    <IconComp size={16} />
                                                                </div>
                                                                <div>
                                                                    <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                                        {item.name}
                                                                    </div>
                                                                    <p className="text-[10px] text-slate-500 line-clamp-1">
                                                                        {item.desc}
                                                                    </p>
                                                                </div>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}

                                        {/* Bottom Action inside Dropdown */}
                                        <div className="col-span-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-3xl">
                                            <span className="text-slate-600 font-medium">
                                                Looking for a custom university or corporate batch?
                                            </span>
                                            <button
                                                onClick={() => {
                                                    setCoursesDropdownOpen(false);
                                                    setLeadModalOpen(true);
                                                }}
                                                className="text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                                            >
                                                <span>Talk to Dean of Admissions</span>
                                                <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <a href="/#benefits" className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors">
                            Advantages
                        </a>
                        <Link to="/webinars" className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors">
                            Webinars
                        </Link>
                        <Link to="/hackathons" className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors">
                            Hackathons
                        </Link>
                        <Link to="/contact" className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors">
                            Contact
                        </Link>

                        {sessionStorage.getItem('token') && (
                            <Link
                                to="/studentdashboard"
                                className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200"
                            >
                                <User size={14} />
                                <span>Dashboard</span>
                            </Link>
                        )}
                    </nav>

                    {/* Desktop Right Action Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={() => setLeadModalOpen(true)}
                            className="text-xs font-bold text-slate-700 hover:text-blue-600 px-3.5 py-2 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
                        >
                            Free Counseling
                        </button>

                        {sessionStorage.getItem('token') && sessionStorage.getItem('student') ? (
                            <button
                                onClick={() => {
                                    sessionStorage.clear();
                                    navigate('/login');
                                }}
                                className="text-xs font-bold text-red-600 hover:text-red-700 px-3 py-2 rounded-xl border border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="text-xs font-bold text-slate-700 hover:text-blue-600 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                                Student Login
                            </button>
                        )}

                        <ShinyButton
                            onClick={handleEnrollClick}
                            className="!py-2.5 !px-5 text-xs font-bold"
                        >
                            Enroll Now
                        </ShinyButton>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-slate-800 p-2 rounded-lg hover:bg-slate-100"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle Menu"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu Slideout */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-white border-t border-slate-200 shadow-2xl overflow-hidden"
                        >
                            <div className="flex flex-col p-6 gap-3">
                                <Link to="/" className="text-slate-900 font-bold py-2 border-b border-slate-100" onClick={() => setMobileMenuOpen(false)}>
                                    Home
                                </Link>
                                <a href="/#internships" className="text-slate-900 font-bold py-2 border-b border-slate-100" onClick={() => setMobileMenuOpen(false)}>
                                    All Tech Courses & Internships
                                </a>
                                <Link to="/webinars" className="text-slate-900 font-bold py-2 border-b border-slate-100" onClick={() => setMobileMenuOpen(false)}>
                                    Webinars
                                </Link>
                                <Link to="/hackathons" className="text-slate-900 font-bold py-2 border-b border-slate-100" onClick={() => setMobileMenuOpen(false)}>
                                    Hackathons
                                </Link>
                                <Link to="/contact" className="text-slate-900 font-bold py-2 border-b border-slate-100" onClick={() => setMobileMenuOpen(false)}>
                                    Contact & Support
                                </Link>

                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        setLeadModalOpen(true);
                                    }}
                                    className="w-full py-3 text-blue-600 font-bold border border-blue-200 rounded-xl bg-blue-50 text-sm mt-2"
                                >
                                    Book Free Career Counseling
                                </button>

                                {sessionStorage.getItem('token') ? (
                                    <button
                                        onClick={() => {
                                            sessionStorage.clear();
                                            setMobileMenuOpen(false);
                                            navigate('/login');
                                        }}
                                        className="w-full text-red-600 font-bold py-3 border border-red-200 rounded-xl hover:bg-red-50 text-sm"
                                    >
                                        Logout
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            navigate('/login');
                                        }}
                                        className="w-full text-slate-800 font-bold py-3 border border-slate-200 rounded-xl hover:bg-slate-50 text-sm"
                                    >
                                        Student Login
                                    </button>
                                )}

                                <ShinyButton
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        handleEnrollClick();
                                    }}
                                    className="w-full !rounded-xl text-center justify-center !py-3"
                                >
                                    Enroll Now
                                </ShinyButton>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Universal Lead Generation Modal */}
            <LeadModal
                isOpen={leadModalOpen}
                onClose={() => setLeadModalOpen(false)}
                title="Book Free 1-on-1 Career Counseling & Syllabus"
            />
        </>
    );
};

export default Header;
