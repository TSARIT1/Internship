import React, { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollButtons = () => {
    const [showUp, setShowUp] = useState(false);
    const [showDown, setShowDown] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

            setShowUp(currentScroll > 150);
            setShowDown(currentScroll < maxScroll - 150);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight || document.body.scrollHeight,
            behavior: 'smooth'
        });
    };

    return (
        <div className="fixed right-6 bottom-24 z-40 flex flex-col gap-2 pointer-events-auto">
            <AnimatePresence>
                {showUp && (
                    <motion.button
                        key="scroll-up"
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        transition={{ duration: 0.2 }}
                        onClick={scrollToTop}
                        aria-label="Scroll to top"
                        title="Scroll to Top"
                        className="w-10 h-10 rounded-full bg-white text-slate-700 hover:text-blue-600 border border-slate-200 shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 group cursor-pointer"
                    >
                        <ArrowUp size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                    </motion.button>
                )}

                {showDown && (
                    <motion.button
                        key="scroll-down"
                        initial={{ opacity: 0, scale: 0.8, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -10 }}
                        transition={{ duration: 0.2 }}
                        onClick={scrollToBottom}
                        aria-label="Scroll to bottom"
                        title="Scroll to Bottom"
                        className="w-10 h-10 rounded-full bg-white text-slate-700 hover:text-blue-600 border border-slate-200 shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 group cursor-pointer"
                    >
                        <ArrowDown size={18} className="group-hover:translate-y-0.5 transition-transform" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ScrollButtons;
