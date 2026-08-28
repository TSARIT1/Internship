import React, { useState } from 'react';
import { MessageCircle, Phone, X, Sparkles } from 'lucide-react';

const WhatsAppButton = () => {
    const [showOptions, setShowOptions] = useState(false);
    const num1 = "919491301258";
    const num2 = "918142616767";
    const defaultMessage = encodeURIComponent("Hello TSAR IT Admissions, I am interested in the IT Internship Programs (2026 Batch). Please share details.");

    const openWhatsApp = (phone) => {
        window.open(`https://wa.me/${phone}?text=${defaultMessage}`, '_blank');
        setShowOptions(false);
    };

    return (
        <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2">
            {showOptions && (
                <div className="bg-white p-4 rounded-2xl shadow-2xl border border-slate-200 w-64 mb-1 animate-fadeIn">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                            <MessageCircle size={14} className="text-emerald-500 fill-emerald-500" />
                            <span>Admissions Helpline</span>
                        </div>
                        <button
                            onClick={() => setShowOptions(false)}
                            className="text-slate-400 hover:text-slate-700 p-1"
                        >
                            <X size={14} />
                        </button>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-3">Connect directly with our counseling advisors:</p>
                    <div className="space-y-2">
                        <button
                            onClick={() => openWhatsApp(num1)}
                            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors cursor-pointer border border-emerald-200"
                        >
                            <span>Admissions: +91 9491301258</span>
                            <MessageCircle size={14} />
                        </button>
                        <button
                            onClick={() => openWhatsApp(num2)}
                            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold transition-colors cursor-pointer border border-teal-200"
                        >
                            <span>Support: +91 8142616767</span>
                            <MessageCircle size={14} />
                        </button>
                    </div>
                </div>
            )}

            <div className="relative group">
                <button
                    onClick={() => setShowOptions(!showOptions)}
                    className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all duration-300 relative cursor-pointer"
                    aria-label="Chat on WhatsApp"
                >
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
                    </span>
                    <MessageCircle size={30} className="fill-white" />
                </button>

                {/* Hover Tooltip */}
                {!showOptions && (
                    <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 border border-slate-700">
                        <span>Chat on WhatsApp (+91 9491301258 / +91 8142616767) 💬</span>
                        <div className="text-[10px] text-emerald-400 font-normal">Replies in ~2 mins</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WhatsAppButton;
