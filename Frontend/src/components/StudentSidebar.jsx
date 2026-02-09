
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Video, CalendarCheck, MessageSquare, BookOpen, Trophy } from 'lucide-react';

const StudentSidebar = () => {
    const navItems = [
        { path: '/studentdashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard', exact: true },
        { path: '/studentdashboard/webinars', icon: <Video size={20} />, label: 'Webinars' },
        { path: '/studentdashboard/courses', icon: <BookOpen size={20} />, label: 'Courses / Internships' },
        { path: '/studentdashboard/my-registrations', icon: <CalendarCheck size={20} />, label: 'My Registrations' },
        { path: '/studentdashboard/hackathons', icon: <Trophy size={20} />, label: 'Hackathons' },
        { path: '/studentdashboard/testimonials', icon: <MessageSquare size={20} />, label: 'Testimonials' },
    ];

    return (
        <div className="w-64 bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0 z-50 shadow-xl">
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-600/20">
                        S
                    </div>
                    <h1 className="font-bold text-lg tracking-tight">Student<span className="text-blue-500">Portal</span></h1>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.exact}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 translate-x-1'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1'
                            }`
                        }
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer / Copyright optional */}
            <div className="p-6 text-xs text-slate-600 text-center">
                © 2026 Tsarit.com
            </div>
        </div>
    );
};

export default StudentSidebar;
