import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useCoursePricing from '../hooks/usePricing';
import EnrollButton from '../components/EnrollButton';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadModal from '../components/LeadModal';
import WhatsAppButton from '../components/WhatsAppButton';
import AIChatWidget from '../components/AIChatWidget';
import ScrollButtons from '../components/ScrollButtons';
import SEO from '../components/SEO';

import {
    BookOpen, CheckCircle, ChevronDown, ChevronUp, Clock,
    Code, Database, Layout, Server, Award, Users,
    Zap, ArrowLeft, ArrowRight, Brain, Cloud, Shield,
    Download, Play, Star, Sparkles, Briefcase, CheckCircle2,
    ShieldCheck, HelpCircle, Phone, MessageCircle, Laptop, Calendar
} from 'lucide-react';

const CourseTemplate = ({ data }) => {
    const [openSection, setOpenSection] = useState(0);
    const [leadModalOpen, setLeadModalOpen] = useState(false);
    const [videoModalOpen, setVideoModalOpen] = useState(false);
    const [couponApplied, setCouponApplied] = useState(false);
    const [couponInput, setCouponInput] = useState('');

    const { totalFee, discount, finalFee, loading } = useCoursePricing(data.title, 19999, 9999);

    const effectiveFee = couponApplied ? Math.round(finalFee * 0.8) : finalFee;

    const handleApplyCoupon = (e) => {
        e.preventDefault();
        if (couponInput.trim().toUpperCase() === 'TSAR2026') {
            setCouponApplied(true);
        } else {
            alert('Invalid coupon code. Try "TSAR2026" for an instant 20% scholarship.');
        }
    };

    const courseSchema = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": `${data.title} Online Internship & Certification`,
        "description": data.description,
        "provider": {
            "@type": "Organization",
            "name": "TSAR IT INTERNSHIP",
            "sameAs": "https://tsaritservices.com"
        },
        "timeRequired": data.duration,
        "educationalLevel": data.level,
        "offers": {
            "@type": "Offer",
            "price": effectiveFee || 9999,
            "priceCurrency": "INR",
            "category": "Paid",
            "availability": "https://schema.org/InStock"
        },
        "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": "Online",
            "courseWorkload": data.duration
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900 font-sans">
            <SEO
                title={`${data.title} Internship & Certification`}
                description={`Enroll in ${data.title} Online Internship at TSAR IT. Real-world projects, live mentor classes, Govt. MSME certification, and 100% placement support.`}
                keywords={`${data.title}, ${data.title} online course, ${data.title} internship, TSAR IT ${data.title}, IT certification 2026, software internship`}
                canonicalUrl={`https://tsaritservices.com${data.slug || ''}`}
                schema={courseSchema}
            />
            <Header />

            {/* Breadcrumb Navigation */}
            <div className="bg-white text-slate-500 text-xs py-3 border-b border-slate-200 pt-28">
                <div className="container mx-auto px-6 flex items-center gap-2">
                    <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <span>/</span>
                    <a href="/#internships" className="hover:text-blue-600 transition-colors">Internships</a>
                    <span>/</span>
                    <span className="text-blue-600 font-bold">{data.title}</span>
                </div>
            </div>

            {/* Bright, Clean, Modern Light Hero */}
            <section className="bg-gradient-to-b from-white via-blue-50/30 to-slate-50 pt-10 pb-16 border-b border-slate-200/80 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c70a_1px,transparent_1px),linear-gradient(to_bottom,#0284c70a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        {/* Hero Text */}
                        <div className="flex-1 space-y-6 text-center lg:text-left">
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
                                    <Sparkles size={13} className="text-amber-500" />
                                    <span>2026 Industry Internship</span>
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                                    <ShieldCheck size={14} />
                                    <span>Govt. MSME Recognized Certification</span>
                                </span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-slate-900 leading-[1.15]">
                                {data.title} <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">Internship Program</span>
                            </h1>

                            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                {data.description}
                            </p>

                            {/* Quick Metadata Badges */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-1">
                                <div className="bg-white border border-slate-200 p-3.5 rounded-2xl text-center shadow-xs">
                                    <div className="text-xs text-slate-400 font-semibold">Duration</div>
                                    <div className="text-sm font-bold text-slate-900 mt-0.5">{data.duration}</div>
                                </div>
                                <div className="bg-white border border-slate-200 p-3.5 rounded-2xl text-center shadow-xs">
                                    <div className="text-xs text-slate-400 font-semibold">Skill Level</div>
                                    <div className="text-sm font-bold text-slate-900 mt-0.5">{data.level}</div>
                                </div>
                                <div className="bg-white border border-slate-200 p-3.5 rounded-2xl text-center shadow-xs">
                                    <div className="text-xs text-slate-400 font-semibold">Live Projects</div>
                                    <div className="text-sm font-bold text-teal-600 mt-0.5">4+ Capstones</div>
                                </div>
                                <div className="bg-white border border-slate-200 p-3.5 rounded-2xl text-center shadow-xs">
                                    <div className="text-xs text-slate-400 font-semibold">Placement</div>
                                    <div className="text-sm font-bold text-emerald-600 mt-0.5">100% Support</div>
                                </div>
                            </div>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                                <EnrollButton
                                    course={data.title}
                                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all hover:scale-105"
                                >
                                    <span>Enroll in Next Batch</span>
                                    <ArrowRight size={16} />
                                </EnrollButton>

                                <button
                                    onClick={() => setLeadModalOpen(true)}
                                    className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-800 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                                >
                                    <Download size={16} />
                                    <span>Download Full Syllabus (PDF)</span>
                                </button>
                            </div>
                        </div>

                        {/* Hero Visual Card / Video Preview */}
                        <div className="flex-1 w-full max-w-md lg:max-w-none">
                            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-900 group">
                                <img
                                    src={data.heroImage}
                                    alt={data.title}
                                    className="w-full h-[320px] sm:h-[380px] object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                                <div
                                    onClick={() => setVideoModalOpen(true)}
                                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                                >
                                    <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-600/50 group-hover:scale-110 transition-transform">
                                        <Play size={28} className="fill-white ml-1" />
                                    </div>
                                </div>

                                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-center justify-between text-xs text-white">
                                    <div>
                                        <span className="font-bold block">{data.title} Lab Preview</span>
                                        <span className="text-[11px] text-slate-300">Recorded Live Hands-on Class</span>
                                    </div>
                                    <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-400/30">
                                        Watch Video
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tools & Frameworks Covered */}
            {data.tools && data.tools.length > 0 && (
                <section className="py-8 bg-white border-b border-slate-200">
                    <div className="container mx-auto px-6 text-center">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                            Industry Frameworks & Tools Covered
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-2.5">
                            {data.tools.map((tool, idx) => (
                                <div
                                    key={idx}
                                    className="px-3.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-bold shadow-xs flex items-center gap-2 hover:border-blue-500 hover:bg-blue-50/50 transition-colors"
                                >
                                    <Code size={13} className="text-blue-600" />
                                    <span>{tool}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Main Content & Sticky Enrollment Sidebar */}
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left 2 Cols */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* 1. What You Will Master */}
                        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2.5 font-display">
                                <Zap className="text-amber-500" />
                                <span>Key Learning Outcomes</span>
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {data.outcomes?.map((outcome, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                                        <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                                        <span className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
                                            {outcome}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 2. Comprehensive Curriculum */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5 font-display">
                                        <BookOpen className="text-blue-600" />
                                        <span>Curriculum & Weekly Roadmap</span>
                                    </h2>
                                    <p className="text-slate-500 text-xs sm:text-sm mt-1">
                                        Practical modules structured by senior software architects
                                    </p>
                                </div>
                                <button
                                    onClick={() => setLeadModalOpen(true)}
                                    className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3.5 py-2 rounded-xl border border-blue-200 cursor-pointer"
                                >
                                    <Download size={14} />
                                    <span>Download PDF</span>
                                </button>
                            </div>

                            <div className="space-y-3.5">
                                {data.curriculum.map((section, idx) => (
                                    <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                                        <button
                                            onClick={() => setOpenSection(openSection === idx ? -1 : idx)}
                                            className={`w-full flex items-center justify-between p-5 text-left transition-colors cursor-pointer ${
                                                openSection === idx ? 'bg-blue-50/60 border-b border-blue-100' : 'hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3.5">
                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                                                    openSection === idx ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                                                }`}>
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <span className={`font-bold text-sm sm:text-base ${
                                                        openSection === idx ? 'text-blue-700' : 'text-slate-900'
                                                    }`}>
                                                        {section.title}
                                                    </span>
                                                    <span className="block text-[11px] text-slate-500 font-medium mt-0.5">
                                                        {section.duration} • Practical assignments included
                                                    </span>
                                                </div>
                                            </div>
                                            {openSection === idx ? (
                                                <ChevronUp size={20} className="text-blue-600 shrink-0" />
                                            ) : (
                                                <ChevronDown size={20} className="text-slate-400 shrink-0" />
                                            )}
                                        </button>

                                        {openSection === idx && (
                                            <div className="p-6 bg-white">
                                                <ul className="space-y-2.5">
                                                    {section.topics.map((topic, i) => (
                                                        <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-600">
                                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></div>
                                                            <span>{topic}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 3. Real Enterprise Capstone Projects */}
                        <section>
                            <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2.5 font-display">
                                <Code className="text-indigo-600" />
                                <span>Real Enterprise Capstone Projects</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {data.projects.map((project, idx) => (
                                    <div key={idx} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 group flex flex-col">
                                        <div className="h-44 overflow-hidden bg-slate-900 relative">
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                                            />
                                            <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-teal-400 border border-white/20">
                                                Capstone {idx + 1}
                                            </div>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className="font-bold text-base text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                                {project.title}
                                            </h3>
                                            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 flex-1">
                                                {project.desc}
                                            </p>
                                            <div className="flex flex-wrap gap-1.5 mt-auto">
                                                {project.tags.map((tag, t) => (
                                                    <span key={t} className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase rounded-md">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 4. Career Opportunities & Salary Potential */}
                        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                            <h3 className="text-xl font-bold font-display text-slate-900 mb-2 flex items-center gap-2">
                                <Briefcase className="text-blue-600" />
                                <span>Career Opportunities & Salary Ranges</span>
                            </h3>
                            <p className="text-slate-500 text-xs sm:text-sm mb-6">
                                Potential career roles for graduates of our {data.title} program:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {data.careerRoles?.map((role, idx) => (
                                    <div key={idx} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                                        <div className="text-sm font-bold text-slate-900">{role.title}</div>
                                        <div className="text-xs text-emerald-700 font-bold mt-1">Average CTC: {role.salary}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Sticky Enrollment Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Pricing Card */}
                            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-7 text-center relative overflow-hidden">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase mb-4 border border-emerald-200">
                                    <Sparkles size={12} />
                                    <span>2026 Batch Scholarship</span>
                                </div>

                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Internship Fee</p>
                                <div className="flex items-center justify-center gap-3 mb-6">
                                    <span className="text-4xl sm:text-5xl font-black text-slate-900 font-display">
                                        {loading ? "..." : `₹${effectiveFee.toLocaleString()}`}
                                    </span>
                                    {discount > 0 && (
                                        <span className="text-slate-400 line-through text-lg">
                                            ₹{totalFee.toLocaleString()}
                                        </span>
                                    )}
                                </div>

                                {/* Promo Code Box */}
                                <form onSubmit={handleApplyCoupon} className="mb-6 flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Coupon (TSAR2026)"
                                        value={couponInput}
                                        onChange={e => setCouponInput(e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-bold focus:outline-none focus:border-blue-600 text-slate-900"
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shrink-0 cursor-pointer"
                                    >
                                        Apply
                                    </button>
                                </form>

                                {couponApplied && (
                                    <div className="text-xs text-emerald-700 font-bold bg-emerald-50 p-2 rounded-lg mb-4 border border-emerald-200">
                                        🎉 Coupon TSAR2026 Applied: 20% Extra Scholarship!
                                    </div>
                                )}

                                <EnrollButton
                                    course={data.title}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold py-4 rounded-2xl shadow-lg shadow-blue-600/25 text-sm uppercase tracking-wider transition-all transform hover:-translate-y-0.5 mb-3 flex items-center justify-center gap-2"
                                >
                                    <span>Enroll in Next Batch</span>
                                    <ArrowRight size={18} />
                                </EnrollButton>

                                <button
                                    onClick={() => setLeadModalOpen(true)}
                                    className="w-full py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-2xl border border-blue-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                >
                                    <Download size={14} />
                                    <span>Download Detailed Syllabus</span>
                                </button>

                                <div className="mt-4 pt-4 border-t border-slate-100 text-left space-y-2 text-xs text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle size={14} className="text-emerald-500" />
                                        <span>Verified Govt. MSME Certificate</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle size={14} className="text-emerald-500" />
                                        <span>100% Placement Referral Assistance</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle size={14} className="text-emerald-500" />
                                        <span>LMS Portal & Recorded Lectures Access</span>
                                    </div>
                                </div>
                            </div>

                            {/* Direct Admissions Box */}
                            <div className="bg-white rounded-3xl p-7 text-slate-900 shadow-sm border border-slate-200">
                                <h4 className="text-base font-bold mb-2 flex items-center gap-2">
                                    <Phone size={18} className="text-blue-600" />
                                    <span>Need Admission Guidance?</span>
                                </h4>
                                <p className="text-slate-500 text-xs leading-relaxed mb-4">
                                    Speak directly with our senior mentors regarding curriculum details, batch timings, and career paths.
                                </p>
                                <div className="space-y-2 mb-2">
                                    <a
                                        href="tel:+919491301258"
                                        className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                                    >
                                        Call: +91 9491301258
                                    </a>
                                    <a
                                        href="tel:+918142616767"
                                        className="block w-full text-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
                                    >
                                        Call: +91 8142616767
                                    </a>
                                </div>
                                <button
                                    onClick={() => setLeadModalOpen(true)}
                                    className="block w-full text-center bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold py-3 rounded-xl text-xs border border-slate-200 transition-colors cursor-pointer"
                                >
                                    Request Free 1-on-1 Callback
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
            <ScrollButtons />
            <WhatsAppButton />
            <AIChatWidget />

            {/* Universal Lead Modal */}
            <LeadModal
                isOpen={leadModalOpen}
                onClose={() => setLeadModalOpen(false)}
                defaultCourse={data.title}
                title={`Download ${data.title} Syllabus & Demo`}
            />

            {/* Video Demo Modal */}
            {videoModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
                    <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                        <button
                            onClick={() => setVideoModalOpen(false)}
                            className="absolute top-4 right-4 z-10 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
                            aria-label="Close video"
                        >
                            ✕
                        </button>
                        <div className="aspect-video w-full">
                            <iframe
                                className="w-full h-full"
                                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                                title={`${data.title} Class Preview`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseTemplate;
