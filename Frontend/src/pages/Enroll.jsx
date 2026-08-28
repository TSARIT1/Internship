import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { enrollStudent, loginStudent } from '../services/studentApi';
import { ArrowLeft, User, Mail, Phone, BookOpen, Send, CheckCircle, Lock, Sparkles, Tag, ShieldCheck } from 'lucide-react';
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
        course: 'Data Science',
        otherDomain: '',
        password: '',
        confirmPassword: '',
        couponCode: 'TSAR2026'
    });

    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const courses = [
        "Data Science",
        "Machine Learning",
        "AI & Generative AI",
        "MERN Stack",
        "Java Full Stack",
        "Python Programming",
        "AWS Cloud Computing",
        "DevOps Engineering",
        "Cyber Security",
        "Other (Specify Below)"
    ];

    useEffect(() => {
        const student = JSON.parse(sessionStorage.getItem('student') || 'null');
        if (student) {
            setFormData(prev => ({
                ...prev,
                name: prev.name || student.name || student.username || '',
                email: prev.email || student.email || '',
                phone: prev.phone || student.phone || '',
            }));
        }

        if (courseParam) {
            // Find closest matching course
            const found = courses.find(c => c.toLowerCase() === courseParam.toLowerCase() || courseParam.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(courseParam.toLowerCase()));
            setFormData(prev => ({ ...prev, course: found || courseParam }));
        }
    }, [courseParam]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg('');

        if (formData.password && formData.password !== formData.confirmPassword) {
            setErrorMsg("Passwords do not match!");
            setIsSubmitting(false);
            return;
        }

        if (formData.password && formData.password.length < 6) {
            setErrorMsg("Password must be at least 6 characters long.");
            setIsSubmitting(false);
            return;
        }

        try {
            const finalCourse = formData.course === 'Other (Specify Below)' && formData.otherDomain?.trim()
                ? `Other: ${formData.otherDomain.trim()}`
                : formData.course;

            const res = await enrollStudent({ ...formData, course: finalCourse });
            if (res && res.success === false) {
                setErrorMsg(res.message || "Registration failed. Please check your details.");
                setIsSubmitting(false);
                return;
            }

            // Auto-login if registration succeeded
            try {
                const loginRes = await loginStudent(formData.email, formData.password);
                if (loginRes && loginRes.success) {
                    const userData = loginRes.data.user || loginRes.data;
                    sessionStorage.setItem('student', JSON.stringify(userData));
                }
            } catch (loginErr) {
                console.warn("Auto-login post enrollment error:", loginErr);
            }

            setSubmitted(true);

            setTimeout(() => {
                navigate('/studentdashboard');
            }, 2000);
        } catch (error) {
            console.error("Enrollment failed:", error);
            setErrorMsg(error.response?.data?.message || error.message || "Enrollment failed. Please try again or call +91 9491301258 / +91 8142616767");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
            <Header />

            <div className="pt-32 pb-20 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-2xl mx-auto">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mb-6 font-semibold text-xs uppercase tracking-wider cursor-pointer"
                        >
                            <ArrowLeft size={16} className="mr-1.5" /> Back
                        </button>

                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase mb-3">
                                <Sparkles size={13} className="text-amber-500" />
                                <span>2026 Batch Admissions</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight font-display">
                                Enroll in <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">TSAR IT INTERNSHIP</span>
                            </h1>
                            <p className="text-slate-600 text-sm sm:text-base">
                                Join 5,000+ students building production systems with 1-on-1 industry mentorship.
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 md:p-10 relative overflow-hidden">
                            {submitted ? (
                                <div className="text-center py-10 space-y-4 animate-fadeIn">
                                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-600/20">
                                        <CheckCircle size={44} />
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900">Enrollment Successful! 🎉</h2>
                                    <p className="text-sm text-slate-600 max-w-sm mx-auto">
                                        Your account has been created. Redirecting to your <strong>Student Portal</strong>...
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {errorMsg && (
                                        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                                            {errorMsg}
                                        </div>
                                    )}

                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                            Full Name *
                                        </label>
                                        <div className="relative">
                                            <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                placeholder="e.g. Rahul Sharma"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:outline-none bg-slate-50 focus:bg-white transition-all text-slate-900"
                                            />
                                        </div>
                                    </div>

                                    {/* Email & Phone */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                                Email Address *
                                            </label>
                                            <div className="relative">
                                                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    required
                                                    placeholder="rahul@gmail.com"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:outline-none bg-slate-50 focus:bg-white transition-all text-slate-900"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                                Phone / WhatsApp *
                                            </label>
                                            <div className="relative">
                                                <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    required
                                                    placeholder="+91 98765 43210"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:outline-none bg-slate-50 focus:bg-white transition-all text-slate-900"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Course & Promo Code */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                                Select Tech Domain *
                                            </label>
                                            <div className="relative">
                                                <BookOpen size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                                <select
                                                    name="course"
                                                    value={formData.course}
                                                    onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:outline-none bg-slate-50 focus:bg-white transition-all text-slate-900 cursor-pointer"
                                                >
                                                    {courses.map((c, i) => (
                                                        <option key={i} value={c}>{c}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                                Scholarship Coupon Code
                                            </label>
                                            <div className="relative">
                                                <Tag size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="text"
                                                    name="couponCode"
                                                    value={formData.couponCode}
                                                    onChange={handleChange}
                                                    placeholder="TSAR2026"
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-teal-300 text-sm font-bold text-teal-800 focus:border-blue-600 focus:outline-none bg-teal-50/50 uppercase transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Custom Domain Input if 'Other' */}
                                    {formData.course === 'Other (Specify Below)' && (
                                        <div className="animate-fadeIn">
                                            <label className="block text-xs font-bold uppercase tracking-wider text-blue-700 mb-1.5">
                                                Specify Your Preferred Domain *
                                            </label>
                                            <input
                                                type="text"
                                                name="otherDomain"
                                                required
                                                placeholder="e.g. Flutter Mobile, UI/UX Design, Data Engineering"
                                                value={formData.otherDomain || ''}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-blue-200 text-sm focus:border-blue-600 focus:outline-none bg-blue-50/40 text-slate-900 transition-all placeholder:text-slate-400"
                                            />
                                        </div>
                                    )}

                                    {/* Password & Confirm Password */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                                Create Password *
                                            </label>
                                            <div className="relative">
                                                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="password"
                                                    name="password"
                                                    required
                                                    placeholder="••••••••"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:outline-none bg-slate-50 focus:bg-white transition-all text-slate-900"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                                                Confirm Password *
                                            </label>
                                            <div className="relative">
                                                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    required
                                                    placeholder="••••••••"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:outline-none bg-slate-50 focus:bg-white transition-all text-slate-900"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm uppercase tracking-wider py-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-2 disabled:opacity-60 cursor-pointer"
                                    >
                                        {isSubmitting ? (
                                            <span>Processing Registration...</span>
                                        ) : (
                                            <>
                                                <Send size={18} />
                                                <span>Complete Enrollment & Access LMS</span>
                                            </>
                                        )}
                                    </button>

                                    <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2">
                                        <ShieldCheck size={16} className="text-teal-600" />
                                        <span>Instant LMS Access & Verified Technical Certificate Guarantee</span>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Enroll;
