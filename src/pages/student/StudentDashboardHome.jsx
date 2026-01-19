import React, { useEffect, useState } from 'react';
import { getWebinars } from '../../services/webinarApi';
import { getPricing } from '../../services/studentApi';
import { internships } from '../../data/internships';
import { Calendar, Clock, ArrowRight, BookOpen, CheckCircle, Video, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDashboardHome = () => {
    const student = JSON.parse(localStorage.getItem('student') || '{}');
    const navigate = useNavigate();
    const [upcomingWebinar, setUpcomingWebinar] = useState(null);
    const [stats, setStats] = useState({
        upcomingWebinars: 0,
        registeredWebinars: 0,
        availableCourses: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [webinarsRes, coursesRes] = await Promise.all([
                    getWebinars(),
                    getPricing()
                ]);

                const allWebinars = webinarsRes.data || [];
                const allCourses = coursesRes.data || [];

                // Upcoming Webinars Count (Future Dates)
                const upcoming = allWebinars.filter(w => new Date(w.date) >= new Date());

                // Registered Webinars Count
                const registeredIds = student.registeredWebinars || [];
                // Handle legacy string format if present and not in array
                let registeredCount = registeredIds.length;
                if (student.webinar && !registeredIds.some(r => (typeof r === 'object' ? r.id : r) === allWebinars.find(w => w.title === student.webinar)?.id)) {
                    // Only increment if not already counted (simple check)
                    // Actually, if student.webinar exists, they have at least 1. 
                    // But registeredWebinars is the source of truth now.
                    // If registeredWebinars is empty but student.webinar is set (legacy), count is 1.
                    if (registeredCount === 0) registeredCount = 1;
                }

                // Next Upcoming Webinar for card
                const next = upcoming.sort((a, b) => new Date(a.date) - new Date(b.date))[0];

                setUpcomingWebinar(next);
                setStats({
                    upcomingWebinars: upcoming.length,
                    registeredWebinars: registeredCount,
                    availableCourses: allCourses.length
                });

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            }
        };
        fetchData();
    }, []);

    const enrolledCourse = student.webinar || student.course;

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Welcome back, {student.name}!</h1>
                    <p className="text-slate-500 mt-1">Track your progress and upcoming events.</p>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Upcoming Webinars</p>
                        <h3 className="text-2xl font-bold text-slate-900">{stats.upcomingWebinars}</h3>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                        <Video size={24} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Registered Webinars</p>
                        <h3 className="text-2xl font-bold text-slate-900">{stats.registeredWebinars}</h3>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                        <Award size={24} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Available Courses</p>
                        <h3 className="text-2xl font-bold text-slate-900">{stats.availableCourses}</h3>
                    </div>
                </div>
            </div>

            {/* Active Commitments Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active Course Card */}
                {enrolledCourse ? (
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                    <CheckCircle size={12} /> Active Course
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold mb-2">{enrolledCourse}</h2>
                            <p className="text-blue-100 text-sm">Continue learning where you left off.</p>
                        </div>
                        <div className="mt-8">
                            <button
                                onClick={() => navigate(`/student/course/${encodeURIComponent(enrolledCourse)}`)}
                                className="bg-white text-blue-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-sm"
                            >
                                Go to Classroom
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center space-y-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">No Active Course</h3>
                            <p className="text-slate-500 text-sm">Enroll in an internship to get started.</p>
                        </div>
                    </div>
                )}

                {/* Next Upcoming Webinar */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <Calendar size={18} className="text-blue-600" />
                            Upcoming Webinar
                        </h3>
                        {upcomingWebinar && (
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                                {upcomingWebinar.date}
                            </span>
                        )}
                    </div>

                    {upcomingWebinar ? (
                        <div className="flex-1 flex flex-col">
                            <h4 className="text-lg font-bold text-slate-900 mb-2">{upcomingWebinar.title}</h4>
                            <p className="text-slate-500 text-sm mb-4 line-clamp-2">{upcomingWebinar.description}</p>

                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                    <Clock size={16} />
                                    <span>{upcomingWebinar.time}</span>
                                </div>
                                <button
                                    onClick={() => navigate('/studentdashboard/webinars')}
                                    className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1"
                                >
                                    View Details <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                            No upcoming webinars scheduled.
                        </div>
                    )}
                </div>
            </div>

            {/* Explore Internships Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Explore Internships</h2>
                    <span className="text-sm text-slate-500">Based on popular demand</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {internships.slice(0, 3).map((internship, index) => (
                        <div key={index} className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                            <div className={`w-12 h-12 rounded-lg ${internship.bg} ${internship.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <internship.icon size={24} />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-1">{internship.title}</h3>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">{internship.duration}</span>
                                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">{internship.level}</span>
                            </div>
                            <p className="text-sm text-slate-500 mb-4 line-clamp-2">{internship.description}</p>
                            <button
                                onClick={() => navigate('/studentdashboard/courses')}
                                className="w-full py-2 text-sm font-bold text-slate-700 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                            >
                                View Program
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate('/studentdashboard/courses')}
                        className="inline-flex items-center gap-2 text-slate-600 font-semibold hover:text-blue-600 transition-colors"
                    >
                        View All Internships <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboardHome;
