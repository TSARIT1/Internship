
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Video, CalendarCheck, MessageSquare, LogOut, User } from 'lucide-react';

const StudentSidebar = () => {
    const navigate = useNavigate();
    const student = JSON.parse(localStorage.getItem('student') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('student');
        navigate('/login');
    };

    const navItems = [
        { path: '/studentdashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard', exact: true },
        { path: '/studentdashboard/webinars', icon: <Video size={20} />, label: 'Webinars' },
        { path: '/studentdashboard/my-registrations', icon: <CalendarCheck size={20} />, label: 'My Registrations' },
        { path: '/studentdashboard/testimonials', icon: <MessageSquare size={20} />, label: 'Testimonials' },
    ];

    return (
        <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col fixed left-0 top-0 z-50">
            {/* Logo Area */}
            <div className="p-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-600/20">
                        S
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">Student<br />Portal</h1>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.exact}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`
                        }
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-slate-800 bg-slate-900">
                <div className="bg-slate-800/50 rounded-xl p-4 mb-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                        <User size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate text-white">{student.name || 'Student'}</p>
                        <p className="text-xs text-slate-400 truncate">{student.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 w-full px-4 py-3 rounded-xl transition-all font-medium text-sm"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default StudentSidebar;
