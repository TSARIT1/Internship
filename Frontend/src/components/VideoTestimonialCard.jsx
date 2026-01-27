import React from 'react';
import { motion } from 'framer-motion';
import { Play, Star } from 'lucide-react';

const VideoTestimonialCard = ({ testimonial, onPlay, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300"
        >
            {/* Thumbnail Wrapper */}
            <div
                className="relative aspect-video cursor-pointer overflow-hidden"
                onClick={() => onPlay(testimonial.videoUrl)}
            >
                <img
                    src={testimonial.thumbnail}
                    alt={testimonial.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Overlay & Play Button */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-14 h-14 bg-white/90 backdrop-blur rounded-full flex items-center justify-center pl-1 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Play size={24} className="text-blue-600 fill-blue-600" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex gap-1 mb-3 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={16}
                            fill={i < (testimonial.rating || 5) ? "currentColor" : "none"}
                            className={i < (testimonial.rating || 5) ? "" : "text-slate-300"}
                        />
                    ))}
                </div>

                <p className="text-slate-700 mb-4 font-medium line-clamp-3">
                    "{testimonial.message}"
                </p>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                        <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                        <p className="text-sm text-blue-600 font-semibold">{testimonial.course}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default VideoTestimonialCard;
