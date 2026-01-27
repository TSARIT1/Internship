import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getVideoTestimonials } from '../services/testimonialApi';
import VideoTestimonialCard from './VideoTestimonialCard';
import VideoModal from './VideoModal';

const VideoTestimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [activeVideo, setActiveVideo] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getVideoTestimonials();
            setTestimonials(response.data);
        };
        fetchData();
    }, []);

    const handlePlayVideo = (url) => {
        setActiveVideo(url);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setActiveVideo(null);
    };

    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">Student Experiences</span>
                        <h2 className="text-3xl lg:text-5xl font-bold font-display text-slate-900 mb-6">
                            See What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Students Say</span>
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                            Watch real stories from our alumni who have successfully transitioned into their dream tech careers.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <VideoTestimonialCard
                            key={item.id}
                            testimonial={item}
                            index={index}
                            onPlay={handlePlayVideo}
                        />
                    ))}
                </div>
            </div>

            <VideoModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                videoUrl={activeVideo}
            />
        </section>
    );
};

export default VideoTestimonials;
