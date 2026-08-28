import React, { useState } from 'react';
import { X, CheckCircle, Sparkles, Send, Phone, Mail, User, BookOpen, GraduationCap, ShieldCheck, MessageCircle, ExternalLink, ArrowRight } from 'lucide-react';
import { sendContactMessage } from '../services/studentApi';

const LeadModal = ({ isOpen, onClose, defaultCourse = 'Data Science', title = 'Get Free Career Counseling & Syllabus' }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        course: defaultCourse,
        otherDomain: '',
        experience: 'College Student (Final Year)',
        message: ''
    });

    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [errorMsg, setErrorMsg] = useState('');

    if (!isOpen) return null;

    const courses = [
        "Data Science",
        "Machine Learning",
        "AI & Generative AI",
        "MERN Stack Web Development",
        "Java Full Stack Enterprise",
        "Python Programming & Backend",
        "AWS Cloud Computing & DevOps",
        "DevOps Engineering (Docker, K8s)",
        "Cyber Security & Ethical Hacking",
        "Full Stack Development (General)",
        "Other (Specify Below)"
    ];

    const WHATSAPP_NUMBER = "919491301258";

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const getFinalCourseName = () => {
        if (formData.course === 'Other (Specify Below)' && formData.otherDomain.trim()) {
            return `Other: ${formData.otherDomain.trim()}`;
        }
        return formData.course;
    };

    const getWhatsAppUrl = () => {
        const finalCourse = getFinalCourseName();
        const studentName = formData.name.trim() || 'Student';
        const msg = encodeURIComponent(
            `Hello TSAR IT Admissions, My name is ${studentName}. I am interested in the ${finalCourse} Internship Program (2026 Batch). Please share the syllabus and counseling details.`
        );
        return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
    };

    const handleDirectWhatsApp = () => {
        window.open(getWhatsAppUrl(), '_blank');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');

        const finalCourse = getFinalCourseName();

        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                course: finalCourse,
                subject: `Lead: ${finalCourse} (${formData.experience})`,
                message: `Phone: ${formData.phone}\nCourse: ${finalCourse}\nStatus: ${formData.experience}\nNote: ${formData.message || 'Requested free counseling & syllabus.'}`
            };

            const res = await sendContactMessage(payload);
            if (res.success) {
                setStatus('success');
            } else {
                setStatus('error');
                setErrorMsg(res.message || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            setStatus('error');
            setErrorMsg('Unable to submit inquiry. Please contact us directly on WhatsApp (+91 9491301258) or call +91 8142616767');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn font-sans">
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
                {/* Clean Light Header Banner */}
                <div className="bg-gradient-to-b from-blue-50/90 via-white to-white p-6 sm:p-7 border-b border-slate-100 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                        aria-label="Close Modal"
                    >
                        <X size={18} />
                    </button>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-extrabold uppercase tracking-wider mb-2.5">
                        <Sparkles size={12} className="text-amber-500" />
                        <span>TSAR IT INTERNSHIP • 2026 Batch</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display tracking-tight leading-tight">
                        {title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                        Connect with senior mentors & download our module-by-module 2026 curriculum pack.
                    </p>
                </div>

                {/* Form Body */}
                <div className="p-6 sm:p-7">
                    {status === 'success' ? (
                        <div className="py-6 text-center space-y-4 animate-fadeIn">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md border border-emerald-200">
                                <CheckCircle size={36} />
                            </div>

                            <div>
                                <h4 className="text-2xl font-black text-slate-900 font-display">Counseling Request Received!</h4>
                                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto mt-1.5 leading-relaxed">
                                    Thank you <strong>{formData.name || 'Applicant'}</strong>. Our admissions advisor will contact you within <strong>15 minutes</strong> with the syllabus & scholarship confirmation.
                                </p>
                            </div>

                            <div className="p-3 text-xs font-bold text-emerald-800 bg-emerald-50 rounded-2xl border border-emerald-200 max-w-sm mx-auto">
                                🎉 Scholarship Promo Code <span className="font-mono text-emerald-950 font-black">TSAR2026</span> applied to your profile!
                            </div>

                            {/* Direct WhatsApp Action */}
                            <div className="pt-2">
                                <button
                                    onClick={handleDirectWhatsApp}
                                    className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <MessageCircle size={18} className="fill-white" />
                                    <span>Chat Now with Admissions Advisor (+91 9491301258)</span>
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full mt-2.5 py-2 text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                                >
                                    Close Window
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                            {status === 'error' && (
                                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                                    {errorMsg}
                                </div>
                            )}

                            <div>
                                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                                    Full Name *
                                </label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Rahul Sharma"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-blue-600 transition-all placeholder:text-slate-400 text-xs sm:text-sm font-medium"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="rahul@example.com"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-blue-600 transition-all placeholder:text-slate-400 text-xs sm:text-sm font-medium"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                                        WhatsApp / Phone *
                                    </label>
                                    <div className="relative">
                                        <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+91 9491301258"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-blue-600 transition-all placeholder:text-slate-400 text-xs sm:text-sm font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                                        Interested Domain *
                                    </label>
                                    <div className="relative">
                                        <BookOpen size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        <select
                                            name="course"
                                            value={formData.course}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-blue-600 transition-all text-xs sm:text-sm font-medium cursor-pointer"
                                        >
                                            {courses.map((c, i) => (
                                                <option key={i} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                                        Current Status *
                                    </label>
                                    <div className="relative">
                                        <GraduationCap size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        <select
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-blue-600 transition-all text-xs sm:text-sm font-medium cursor-pointer"
                                        >
                                            <option value="College Student (Final Year)">Final Year Student</option>
                                            <option value="College Student (1st-3rd Year)">1st-3rd Year Student</option>
                                            <option value="Recent Graduate (0-1 yr)">Recent Graduate</option>
                                            <option value="Working Professional">Working Professional</option>
                                            <option value="Career Switcher">Career Switcher</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Conditional Custom Domain Input if 'Other' is chosen */}
                            {formData.course === 'Other (Specify Below)' && (
                                <div className="animate-fadeIn">
                                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-blue-700 mb-1">
                                        Specify Your Preferred Tech Domain *
                                    </label>
                                    <input
                                        type="text"
                                        name="otherDomain"
                                        required
                                        value={formData.otherDomain}
                                        onChange={handleChange}
                                        placeholder="e.g. UI/UX Design, Flutter Mobile, Data Engineering, QA Testing"
                                        className="w-full px-4 py-2.5 rounded-xl border-2 border-blue-200 text-slate-900 bg-blue-50/30 focus:bg-white focus:outline-none focus:border-blue-600 transition-all placeholder:text-slate-400 text-xs sm:text-sm font-medium"
                                    />
                                </div>
                            )}

                            {/* Dual CTAs: Submit & WhatsApp */}
                            <div className="pt-1 space-y-2.5">
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                                >
                                    {status === 'loading' ? (
                                        <span>Submitting...</span>
                                    ) : (
                                        <>
                                            <Send size={15} />
                                            <span>Request Free Callback & Syllabus</span>
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleDirectWhatsApp}
                                    className="w-full py-3 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <MessageCircle size={16} className="text-emerald-600 fill-emerald-600" />
                                    <span>Or Connect on WhatsApp (+91 9491301258)</span>
                                </button>
                            </div>

                            <div className="flex items-center justify-center gap-3 pt-1 text-[11px] text-slate-500">
                                <span className="flex items-center gap-1">
                                    <ShieldCheck size={13} className="text-teal-600" /> 100% Privacy Guaranteed
                                </span>
                                <span>•</span>
                                <span>No Spam Calls</span>
                                <span>•</span>
                                <span>Direct WhatsApp Assistance</span>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeadModal;
