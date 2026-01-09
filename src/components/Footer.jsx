import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer id="contact" className="bg-slate-900 text-slate-300 py-16">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand */}
                    <div>
                        <div className="text-2xl font-bold font-display text-white mb-6">
                            TSAR<span className="text-blue-500">.IT</span>
                        </div>
                        <p className="text-slate-400 mb-6 leading-relaxed">
                            Empowering the next generation of tech leaders through industry-focused internships and training.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 transition-colors">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-500 transition-colors">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-600 transition-colors">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-700 transition-colors">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-6 text-lg">Quick Links</h3>
                        <ul className="space-y-4">
                            <li><Link to="Home" className="hover:text-blue-400 transition-colors">Home</Link></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>

                            <li><a href="/#internships" className="hover:text-blue-400 transition-colors">Internships</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Verify Certificate</a></li>
                            <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>

                    {/* Programs */}
                    <div>
                        <h3 className="text-white font-bold mb-6 text-lg">Programs</h3>
                        <ul className="space-y-4">
                            <li><Link to="/data-science" className="hover:text-blue-400 transition-colors">Data Science</Link></li>
                            <li><Link to="/machine-learning" className="hover:text-blue-400 transition-colors">Machine Learning</Link></li>
                            <li><Link to="/ai" className="hover:text-blue-400 transition-colors">AI</Link></li>
                            <li><Link to="/mern-stack" className="hover:text-blue-400 transition-colors">Web Development</Link></li>
                            <li><a href="/JavaFullStack" className="hover:text-blue-400 transition-colors">Java Full-stack</a></li>
                            <li><a href="/CyberSecurity" className="hover:text-blue-400 transition-colors">CyberSecurity</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-bold mb-6 text-lg">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="text-blue-500 shrink-0 mt-1" size={18} />
                                <span>12-203/745, CHURCH STREET, NAKKABANDA, Punganur, Madanapalle, Chittoor- 517247, Andhra Pradesh</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <EmailLink email="tsarit@tsaritservices.com" />
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="text-blue-500 shrink-0" size={18} />
                                <span>+91 9579816694</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
                    &copy; {new Date().getFullYear()} TSAR-IT Pvt Ltd. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

const EmailLink = ({ email }) => (
    <>
        <Mail className="text-blue-500 shrink-0" size={18} />
        <a href={`mailto:${email}`} className="hover:text-blue-400 transition-colors">{email}</a>
    </>
);

export default Footer;
