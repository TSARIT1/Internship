
import React, { useEffect, useState } from 'react';
import { getWebinars } from '../../services/webinarApi';
import { getPricing } from '../../services/studentApi';
import { Calendar, CheckCircle, Search, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDashboardHome = () => {
    const student = JSON.parse(localStorage.getItem('student') || '{}');
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        webinarsCount: 0,
        registeredCount: 0,
        availableInternships: 0
    });
    const [recentWebinars, setRecentWebinars] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch webinars
            const webinarsResponse = await getWebinars();
            const allWebinars = webinarsResponse.data || [];

            // Fetch courses
            const coursesResponse = await getPricing();
            const coursesCount = coursesResponse.data ? coursesResponse.data.length : 0;

            setRecentWebinars(allWebinars.slice(0, 3)); // Show top 3

            // Calculate upcoming webinars count (dates in future)
            const upcomingCount = allWebinars.filter(w => new Date(w.date) >= new Date()).length;

            // Calculate registered count
            const registered = student.registeredWebinars?.length || (student.webinar ? 1 : 0);

            setStats({
                webinarsCount: upcomingCount,
                registeredCount: registered,
                availableInternships: coursesCount
            });
        };

        fetchData();
    }, []);

    const enrolledCourse = student.webinar || student.course;

    return (
        <div className="space-y-8">
            {/* Header & Enrolled Course */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Welcome, {student.name}!</h1>
                    <p className="text-slate-500 mt-1">Here's what's happening today.</p>
                </div>

                {enrolledCourse && (
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 w-full md:w-auto md:min-w-[320px]">
                        <p className="text-blue-100 text-sm font-medium mb-1 uppercase tracking-wider">Your Active Course</p>
                        <h2 className="text-2xl font-bold mb-4">{enrolledCourse}</h2>
                        <div className="flex items-center gap-4">
                            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                                <CheckCircle size={14} /> Active
                            </div>
                            <span className="text-sm text-blue-100">Joined {student.date}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                        <Video size={28} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900">{stats.webinarsCount}</h3>
                        <p className="text-slate-500 font-medium">Upcoming Webinars</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                        <CheckCircle size={28} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900">{stats.registeredCount}</h3>
                        <p className="text-slate-500 font-medium">Registered Webinars</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                        <Search size={28} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900">{stats.availableInternships}</h3>
                        <p className="text-slate-500 font-medium">Available Internships</p>
                    </div>
                </div>
            </div>

            {/* Upcoming Webinars Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Recommended for You</h2>
                    <button
                        onClick={() => navigate('/studentdashboard/webinars')}
                        className="text-blue-600 font-semibold text-sm hover:underline"
                    >
                        View All
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentWebinars.map((webinar) => (
                        <div key={webinar.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={webinar.image}
                                    alt={webinar.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm">
                                    {webinar.time}
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
                                    <Calendar size={16} />
                                    <span>{webinar.date}</span>
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-1" title={webinar.title}>{webinar.title}</h3>
                                <p className="text-slate-500 text-sm line-clamp-2 mb-4">{webinar.description}</p>

                                <button
                                    onClick={() => navigate('/studentdashboard/webinars')}
                                    className="w-full py-2.5 bg-slate-50 text-slate-700 font-semibold rounded-xl hover:bg-slate-100 transition-colors"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboardHome;
