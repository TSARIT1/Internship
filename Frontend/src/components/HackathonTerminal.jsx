import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, Clock, AlertTriangle, XCircle, Timer } from 'lucide-react';

const TERMINAL_DURATION_MS = 30 * 60 * 1000; // 30 minutes

const HackathonTerminal = ({ errorOutput, errorType, errorTimestamp, onClear }) => {
    const [timeLeft, setTimeLeft] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const terminalRef = useRef(null);

    // Animate in on mount
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 50);
        return () => clearTimeout(timer);
    }, []);

    // Auto-scroll terminal to bottom
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [errorOutput]);

    // Countdown timer
    useEffect(() => {
        if (!errorTimestamp) return;

        const updateTimer = () => {
            const elapsed = Date.now() - new Date(errorTimestamp).getTime();
            const remaining = TERMINAL_DURATION_MS - elapsed;

            if (remaining <= 0) {
                onClear?.();
                return;
            }

            const mins = Math.floor(remaining / 60000);
            const secs = Math.floor((remaining % 60000) / 1000);
            setTimeLeft(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [errorTimestamp, onClear]);

    if (!errorOutput) return null;

    const getErrorBadge = () => {
        switch (errorType) {
            case 'COMPILE_ERROR':
                return { label: 'COMPILE ERROR', color: 'bg-red-500/20 text-red-400 border-red-500/40', icon: <XCircle size={14} /> };
            case 'RUNTIME_ERROR':
                return { label: 'RUNTIME ERROR', color: 'bg-orange-500/20 text-orange-400 border-orange-500/40', icon: <AlertTriangle size={14} /> };
            case 'TIMEOUT':
                return { label: 'TIME LIMIT EXCEEDED', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40', icon: <Clock size={14} /> };
            default:
                return { label: 'ERROR', color: 'bg-red-500/20 text-red-400 border-red-500/40', icon: <AlertTriangle size={14} /> };
        }
    };

    const badge = getErrorBadge();

    const handleClear = () => {
        setIsVisible(false);
        setTimeout(() => onClear?.(), 300);
    };

    return (
        <div
            className={`transition-all duration-300 ease-out ${isVisible
                    ? 'opacity-100 translate-y-0 max-h-[400px]'
                    : 'opacity-0 translate-y-4 max-h-0'
                }`}
            style={{ overflow: 'hidden' }}
        >
            <div className="mx-0 mt-2 rounded-xl overflow-hidden border border-red-500/20 shadow-2xl shadow-red-900/10">
                {/* Terminal Header Bar */}
                <div className="bg-[#1a1a2e] px-4 py-2.5 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-3">
                        {/* Fake traffic lights */}
                        <div className="flex gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-red-500 opacity-80 shadow-sm shadow-red-500/50"></span>
                            <span className="w-3 h-3 rounded-full bg-yellow-500 opacity-80 shadow-sm shadow-yellow-500/50"></span>
                            <span className="w-3 h-3 rounded-full bg-green-500 opacity-80 shadow-sm shadow-green-500/50"></span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Terminal size={14} className="text-slate-400" />
                            <span className="text-xs font-mono text-slate-400">terminal — error output</span>
                        </div>

                        {/* Error Type Badge */}
                        <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badge.color}`}>
                            {badge.icon}
                            {badge.label}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Countdown Timer */}
                        <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-white/5">
                            <Timer size={12} className="text-amber-400 animate-pulse" />
                            <span className="text-xs font-mono text-amber-400 font-bold">{timeLeft}</span>
                            <span className="text-[10px] text-slate-500">remaining</span>
                        </div>

                        {/* Clear Button */}
                        <button
                            onClick={handleClear}
                            className="p-1 hover:bg-white/10 rounded transition-colors group"
                            title="Clear terminal"
                        >
                            <X size={14} className="text-slate-500 group-hover:text-white transition-colors" />
                        </button>
                    </div>
                </div>

                {/* Terminal Body */}
                <div
                    ref={terminalRef}
                    className="bg-[#0d1117] p-4 font-mono text-sm leading-relaxed max-h-[280px] overflow-y-auto"
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#334155 transparent',
                    }}
                >
                    {/* Prompt Line */}
                    <div className="text-slate-500 text-xs mb-3 flex items-center gap-2">
                        <span className="text-green-500">$</span>
                        <span>executing code...</span>
                        <span className="text-red-400 font-bold">✗ failed</span>
                    </div>

                    {/* Error Output */}
                    <div className="whitespace-pre-wrap break-words text-red-300">
                        {errorOutput.split('\n').map((line, i) => (
                            <div key={i} className="flex">
                                <span className="text-slate-600 select-none mr-3 text-right w-6 shrink-0">
                                    {i + 1}
                                </span>
                                <span className={`${line.toLowerCase().includes('error') ? 'text-red-400 font-semibold' :
                                        line.toLowerCase().includes('warning') ? 'text-yellow-400' :
                                            line.trim().startsWith('^') ? 'text-cyan-400' :
                                                'text-red-300/80'
                                    }`}>
                                    {line || ' '}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Blinking cursor */}
                    <div className="mt-2 flex items-center gap-1">
                        <span className="text-green-500">$</span>
                        <span className="w-2 h-4 bg-green-400 animate-pulse rounded-sm opacity-70"></span>
                    </div>
                </div>

                {/* Terminal Footer */}
                <div className="bg-[#1a1a2e] px-4 py-1.5 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-mono">
                        Error will auto-clear in {timeLeft}
                    </span>
                    <button
                        onClick={handleClear}
                        className="text-[10px] text-slate-500 hover:text-red-400 font-mono transition-colors"
                    >
                        [clear terminal]
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HackathonTerminal;
