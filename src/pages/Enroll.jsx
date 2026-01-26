import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { enrollStudent } from '../services/studentApi';
import { ArrowLeft, User, Mail, Phone, BookOpen, Send, CheckCircle, Lock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Enroll = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const courseParam = searchParams.get('course');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        course: '',
        password: '',
        confirmPassword: ''
    });

    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (courseParam) {
            setFormData(prev => ({ ...prev, course: courseParam }));
        }
    }, [courseParam]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            setIsSubmitting(false);
            return;
        }

        try {
            await enrollStudent(formData);
            setSubmitted(true);

            setTimeout(() => {
                setSubmitted(false);
                navigate('/');
            }, 3000);
        } catch (error) {
            console.error("Enrollment failed:", error);
            alert("Enrollment failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const courses = [
        "Data Science",
        "Machine Learning",
        "AI",
        "MERN Stack",
        "DevOps",
        "Java Full Stack",
        "Python Programming",
        "AWS Cloud Computing",
        "Cyber Security"
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
            <Header />

            <div className="pt-24 pb-12 relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-2xl mx-auto">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-8 font-medium"
                        >
                            <ArrowLeft size={18} className="mr-2" /> Back
                        </button>

                        <div className="text-center mb-10">
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                                Create Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Account</span>
                            </h1>
                            <p className="text-slate-500 text-lg">
                                Fill out the form below to enroll in our premium courses.
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-10 relative overflow-hidden">
                            {submitted ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle size={40} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Registration Successful!</h2>
                                    <p className="text-slate-500 mb-6">Our team will contact you shortly.</p>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-slate-800 transition-colors"
                                    >
                                        Return Home
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                                <User size={20} />
                                            </div>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                required
                                                placeholder="John Doe"
                                                className="w-full bg-slate-50 text-slate-900 pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400"
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                                <Mail size={20} />
                                            </div>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                placeholder="john@example.com"
                                                className="w-full bg-slate-50 text-slate-900 pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="text-sm font-semibold text-slate-700 ml-1">Phone Number</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                                <Phone size={20} />
                                            </div>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                required
                                                placeholder="+91 98765 43210"
                                                className="w-full bg-slate-50 text-slate-900 pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400"
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>



                                    <div className="space-y-2">
                                        <label htmlFor="password" className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                                <Lock size={20} />
                                            </div>
                                            <input
                                                type="password"
                                                id="password"
                                                name="password"
                                                required
                                                placeholder="••••••••"
                                                className="w-full bg-slate-50 text-slate-900 pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400"
                                                value={formData.password}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700 ml-1">Confirm Password</label>
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                                <Lock size={20} />
                                            </div>
                                            <input
                                                type="password"
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                required
                                                placeholder="••••••••"
                                                className="w-full bg-slate-50 text-slate-900 pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium placeholder:text-slate-400"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 mt-4 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {isSubmitting ? 'Processing...' : 'Register'} {!isSubmitting && <Send size={18} />}
                                    </button>
                                </form>
                            )}
                        </div>

                        <p className="text-center text-slate-400 text-sm mt-8">
                            By enrolling, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Enroll;
