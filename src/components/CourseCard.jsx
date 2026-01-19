import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Globe, BarChart, CheckCircle, Clock, ArrowRight } from 'lucide-react';

const CourseCard = ({ course, isEnrolled }) => {
    const navigate = useNavigate();

    const handleEnroll = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Save current path or specific enroll path to redirect back to
            // Since we want to come back to "enroll success" usually or the course itself
            // Let's redirect to enroll success flow if they click enroll
            localStorage.setItem('redirectAfterLogin', '/enroll-success');
            navigate('/login');
        } else {
            navigate('/enroll-success');
        }
    };

    const finalFee = course.totalFee - course.discount;

    return (
        <div className={`relative rounded-2xl p-6 border transition-all flex flex-col h-full bg-white group ${isEnrolled
            ? 'border-blue-200 shadow-lg shadow-blue-100 ring-1 ring-blue-500'
            : 'border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1'
            }`}>
            {isEnrolled && (
                <div className="absolute top-4 right-4 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1 border border-blue-100">
                    <CheckCircle size={14} /> Enrolled
                </div>
            )}

            {/* Icon & Domain */}
            <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-700 mb-4 shadow-inner">
                    <BookOpen size={24} />
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-bold uppercase flex items-center gap-1">
                        <Globe size={12} /> {course.domain}
                    </span>
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-bold uppercase flex items-center gap-1">
                        <BarChart size={12} /> {course.level}
                    </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 leading-tight">{course.course}</h3>
            </div>

            {/* Description */}
            <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1 border-b border-slate-50 pb-6">
                {course.description}
            </p>

            {/* Meta & Price */}
            <div className="space-y-4 mt-auto">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-2">
                        <Clock size={16} className="text-slate-400" /> Duration
                    </span>
                    <span className="font-bold text-slate-900 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md border border-amber-100">
                        {course.duration}
                    </span>
                </div>

                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-xs text-slate-400 line-through mb-0.5">₹{course.totalFee.toLocaleString()}</p>
                        <p className="text-2xl font-bold text-slate-900">₹{finalFee.toLocaleString()}</p>
                    </div>

                    <button
                        onClick={handleEnroll}
                        disabled={isEnrolled}
                        className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${isEnrolled
                            ? 'bg-slate-100 text-slate-400 cursor-default'
                            : 'bg-blue-600 text-white hover:bg-blue-700 hover:gap-3 shadow-lg shadow-blue-600/20'
                            }`}
                    >
                        {isEnrolled ? (
                            "Active"
                        ) : (
                            <>Enroll <ArrowRight size={16} /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
