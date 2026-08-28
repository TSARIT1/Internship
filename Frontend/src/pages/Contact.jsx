import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import AIChatWidget from '../components/AIChatWidget';
import ScrollButtons from '../components/ScrollButtons';
import SEO from '../components/SEO';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Sparkles, MessageCircle, HelpCircle, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { sendContactMessage } from '../services/studentApi';

const Contact = () => {
    const internships = [
        "Data Science",
        "Machine Learning",
        "AI & Generative AI",
        "MERN Stack",
        "DevOps",
        "Java Full Stack",
        "Python Programming",
        "AWS Cloud Computing",
        "Cyber Security",
        "Other (Specify Below)"
    ];

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        internship: 'Data Science',
        otherDomain: '',
        message: ''
    });

    const [status, setStatus] = useState('idle');
    const [responseMsg, setResponseMsg] = useState('');
    const [openFaq, setOpenFaq] = useState(0);

    const faqs = [
        {
            q: "How does the TSAR IT Internship program work?",
            a: "Our internships include live interactive lectures by senior developers, weekly assignments, 4+ real enterprise capstone projects, 1-on-1 code reviews, and guaranteed placement training with interview referrals."
        },
        {
            q: "Will I receive a verified certificate upon completion?",
            a: "Yes! All graduates receive an industry-recognized verified certificate with a unique online verification QR code accepted by universities and top tech employers."
        },
        {
            q: "What are the timings and can college students attend?",
            a: "We offer flexible evening and weekend batches with live recordings uploaded to your LMS student portal within 2 hours of every session."
        },
        {
            q: "How can I avail the TSAR2026 scholarship discount?",
            a: "Enter promo code TSAR2026 on the enrollment page or submit the inquiry form to receive up to 40% instant fee subsidy."
        }
    ];

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": f.a
            }
        }))
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        const finalCourse = formData.internship === 'Other (Specify Below)' && formData.otherDomain.trim()
            ? `Other: ${formData.otherDomain.trim()}`
            : formData.internship;

        const payload = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            course: finalCourse,
            subject: `Contact Inquiry: ${finalCourse}`,
            message: `Phone: ${formData.phone}\nCourse: ${finalCourse}\nMessage: ${formData.message}`
        };

        const res = await sendContactMessage(payload);

        if (res.success) {
            setStatus('success');
            setResponseMsg("Thank you! Your inquiry has been submitted. Our admissions mentor will contact you within 15 minutes.");
            setFormData({ name: '', phone: '', email: '', internship: 'Data Science', otherDomain: '', message: '' });
        } else {
            setStatus('error');
            setResponseMsg(res.message || "Failed to submit inquiry. Please call +91 9491301258 / +91 8142616767");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 selection:bg-blue-100 font-sans">
            <SEO
                title="Contact Admissions & Career Counseling"
                description="Connect with TSAR IT INTERNSHIP admissions and senior mentors. Call +91 9491301258 / +91 8142616767 or email info@tsaritservices.com for instant guidance."
                keywords="Contact TSAR IT, IT Career Counseling, Admissions Helpline, Tech Support, Student Inquiries"
                canonicalUrl="https://tsaritservices.com/contact"
                schema={faqSchema}
            />
            <Header />

            <main className="pt-32 pb-24">
                <div className="container mx-auto px-6">
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
                            <Sparkles size={14} className="text-amber-500" />
                            <span>Admissions & Student Support</span>
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black font-display text-slate-900 mb-6 tracking-tight">
                            Get in Touch with <br />
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
                                TSAR IT INTERNSHIP Team
                            </span>
                        </h1>
                        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                            Have questions regarding curriculum, batch timings, early-bird scholarships, or corporate placements? We're here to guide your tech career.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl mx-auto mb-20">
                        {/* Contact Information (5 Cols) */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-200 space-y-6">
                                <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
                                    Direct Contact Channels
                                </h3>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                        <MapPin size={22} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm mb-1">TSAR IT INTERNSHIP Headquarters</h4>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            12-203/745, Church Street, Nakkabanda, Punganur, Madanapalle, Chittoor - 517247, Andhra Pradesh, India
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                                        <Phone size={22} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm mb-1">Admissions Helplines</h4>
                                        <div className="flex flex-col gap-0.5">
                                            <a href="tel:+919491301258" className="text-xs font-bold text-blue-600 hover:underline">
                                                +91 9491301258
                                            </a>
                                            <a href="tel:+918142616767" className="text-xs font-bold text-blue-600 hover:underline">
                                                +91 8142616767
                                            </a>
                                        </div>
                                        <div className="text-[10px] text-slate-400 mt-0.5">Mon - Sat (9:00 AM - 8:00 PM IST)</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                        <MessageCircle size={22} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm mb-1">Instant WhatsApp Support</h4>
                                        <div className="flex flex-col gap-0.5">
                                            <a
                                                href="https://wa.me/919491301258"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-xs font-bold text-emerald-600 hover:underline"
                                            >
                                                Chat on WhatsApp (+91 9491301258)
                                            </a>
                                            <a
                                                href="https://wa.me/918142616767"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-xs font-bold text-emerald-600 hover:underline"
                                            >
                                                Chat on WhatsApp (+91 8142616767)
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                        <Mail size={22} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm mb-1">Official Email</h4>
                                        <a href="mailto:info@tsaritservices.com" className="text-xs font-bold text-slate-700 hover:text-blue-600">
                                            info@tsaritservices.com
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Seal */}
                            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-teal-50 p-6 rounded-3xl text-slate-900 shadow-xs border border-blue-200/80">
                                <div className="flex items-center gap-3 mb-2">
                                    <ShieldCheck className="text-teal-600" size={24} />
                                    <span className="font-bold text-sm text-slate-900">Recognized Technical Institute</span>
                                </div>
                                <p className="text-slate-600 text-xs leading-relaxed">
                                    TSAR IT INTERNSHIP is an authorized technical training and internship organization certified under ISO 9001:2015 quality standards.
                                </p>
                            </div>
                        </div>

                        {/* Inquiry / Lead Form (7 Cols) */}
                        <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200">
                            <h3 className="text-2xl font-black text-slate-900 mb-2 font-display">
                                Send an Admissions Inquiry
                            </h3>
                            <p className="text-slate-500 text-xs sm:text-sm mb-8">
                                Fill in your details to receive personalized counseling and syllabus downloads.
                            </p>

                            {status === 'success' ? (
                                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-8 rounded-2xl text-center space-y-3">
                                    <CheckCircle size={48} className="text-emerald-600 mx-auto" />
                                    <h4 className="text-xl font-bold">Inquiry Sent Successfully!</h4>
                                    <p className="text-xs sm:text-sm text-emerald-800">{responseMsg}</p>
                                    <button
                                        onClick={() => setStatus('idle')}
                                        className="mt-4 px-6 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer"
                                    >
                                        Send Another Query
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {status === 'error' && (
                                        <div className="p-4 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
                                            <AlertCircle size={16} />
                                            <span>{responseMsg}</span>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:border-blue-600 focus:bg-white outline-none transition-all text-slate-900"
                                                placeholder="e.g. Ananya Roy"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                                WhatsApp / Mobile *
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                required
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:border-blue-600 focus:bg-white outline-none transition-all text-slate-900"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:border-blue-600 focus:bg-white outline-none transition-all text-slate-900"
                                                placeholder="ananya@gmail.com"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="internship" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                                Interested Domain *
                                            </label>
                                            <select
                                                id="internship"
                                                value={formData.internship}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:border-blue-600 focus:bg-white outline-none transition-all text-slate-900 cursor-pointer"
                                            >
                                                {internships.map((item, index) => (
                                                    <option key={index} value={item}>{item}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {formData.internship === 'Other (Specify Below)' && (
                                        <div className="animate-fadeIn">
                                            <label htmlFor="otherDomain" className="block text-xs font-bold text-blue-700 uppercase tracking-wider mb-1.5">
                                                Specify Your Preferred Domain *
                                            </label>
                                            <input
                                                type="text"
                                                id="otherDomain"
                                                required
                                                value={formData.otherDomain}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl bg-blue-50/40 border-2 border-blue-200 text-sm focus:border-blue-600 focus:bg-white outline-none transition-all text-slate-900 placeholder:text-slate-400"
                                                placeholder="e.g. Flutter Development, UI/UX Design, Data Engineering, QA Automation"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label htmlFor="message" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                            Message or Specific Query
                                        </label>
                                        <textarea
                                            id="message"
                                            rows="4"
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:border-blue-600 focus:bg-white outline-none transition-all resize-none text-slate-900"
                                            placeholder="Tell us about your background, branch, or questions..."
                                        ></textarea>
                                    </div>

                                    <div className="space-y-3">
                                        <button
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm uppercase tracking-wider py-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                                        >
                                            {status === 'loading' ? (
                                                <span>Submitting Inquiry...</span>
                                            ) : (
                                                <>
                                                    <Send size={18} />
                                                    <span>Request Free Career Consultation</span>
                                                </>
                                            )}
                                        </button>

                                        <a
                                            href="https://wa.me/919491301258?text=Hello%20TSAR%20IT%20Admissions%2C%20I%20am%20interested%20in%20the%202026%20IT%20Internship%20Programs.%20Please%20share%20details."
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-full py-3.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
                                        >
                                            <MessageCircle size={17} className="text-emerald-600 fill-emerald-600" />
                                            <span>Chat with Admissions Advisor on WhatsApp (+91 9491301258)</span>
                                        </a>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* FAQ Accordion Section */}
                    <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-black text-slate-900 font-display">Frequently Asked Questions</h3>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1">Everything you need to know about the internship process</p>
                        </div>
                        <div className="space-y-3">
                            {faqs.map((faq, idx) => (
                                <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden">
                                    <button
                                        onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                                        className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-slate-50 hover:bg-slate-100/70 transition-colors font-bold text-sm text-slate-900 cursor-pointer"
                                    >
                                        <span>{faq.q}</span>
                                        {openFaq === idx ? <ChevronUp size={18} className="text-blue-600 shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
                                    </button>
                                    {openFaq === idx && (
                                        <div className="p-5 text-xs sm:text-sm text-slate-600 bg-white border-t border-slate-100 leading-relaxed">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
            <WhatsAppButton />
            <AIChatWidget />
            <ScrollButtons />
        </div>
    );
};

export default Contact;
