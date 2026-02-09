import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ShinyButton from './ui/ShinyButton';

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
        { name: 'Home', href: '/' },
        { name: 'Benefits', href: '/#benefits' },
        { name: 'Internships', href: '/#internships', hasDropdown: true },
        { name: 'Webinar', href: '/webinars' },
        { name: 'Hackathon', href: '/#hackathon' },
        { name: 'Contact', href: '/contact' },
    ];

    const handleEnrollClick = () => {
        const token = localStorage.getItem('token');
        const student = JSON.parse(localStorage.getItem('student') || 'null');

        if (!token || !student) {
            navigate('/login');
        } else {
            navigate('/enroll');
        }
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4 border-b border-white/50' : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                <a href="#" className="flex items-center gap-2 group">
                    <div className="text-2xl font-bold font-display text-slate-900 tracking-tighter group-hover:scale-105 transition-transform">
                        TSAR<span className="text-blue-600">.IT</span>
                    </div>
                </a>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1"
                        >
                            {link.name}
                            {link.hasDropdown && <ChevronDown size={14} />}
                        </a>
                    ))}
                    {localStorage.getItem('token') && (
                        <a
                            href="/studentdashboard"
                            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1"
                        >
                            Dashboard
                        </a>
                    )}
                </nav>

                {/* Desktop Buttons */}
                <div className="hidden md:flex items-center gap-4">
                    {localStorage.getItem('token') && localStorage.getItem('student') ? (
                        <div className="flex items-center gap-4">
                            <span className="text-slate-700 font-semibold hidden lg:block">
                                Welcome, {JSON.parse(localStorage.getItem('student') || '{}').name?.split(' ')[0]}
                            </span>
                            <button
                                onClick={() => {
                                    localStorage.clear();
                                    navigate('/login');
                                }}
                                className="text-slate-700 font-semibold hover:text-red-600 transition-colors px-4 py-2"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            className="text-slate-700 font-semibold hover:text-blue-600 transition-colors px-4 py-2"
                        >
                            Login
                        </button>
                    )}
                    <ShinyButton
                        onClick={handleEnrollClick}
                        className="!py-2.5 !px-6"
                    >
                        Enroll Now
                    </ShinyButton>
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
                        className="md:hidden bg-white/95 backdrop-blur-md border-t border-slate-100 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-slate-800 font-semibold py-2 border-b border-slate-50"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                            {localStorage.getItem('token') ? (
                                <button
                                    onClick={() => {
                                        localStorage.clear();
                                        setMobileMenuOpen(false);
                                        navigate('/login');
                                    }}
                                    className="w-full text-red-600 font-bold py-3 border border-red-100 rounded-xl hover:bg-red-50 transition-colors"
                                >
                                    Logout
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full text-slate-700 font-bold py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    Login
                                </button>
                            )}
                            <ShinyButton
                                onClick={() => {
                                    handleEnrollClick();
                                    setMobileMenuOpen(false);
                                }}
                                className="w-full !rounded-xl"
                            >
                                Enroll Now
                            </ShinyButton>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </header >
    );
};

export default Header;
