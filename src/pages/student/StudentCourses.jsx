
import React, { useEffect, useState } from 'react';
import { getPricing, enrollStudent } from '../../services/studentApi';
import { BookOpen, CheckCircle, Clock, BarChart, Globe, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentCourses = () => {
    const [courses, setCourses] = useState([]);
    const student = JSON.parse(localStorage.getItem('student') || '{}');
    const enrolledCourseName = student.webinar || student.course;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            const response = await getPricing();
            setCourses(response.data || []);
        };
        fetchCourses();
    }, []);

    const handleApply = async (courseName) => {
        /* 
           Using mocked API to enroll. 
           In production, this would be a POST request.
        */
        if (!student.id) {
            alert("Please log in again.");
            return;
        }

        try {
            const response = await import('../../services/studentApi').then(module =>
                module.applyForInternship(student.id, courseName)
            );

            if (response.success) {
                // Update local storage to reflect change immediately
                const updatedStudent = { ...student, ...response.data };
                localStorage.setItem('student', JSON.stringify(updatedStudent));

                // Force reload or just navigate/alert to show state change
                // Since this component uses 'student' from localStorage on render, we might need to trigger a re-render or reload.
                // For simplicity in this mock setup, we'll reload the window or navigate to dashboard
                alert(`Successfully enrolled in ${courseName}!`);
                navigate('/studentdashboard');
            } else {
                alert("Enrollment failed: " + response.message);
            }
        } catch (error) {
            console.error("Enrollment error:", error);
            alert("An error occurred during enrollment.");
        }
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-900 font-display">Internship Programs</h1>
                <p className="text-slate-500 mt-2 text-lg">Industry-standard curriculums designed to get you hired.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, index) => {
                    const isEnrolled = enrolledCourseName === course.course;
                    const finalFee = course.totalFee - course.discount;

                    return (
                        <div key={index} className={`relative rounded-2xl p-6 border transition-all flex flex-col h-full bg-white group ${isEnrolled
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
                                        onClick={() => !isEnrolled && handleApply(course.course)}
                                        disabled={isEnrolled}
                                        className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${isEnrolled
                                            ? 'bg-slate-100 text-slate-400 cursor-default'
                                            : 'bg-blue-600 text-white hover:bg-blue-700 hover:gap-3 shadow-lg shadow-blue-600/20'
                                            }`}
                                    >
                                        {isEnrolled ? (
                                            "Active"
                                        ) : (
                                            <>Apply <ArrowRight size={16} /></>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StudentCourses;
