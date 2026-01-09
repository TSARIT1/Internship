import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonials = [
    {
        name: "Rahul Sharma",
        role: "Data Scientist at Amazon",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
        quote: "The practical exposure I got here was unmatched. The mentorship program helped me crack my dream job interview.",
        company: "Amazon"
    },
    {
        name: "Priya Patel",
        role: "Frontend Dev at Swiggy",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
        quote: "I learned more in 4 months here than I did in 4 years of college. The MERN stack course is absolutely world-class.",
        company: "Swiggy"
    },
    {
        name: "Amit Kumar",
        role: "Cloud Engineer at TCS",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
        quote: "From zero knowledge of AWS to being a certified practitioner, the journey was incredible. Highly recommended!",
        company: "TCS"
    }
];

const Testimonials = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl lg:text-5xl font-bold font-display text-slate-900 mb-6"
                    >
                        Success <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Stories</span>
                    </motion.h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                        Hear from our students who transformed their careers with us.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-lg relative hover:-translate-y-2 transition-transform duration-300"
                        >
                            <Quote className="absolute top-8 right-8 text-blue-100" size={48} />

                            <div className="flex gap-1 mb-6 text-amber-400">
                                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                            </div>

                            <p className="text-slate-700 mb-8 leading-relaxed relative z-10 font-medium">
                                "{item.quote}"
                            </p>

                            <div className="flex items-center gap-4">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md"
                                />
                                <div>
                                    <div className="font-bold text-slate-900">{item.name}</div>
                                    <div className="text-xs text-blue-600 font-bold uppercase tracking-wide">{item.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
