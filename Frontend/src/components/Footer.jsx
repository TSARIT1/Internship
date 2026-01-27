import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const Footer = () => {
    return (
        <footer id="contact" className="bg-slate-950 text-slate-300 py-16 border-t border-slate-900 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand & Newsletter */}
                    <div className="lg:col-span-1">
                        <div className="text-3xl font-bold font-display text-white mb-6 tracking-tight">
                            TSAR<span className="text-blue-500">.IT</span>
                        </div>
                        <p className="text-slate-400 mb-6 leading-relaxed text-sm">
                            Empowering the next generation of tech leaders through industry-focused internships and training.
                        </p>

                        <div className="mb-6">
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Subscribe to our newsletter</h4>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="bg-slate-900 border border-slate-800 text-white px-4 py-2.5 rounded-lg text-sm w-full focus:outline-none focus:border-blue-500 transition-colors"
                                />
                                <button className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-lg transition-colors">
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-all duration-300">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-sky-500 hover:border-sky-500 hover:text-white transition-all duration-300">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-pink-600 hover:border-pink-600 hover:text-white transition-all duration-300">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-blue-700 hover:border-blue-700 hover:text-white transition-all duration-300">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Company</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/" className="text-slate-400 hover:text-blue-400 transition-colors">Home</Link></li>
                            <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">About Us</a></li>
                            <li><a href="/#internships" className="text-slate-400 hover:text-blue-400 transition-colors">Internships</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Careers</a> <span className="text-xs bg-slate-800 text-blue-400 px-2 py-0.5 rounded ml-2">Hiring</span></li>
                            <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Programs */}
                    <div>
                        <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Trending Programs</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link to="/data-science" className="text-slate-400 hover:text-blue-400 transition-colors">Data Science</Link></li>
                            <li><Link to="/machine-learning" className="text-slate-400 hover:text-blue-400 transition-colors">Machine Learning</Link></li>
                            <li><Link to="/mern-stack" className="text-slate-400 hover:text-blue-400 transition-colors">Full Stack Web Dev</Link></li>
                            <li><a href="/JavaFullStack" className="text-slate-400 hover:text-blue-400 transition-colors">Java Enterprise</a></li>
                            <li><a href="/CyberSecurity" className="text-slate-400 hover:text-blue-400 transition-colors">CyberSecurity</a></li>
                            <li><Link to="/aws-cloud-computing" className="text-slate-400 hover:text-blue-400 transition-colors">Cloud Computing</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Get in Touch</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-4">
                                <MapPin className="text-blue-500 shrink-0 mt-1" size={18} />
                                <span className="text-slate-400 leading-relaxed">
                                    12-203/745, CHURCH STREET,<br />
                                    NAKKABANDA, Punganur,<br />
                                    Madanapalle, AP - 517247
                                </span>
                            </li>
                            <li className="flex items-center gap-4">
                                <Mail className="text-blue-500 shrink-0" size={18} />
                                <a href="mailto:tsarit@tsaritservices.com" className="text-slate-400 hover:text-blue-400 transition-colors">tsarit@tsaritservices.com</a>
                            </li>
                            <li className="flex items-center gap-4">
                                <Phone className="text-blue-500 shrink-0" size={18} />
                                <span className="text-slate-400">+91 9579816694</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} TSAR-IT Pvt Ltd. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-blue-400 transition-colors">Cookie Settings</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
