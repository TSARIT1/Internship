import React from 'react';
import { motion } from 'framer-motion';

const ShinyButton = ({ children, onClick, className = "", icon: Icon, continuous = false, ...props }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 group ${className}`}
            {...props}
        >
            <div className={`absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent z-10 ${continuous ? 'animate-[shimmer_2s_infinite]' : 'group-hover:animate-[shimmer_1.5s_infinite]'}`} />

            <div className="relative z-20 flex items-center justify-center gap-2">
                {children}
                {Icon && <Icon size={18} className="transition-transform group-hover:translate-x-1" />}
            </div>
        </motion.button>
    );
};

export default ShinyButton;
