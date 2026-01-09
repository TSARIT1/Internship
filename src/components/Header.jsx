import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#' },
        { name: 'Benefits', href: '#benefits' },
        { name: 'Internships', href: '#internships', hasDropdown: true },
        { name: 'Webinar', href: '#webinar' },
        { name: 'Hackathon', href: '#hackathon' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                <a href="#" className="flex items-center gap-2 group">
                    <div className="text-2xl font-bold font-display text-slate-800 tracking-tighter group-hover:scale-105 transition-transform">
                        TSAR<span className="text-primary">.IT</span>
                    </div>
                </a>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-slate-600 hover:text-primary transition-colors flex items-center gap-1"
                        >
                            {link.name}
                            {link.hasDropdown && <ChevronDown size={14} />}
                        </a>
                    ))}
                </nav>

                {/* Desktop Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-slate-700 font-medium hover:text-primary transition-colors"
                    >
                        Login
                    </button>
                    <button className="bg-secondary hover:bg-amber-600 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transform hover:-translate-y-0.5">
                        Enroll Now
                    </button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-slate-700"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-slate-700 font-medium py-2 border-b border-gray-100"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                            <div className="flex flex-col gap-3 mt-4">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full text-slate-700 font-medium py-2 border border-slate-200 rounded-lg"
                                >
                                    Login
                                </button>
                                <button className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg shadow-md">
                                    Enroll Now
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
