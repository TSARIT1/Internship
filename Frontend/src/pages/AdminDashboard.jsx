import React from 'react';
import { Users, Video, MessageSquareQuote, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { getAdminStats, getContactQueries } from '../services/studentApi';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow">
        <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-white ${color}`}>
            <Icon size={32} />
        </div>
        <div>
            <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-slate-900 font-display">{value}</h3>
        </div>
    </div>
);

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [statsData, setStatsData] = React.useState({
        totalStudents: 0,
        totalWebinars: 0,
        totalTestimonials: 0,
        totalRevenue: 0,
        totalCourses: 0
    });

    const fetchStats = async () => {
        const res = await getAdminStats();
        if (res.success) {
            setStatsData(res.data);
        }
    };

    const [queries, setQueries] = React.useState([]);

    const fetchQueries = async () => {
        const res = await getContactQueries();
        if (res.success && res.data) {
            setQueries(res.data.reverse().slice(0, 5));
        }
    };

    React.useEffect(() => {
        fetchStats();
        fetchQueries();
    }, []);

    // Formatted Data for Display
    const stats = [
        { title: 'Total Revenue', value: `₹${statsData.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'bg-green-600' },
        { title: 'Registered Students', value: statsData.totalStudents, icon: Users, color: 'bg-purple-600' },
        { title: 'Webinars', value: statsData.totalWebinars, icon: Video, color: 'bg-blue-600' },
        { title: 'Testimonials', value: statsData.totalTestimonials, icon: MessageSquareQuote, color: 'bg-emerald-500' },
    ];

    return (
        <div className="p-6 md:p-12 max-w-7xl mx-auto">
            <header className="mb-12">
                <h1 className="text-3xl font-bold text-slate-900 font-display">TSAR IT INTERNSHIP — Admin Dashboard</h1>
                <p className="text-slate-500">Overview of admissions, inquiries, revenue, and active batches.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Inquiries & Leads */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center justify-between">
                        <span>Recent Counseling Leads</span>
                        <span className="text-xs bg-blue-50 text-blue-600 font-bold px-2.5 py-1 rounded-full">{queries.length} Recent</span>
                    </h2>
                    <div className="space-y-3">
                        {queries.length > 0 ? (
                            queries.map((q, i) => (
                                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                                    <div>
                                        <div className="font-bold text-slate-900">{q.name || 'Anonymous Lead'}</div>
                                        <div className="text-slate-500">{q.email || q.phone} • <span className="text-blue-600 font-semibold">{q.course || q.subject || 'General'}</span></div>
                                    </div>
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">NEW</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-400 text-sm py-4 text-center">No new inquiries yet.</p>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Management Actions</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => navigate('/admin/courses')}
                                className="p-4 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 font-bold text-xs transition-colors text-center border border-slate-100 cursor-pointer"
                            >
                                Manage Tech Courses & Content
                            </button>
                            <button
                                onClick={() => navigate('/admin/students')}
                                className="p-4 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-600 font-bold text-xs transition-colors text-center border border-slate-100 cursor-pointer"
                            >
                                View Enrolled Students
                            </button>
                            <button
                                onClick={() => navigate('/admin/pricing')}
                                className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 font-bold text-xs transition-colors text-center border border-slate-100 cursor-pointer"
                            >
                                Update Course Pricing
                            </button>
                            <button
                                onClick={() => navigate('/admin/webinars')}
                                className="p-4 rounded-xl bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-600 font-bold text-xs transition-colors text-center border border-slate-100 cursor-pointer"
                            >
                                Schedule Webinar
                            </button>
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400">
                        Admin Portal • TSAR IT Services
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
