
import React, { useEffect, useState } from 'react';
import { getTestimonials, getVideoTestimonials } from '../../services/testimonialApi';
import { Quote } from 'lucide-react';
import VideoTestimonialCard from '../../components/VideoTestimonialCard';
import VideoModal from '../../components/VideoModal';

const StudentTestimonials = () => {
    const [textTestimonials, setTextTestimonials] = useState([]);
    const [videoTestimonials, setVideoTestimonials] = useState([]);
    const [activeVideo, setActiveVideo] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const [textRes, videoRes] = await Promise.all([
                getTestimonials(),
                getVideoTestimonials()
            ]);
            setTextTestimonials(textRes.data || []);
            setVideoTestimonials(videoRes.data || []);
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
        <div className="space-y-12">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Student Stories</h1>
                <p className="text-slate-500">See what others are saying about their learning journey.</p>
            </div>

            {/* Video Testimonials Section */}
            {videoTestimonials.length > 0 && (
                <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Video Testimonials</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videoTestimonials.map((item, index) => (
                            <VideoTestimonialCard
                                key={item.id}
                                testimonial={item}
                                index={index}
                                onPlay={handlePlayVideo}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Text Testimonials Section */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-6">Success Stories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {textTestimonials.map((t) => (
                        <div key={t.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
                            <div className="mb-4 text-blue-200">
                                <Quote size={40} className="transform rotate-180" />
                            </div>
                            <p className="text-slate-600 mb-6 flex-1 italic leading-relaxed">"{t.message}"</p>

                            <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-50">
                                <img
                                    src={t.image || "https://ui-avatars.com/api/?name=" + t.name}
                                    alt={t.name}
                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md"
                                />
                                <div>
                                    <h4 className="font-bold text-slate-900">{t.name}</h4>
                                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wide">{t.course}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <VideoModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                videoUrl={activeVideo}
            />
        </div>
    );
};

export default StudentTestimonials;
