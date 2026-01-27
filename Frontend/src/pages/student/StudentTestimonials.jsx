
import React, { useEffect, useState } from 'react';
import { getTestimonials } from '../../services/testimonialApi';
import { Quote } from 'lucide-react';

const StudentTestimonials = () => {
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        const fetchTestimonials = async () => {
            const response = await getTestimonials();
            setTestimonials(response.data || []);
        };
        fetchTestimonials();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Student Stories</h1>
                <p className="text-slate-500">See what others are saying about their learning journey.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((t) => (
                    <div key={t.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
                        <div className="mb-4 text-blue-200">
                            <Quote size={40} className="transform rotate-180" />
                        </div>
                        <p className="text-slate-600 mb-6 flex-1 italic leading-relaxed">"{t.message}"</p>

                        <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-50">
                            <img
                                src={t.image}
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
    );
};

export default StudentTestimonials;
