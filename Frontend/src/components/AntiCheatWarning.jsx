import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldAlert, Eye } from 'lucide-react';

/**
 * AntiCheatWarning — Full-screen overlay shown when a tab-switch is detected.
 * Props:
 *   visible       {boolean}  — whether to show the overlay
 *   switchCount   {number}   — total times student left the tab
 *   onDismiss     {function} — called when student clicks "I Understand"
 */
const AntiCheatWarning = ({ visible, switchCount, onDismiss }) => {
    const isHighRisk = switchCount >= 3;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.85, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className={`relative mx-4 w-full max-w-md rounded-3xl border p-8 text-center shadow-2xl ${isHighRisk
                                ? 'bg-red-950 border-red-500/60'
                                : 'bg-slate-900 border-amber-500/60'
                            }`}
                    >
                        {/* Icon */}
                        <div className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full ${isHighRisk ? 'bg-red-500/20' : 'bg-amber-500/20'
                            }`}>
                            {isHighRisk
                                ? <ShieldAlert size={40} className="text-red-400" />
                                : <AlertTriangle size={40} className="text-amber-400" />
                            }
                        </div>

                        {/* Title */}
                        <h2 className={`text-2xl font-black mb-2 ${isHighRisk ? 'text-red-400' : 'text-amber-400'}`}>
                            {isHighRisk ? '🚨 Suspicious Activity Detected' : '⚠️ Tab Switch Detected'}
                        </h2>

                        {/* Body */}
                        <p className="text-slate-300 leading-relaxed mb-4">
                            {isHighRisk
                                ? 'You have left this page multiple times. Repeated violations may result in disqualification. This activity is being recorded.'
                                : 'You navigated away from the hackathon page. Please stay on this page during the event. Leaving the tab is considered suspicious activity.'
                            }
                        </p>

                        {/* Violation counter */}
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-6 ${isHighRisk
                                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}>
                            <Eye size={15} />
                            Tab Switch Count: {switchCount}
                        </div>

                        {/* Rules reminder */}
                        <ul className="text-left text-sm text-slate-400 space-y-1.5 mb-6 bg-white/5 rounded-xl p-4">
                            <li className="flex items-center gap-2">🚫 Do not copy or paste content</li>
                            <li className="flex items-center gap-2">🚫 Do not switch tabs or windows</li>
                            <li className="flex items-center gap-2">🚫 Do not use browser developer tools</li>
                            <li className="flex items-center gap-2">✅ Stay focused on this page</li>
                        </ul>

                        {/* CTA */}
                        <button
                            onClick={onDismiss}
                            className={`w-full py-3 rounded-xl font-bold text-white transition-all ${isHighRisk
                                    ? 'bg-red-600 hover:bg-red-500'
                                    : 'bg-amber-500 hover:bg-amber-400'
                                }`}
                        >
                            I Understand — Return to Hackathon
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AntiCheatWarning;
