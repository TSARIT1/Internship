import React from 'react';
import { Users, Video, MessageSquareQuote, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

    // Mock Data
    const stats = [
        { title: 'Total Webinars', value: '12', icon: Video, color: 'bg-blue-600' },
        { title: 'Registered Students', value: '1,240', icon: Users, color: 'bg-purple-600' },
        { title: 'Testimonials', value: '45', icon: MessageSquareQuote, color: 'bg-emerald-500' },
        { title: 'Active Workshops', value: '3', icon: TrendingUp, color: 'bg-orange-500' },
    ];

    return (
        <div className="p-6 md:p-12 max-w-7xl mx-auto">
            <header className="mb-12">
                <h1 className="text-3xl font-bold text-slate-900 font-display">Dashboard Overview</h1>
                <p className="text-slate-500">Welcome back, Admin</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Activity Mock */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-50 last:border-0">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                                    JS
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">New registration for <span className="text-blue-600">React Masterclass</span></p>
                                    <p className="text-xs text-slate-400">2 minutes ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => navigate('/admin/webinars')}
                            className="p-4 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 font-medium transition-colors text-center border border-slate-100"
                        >
                            Add Webinar
                        </button>
                        <button
                            onClick={() => navigate('/admin/students')}
                            className="p-4 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-purple-600 font-medium transition-colors text-center border border-slate-100"
                        >
                            View Students
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
