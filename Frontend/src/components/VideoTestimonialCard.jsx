import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Star } from 'lucide-react';

// Auto-extract YouTube thumbnail
const getYouTubeThumbnail = (url) => {
    if (!url) return null;
    const patterns = [
        /youtu\.be\/([^?&]+)/,
        /youtube\.com\/watch\?v=([^&]+)/,
        /youtube\.com\/shorts\/([^?&]+)/,
        /youtube\.com\/embed\/([^?&]+)/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
    }
    return null;
};

// Initials avatar fallback
const InitialsAvatar = ({ name, size = 40 }) => {
    const initials = (name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#f97316'];
    const color = colors[name ? name.charCodeAt(0) % colors.length : 0];
    return (
        <div style={{
            width: size, height: size, borderRadius: '50%',
            backgroundColor: color, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: size * 0.36,
            fontWeight: 700, color: '#fff', flexShrink: 0
        }}>
            {initials}
        </div>
    );
};

const SmartAvatar = ({ src, name, size = 40 }) => {
    const [error, setError] = useState(false);
    if (!src || error) return <InitialsAvatar name={name} size={size} />;
    return (
        <img src={src} alt={name}
            style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
            onError={() => setError(true)} />
    );
};

const VideoTestimonialCard = ({ testimonial, onPlay, index }) => {
    const [thumbError, setThumbError] = useState(false);

    // Use stored thumbnail, or auto-extract from YouTube URL
    const thumbnail = (!thumbError && testimonial.thumbnail) ? testimonial.thumbnail
        : getYouTubeThumbnail(testimonial.videoUrl);

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
                className="relative aspect-video cursor-pointer overflow-hidden bg-slate-100"
                onClick={() => onPlay(testimonial.videoUrl)}
            >
                {thumbnail ? (
                    <img
                        src={thumbnail}
                        alt={testimonial.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={() => setThumbError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                        <Play size={48} className="text-blue-300" />
                    </div>
                )}

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

                <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                    <SmartAvatar src={testimonial.image} name={testimonial.name} size={40} />
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
