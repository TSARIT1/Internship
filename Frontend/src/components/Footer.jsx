import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, Send } from 'lucide-react';
import { sendContactMessage } from '../services/studentApi';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;

        try {
            await sendContactMessage({
                name: 'Newsletter Subscriber',
                email: email,
                subject: 'Newsletter Subscription',
                message: `User ${email} subscribed to TSAR IT INTERNSHIP newsletter.`
            });
            setSubscribed(true);
            setEmail('');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <footer id="contact" className="bg-slate-950 text-slate-300 py-16 border-t border-slate-900 relative overflow-hidden font-sans">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:30px_30px] opacity-15 pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">

                    {/* Brand & Mission (Col 1-2) */}
                    <div className="lg:col-span-2 space-y-5">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-600/30">
                                TS
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black font-display text-white tracking-tight leading-none">
                                    TSAR <span className="text-blue-500">IT</span>
                                </span>
                                <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400">
                                    INTERNSHIP
                                </span>
                            </div>
                        </Link>

                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                            TSAR IT INTERNSHIP is a premier technical training & internship organization empowering engineering students and professionals with hands-on development experience, industry capstone projects, and guaranteed placement assistance.
                        </p>

                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <ShieldCheck size={16} className="text-teal-400" />
                            <span>Govt. of India MSME Registered IT Organization</span>
                        </div>

                        {/* Newsletter Lead Form */}
                        <div className="pt-2">
                            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                                Subscribe for 2026 Batch Notifications & Free Workshops
                            </h5>
                            {subscribed ? (
                                <div className="text-xs text-emerald-400 flex items-center gap-1.5 py-2 font-semibold">
                                    <CheckCircle2 size={15} />
                                    <span>Thank you for subscribing! Check your email for free resources.</span>
                                </div>
                            ) : (
                                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                                    <input
                                        type="email"
                                        required
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="bg-slate-900 border border-slate-800 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm w-full focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                                        aria-label="Subscribe"
                                    >
                                        <Send size={15} />
                                    </button>
                                </form>
                            )}
                        </div>

                        <div className="flex gap-3 pt-2">
                            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                                <Facebook size={16} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all">
                                <Twitter size={16} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all">
                                <Instagram size={16} />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-blue-700 hover:text-white transition-all">
                                <Linkedin size={16} />
                            </a>
                        </div>
                    </div>

                    {/* All Tech Courses (Col 3) */}
                    <div>
                        <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-widest border-b border-slate-800 pb-2">
                            Data & Web Tracks
                        </h4>
                        <ul className="space-y-2.5 text-xs sm:text-sm">
                            <li><Link to="/data-science" className="text-slate-400 hover:text-blue-400 transition-colors">Data Science & AI</Link></li>
                            <li><Link to="/machine-learning" className="text-slate-400 hover:text-blue-400 transition-colors">Machine Learning</Link></li>
                            <li><Link to="/ai" className="text-slate-400 hover:text-blue-400 transition-colors">AI & Generative AI</Link></li>
                            <li><Link to="/mern-stack" className="text-slate-400 hover:text-blue-400 transition-colors">MERN Full Stack Dev</Link></li>
                            <li><Link to="/java-full-stack" className="text-slate-400 hover:text-blue-400 transition-colors">Java Enterprise Dev</Link></li>
                            <li><Link to="/python-programming" className="text-slate-400 hover:text-blue-400 transition-colors">Python Programming</Link></li>
                        </ul>
                    </div>

                    {/* Cloud & Security Tracks (Col 4) */}
                    <div>
                        <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-widest border-b border-slate-800 pb-2">
                            Cloud & Security
                        </h4>
                        <ul className="space-y-2.5 text-xs sm:text-sm">
                            <li><Link to="/aws-cloud-computing" className="text-slate-400 hover:text-blue-400 transition-colors">AWS Cloud Computing</Link></li>
                            <li><Link to="/devops" className="text-slate-400 hover:text-blue-400 transition-colors">DevOps Engineering</Link></li>
                            <li><Link to="/cyber-security" className="text-slate-400 hover:text-blue-400 transition-colors">Cyber Security & Hacking</Link></li>
                            <li><Link to="/webinars" className="text-slate-400 hover:text-blue-400 transition-colors">Free Live Webinars</Link></li>
                            <li><Link to="/hackathons" className="text-slate-400 hover:text-blue-400 transition-colors">Coding Hackathons</Link></li>
                            <li><Link to="/enroll" className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors">Apply for 2026 Batch</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info (Col 5) */}
                    <div>
                        <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-widest border-b border-slate-800 pb-2">
                            Headquarters
                        </h4>
                        <ul className="space-y-3.5 text-xs sm:text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="text-blue-500 shrink-0 mt-1" size={16} />
                                <span className="text-slate-400 leading-relaxed text-xs">
                                    TSAR IT INTERNSHIP,<br />
                                    12-203/745, Church Street,<br />
                                    Nakkabanda, Punganur, Madanapalle, AP - 517247
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="text-blue-500 shrink-0" size={16} />
                                <a href="mailto:info@tsaritservices.com" className="text-slate-400 hover:text-blue-400 transition-colors text-xs font-semibold">
                                    info@tsaritservices.com
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone className="text-blue-500 shrink-0 mt-0.5" size={16} />
                                <div className="flex flex-col gap-1 text-xs">
                                    <a href="tel:+919491301258" className="text-slate-400 hover:text-blue-400 transition-colors font-semibold">
                                        +91 9491301258
                                    </a>
                                    <a href="tel:+918142616767" className="text-slate-400 hover:text-blue-400 transition-colors font-semibold">
                                        +91 8142616767
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs">
                    <p>&copy; 2026 TSAR IT INTERNSHIP (TSAR IT  Pvt Ltd). All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link to="/verify-certificate" className="hover:text-blue-400 transition-colors font-semibold text-slate-400">Verify Certificate</Link>
                        <Link to="/" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
                        <Link to="/" className="hover:text-blue-400 transition-colors">Terms & Refund Policy</Link>
                        <Link to="/contact" className="hover:text-blue-400 transition-colors">Student Grievance</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
