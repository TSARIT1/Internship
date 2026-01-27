import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
    const internships = [
        "Data Science",
        "Machine Learning",
        "AI",
        "MERN Stack",
        "DevOps",
        "Java Full-stack",
        "Python Programming",
        "AWS Cloud Computing",
        "Cyber Security"
    ];

    return (
        <div className="min-h-screen bg-slate-50 selection:bg-teal-100 selection:text-teal-900">
            <Header />

            <main className="pt-28 pb-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl lg:text-6xl font-bold font-display text-slate-900 mb-6">
                            Get in <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">Touch</span>
                        </h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Have questions about our internship programs? We're here to help you start your career journey.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 transform hover:-translate-y-1 transition-transform duration-300">
                                <h3 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 mb-1">Our Office</h4>
                                            <p className="text-slate-600">12-203/745, CHURCH STREET, NAKKABANDA, Punganur, Madanapalle, Chittoor- 517247, Andhra Pradesh</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="bg-teal-50 p-3 rounded-lg text-teal-600">
                                            <Mail size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 mb-1">Email Us</h4>
                                            <a href="mailto:tsarit@tsaritservices.com" className="text-slate-600 hover:text-blue-600 transition-colors">tsarit@tsaritservices.com</a>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="bg-purple-50 p-3 rounded-lg text-purple-600">
                                            <Phone size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 mb-1">Call Us</h4>
                                            <a href="tel:+919579816694" className="text-slate-600 hover:text-blue-600 transition-colors">+91 9579816694</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                            <h3 className="text-2xl font-bold text-slate-900 mb-8">Send us a Message</h3>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="mobile" className="block text-sm font-bold text-slate-700 mb-2">Mobile Number</label>
                                        <input
                                            type="tel"
                                            id="mobile"
                                            className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="internship" className="block text-sm font-bold text-slate-700 mb-2">Interested Internship</label>
                                    <div className="relative">
                                        <select
                                            id="internship"
                                            className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Select an internship...</option>
                                            {internships.map((item, index) => (
                                                <option key={index} value={item}>{item}</option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2">Your Message</label>
                                    <textarea
                                        id="message"
                                        rows="4"
                                        className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                                        placeholder="Tell us about your goals..."
                                    ></textarea>
                                </div>

                                <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                                    <Send size={20} /> Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;
