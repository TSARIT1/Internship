import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Phone, CheckCircle2, ChevronRight } from 'lucide-react';
import { sendContactMessage } from '../services/studentApi';

const AIChatWidget = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            from: 'ai',
            text: "Hello! I am RAKI, your TSAR IT AI Career Advisor. I can help you choose the right tech domain, review placement statistics, explore customized tech courses, or download the 2026 curriculum pack."
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showLeadForm, setShowLeadForm] = useState(false);
    const [leadSubmitted, setLeadSubmitted] = useState(false);
    const [leadData, setLeadData] = useState({ name: '', phone: '', course: 'Data Science', otherDomain: '' });

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (open) {
            scrollToBottom();
        }
    }, [messages, open, isTyping]);

    const quickChips = [
        { label: "🎯 Suggest a course", prompt: "Which IT internship domain is best for beginners in 2026?" },
        { label: "💼 Placement Record", prompt: "What is TSAR IT's placement rate and hiring partners?" },
        { label: "💰 Fees & Discounts", prompt: "Tell me about internship fees and available scholarships." },
        { label: "📞 Request Callback", action: "callback" },
        { label: "💬 WhatsApp (+91 9491301258)", action: "whatsapp" }
    ];

    const generateAIAnswer = (query) => {
        const q = query.toLowerCase();
        if (q.includes('who are you') || q.includes('your name') || q.includes('raki')) {
            return "I am **RAKI**, the official AI Career Advisor at TSAR IT INTERNSHIP. I assist aspiring developers in finding the right tech track, understanding curriculum roadmaps, and scheduling admissions counseling.";
        }
        if (q.includes('suggest') || q.includes('beginner') || q.includes('which') || q.includes('domain')) {
            return "For 2026 high-growth careers, we recommend:\n\n1. **Data Science & AI**: Best for analytics and predictive modeling.\n2. **Java Full Stack / MERN**: Best for high-volume software engineering roles.\n3. **DevOps & AWS Cloud**: Top demand in cloud infrastructure.\n4. **Cyber Security**: Rapidly expanding defense & security sector.\n\nWould you like RAKI to connect you for a free 1-on-1 counseling call?";
        }
        if (q.includes('placement') || q.includes('job') || q.includes('hiring') || q.includes('salary')) {
            return "TSAR IT offers **100% Placement Assistance**:\n\n• Over 5,000+ students trained with a **94% placement rate**.\n• Hiring partners include top MNCs and high-growth tech startups.\n• Average starting package ranges from **₹4.5 LPA to ₹18+ LPA**.\n• Includes resume building, LinkedIn optimization, and mock technical interviews.";
        }
        if (q.includes('fee') || q.includes('price') || q.includes('cost') || q.includes('scholarship') || q.includes('discount')) {
            return "All TSAR IT Internship programs feature subsidized pricing with early-bird discounts!\n\nUse code **TSAR2026** during enrollment to unlock up to 40% scholarship discount. Monthly EMI options are also supported.";
        }
        if (q.includes('syllabus') || q.includes('curriculum') || q.includes('download')) {
            return "You can download the comprehensive 2026 syllabus module-by-module for all our tech courses. Click the 'Request Callback' chip or leave your number to receive the PDF directly on WhatsApp.";
        }
        return "Thank you for reaching out! TSAR IT INTERNSHIP offers hands-on programs across all modern tech domains (Data Science, Machine Learning, AI, MERN, Java, Python, DevOps, AWS Cloud, Cyber Security, UI/UX & more). I can connect you with an expert counselor for personalized guidance.";
    };

    const handleSend = (textToSend = input) => {
        const text = textToSend.trim();
        if (!text) return;

        setMessages(prev => [...prev, { from: 'user', text }]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const reply = generateAIAnswer(text);
            setMessages(prev => [...prev, { from: 'ai', text: reply }]);
            setIsTyping(false);
        }, 800);
    };

    const handleLeadSubmit = async (e) => {
        e.preventDefault();
        if (!leadData.name || !leadData.phone) return;

        const finalCourse = leadData.course === 'Other' && leadData.otherDomain.trim()
            ? `Other: ${leadData.otherDomain.trim()}`
            : leadData.course;

        try {
            await sendContactMessage({
                name: leadData.name,
                email: 'chat_lead@tsarit.com',
                phone: leadData.phone,
                course: finalCourse,
                subject: `RAKI AI Lead: ${finalCourse}`,
                message: `Phone: ${leadData.phone}\nSource: RAKI AI Career Chat Widget\nCourse Interest: ${finalCourse}`
            });
            setLeadSubmitted(true);
            setMessages(prev => [
                ...prev,
                { from: 'ai', text: `🎉 Thank you ${leadData.name}! RAKI has sent your inquiry to our senior tech advisor. We will call or WhatsApp you shortly on ${leadData.phone} with full syllabus & scholarship details.` }
            ]);
            setShowLeadForm(false);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60] font-sans">
            {open ? (
                <div className="w-[360px] sm:w-[400px] h-[540px] bg-white shadow-2xl rounded-3xl border border-slate-200 flex flex-col overflow-hidden animate-scaleUp">
                    {/* Clean Light Header */}
                    <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-teal-50 border-b border-slate-200 text-slate-900 p-4 flex items-center justify-between shadow-xs">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30 font-black text-sm">
                                RAKI
                            </div>
                            <div>
                                <h4 className="font-extrabold text-sm leading-tight flex items-center gap-1.5 text-slate-900">
                                    RAKI • AI Career Advisor
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                </h4>
                                <p className="text-[11px] text-slate-500 font-medium">TSAR IT • 2026 Batch Admissions</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <a
                                href="https://wa.me/919491301258?text=Hello%20RAKI%20%26%20TSAR%20IT%20Admissions%2C%20I%20am%20interested%20in%20the%202026%20IT%20Internship%20Programs."
                                target="_blank"
                                rel="noreferrer"
                                title="Chat on WhatsApp (+91 9491301258)"
                                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-100 transition-colors"
                            >
                                <MessageCircle size={18} />
                            </a>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
                                aria-label="Close Chat"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/70 text-sm">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.from === 'ai' ? 'justify-start' : 'justify-end'}`}
                            >
                                <div
                                    className={`max-w-[85%] px-4 py-3 rounded-2xl whitespace-pre-line text-xs sm:text-sm leading-relaxed ${
                                        msg.from === 'ai'
                                            ? 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-tl-xs'
                                            : 'bg-blue-600 text-white shadow-md shadow-blue-600/20 rounded-tr-xs'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                            </div>
                        )}

                        {showLeadForm && !leadSubmitted && (
                            <form onSubmit={handleLeadSubmit} className="bg-white p-4 rounded-2xl border border-blue-200 shadow-md space-y-2.5 mt-2 animate-fadeIn">
                                <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                                    <Sparkles size={14} className="text-amber-500" />
                                    <span>Connect with RAKI & Tech Advisor</span>
                                </div>
                                <input
                                    type="text"
                                    required
                                    placeholder="Your Name"
                                    value={leadData.name}
                                    onChange={e => setLeadData({ ...leadData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 text-slate-900 bg-slate-50"
                                />
                                <input
                                    type="tel"
                                    required
                                    placeholder="WhatsApp Number (+91 ...)"
                                    value={leadData.phone}
                                    onChange={e => setLeadData({ ...leadData, phone: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 text-slate-900 bg-slate-50"
                                />
                                <select
                                    value={leadData.course}
                                    onChange={e => setLeadData({ ...leadData, course: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 bg-white text-slate-900 cursor-pointer"
                                >
                                    <option value="Data Science">Data Science</option>
                                    <option value="Machine Learning">Machine Learning</option>
                                    <option value="AI & Generative AI">AI & Generative AI</option>
                                    <option value="MERN Stack">MERN Stack</option>
                                    <option value="DevOps & Cloud">DevOps & Cloud</option>
                                    <option value="Java Full Stack">Java Full Stack</option>
                                    <option value="Python Programming">Python Programming</option>
                                    <option value="AWS Cloud Computing">AWS Cloud Computing</option>
                                    <option value="Cyber Security">Cyber Security</option>
                                    <option value="Other">Other (Custom Domain)</option>
                                </select>
                                {leadData.course === 'Other' && (
                                    <input
                                        type="text"
                                        required
                                        placeholder="Specify domain (e.g. Flutter, UI/UX, Data Eng)"
                                        value={leadData.otherDomain}
                                        onChange={e => setLeadData({ ...leadData, otherDomain: e.target.value })}
                                        className="w-full px-3 py-2 border-2 border-blue-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 text-slate-900 bg-blue-50/40"
                                    />
                                )}
                                <button
                                    type="submit"
                                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                                >
                                    Request Instant Callback
                                </button>
                            </form>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Action Chips */}
                    <div className="p-2 border-t border-slate-100 bg-white flex gap-1.5 overflow-x-auto no-scrollbar">
                        {quickChips.map((chip, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    if (chip.action === 'callback') {
                                        setShowLeadForm(true);
                                    } else if (chip.action === 'whatsapp') {
                                        window.open('https://wa.me/919491301258?text=Hello%20RAKI%20%26%20TSAR%20IT%20Admissions%2C%20I%20am%20interested%20in%20the%202026%20IT%20Internship%20Programs.', '_blank');
                                    } else {
                                        handleSend(chip.prompt);
                                    }
                                }}
                                className="whitespace-nowrap px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-slate-700 text-[11px] font-semibold transition-colors shrink-0 cursor-pointer"
                            >
                                {chip.label}
                            </button>
                        ))}
                    </div>

                    {/* Input Bar */}
                    <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
                        <input
                            className="flex-1 px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-blue-600 transition-colors text-slate-900"
                            placeholder="Ask RAKI anything about courses, placements..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim()}
                            className="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-colors shadow-xs shrink-0 cursor-pointer"
                            aria-label="Send message"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setOpen(true)}
                    className="group relative flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 text-white px-5 py-3.5 rounded-full shadow-2xl shadow-blue-600/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                    aria-label="Chat with RAKI AI Career Assistant"
                >
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black text-xs">
                        RAKI
                    </div>
                    <div className="text-left hidden sm:block">
                        <div className="text-xs font-bold leading-tight">RAKI (AI Advisor)</div>
                        <div className="text-[10px] text-blue-100">Ask any question</div>
                    </div>
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping absolute -top-1 -right-1"></span>
                </button>
            )}
        </div>
    );
};

export default AIChatWidget;
