import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Video,
    CalendarCheck,
    MessageSquare,
    BookOpen,
    Trophy,
    Receipt,
    Award,
    User,
    Sparkles,
    IdCard,
    HelpCircle
} from 'lucide-react';
import { formatStudentId } from '../utils/studentUtils';

const StudentSidebar = ({ onClose }) => {
    const student = JSON.parse(sessionStorage.getItem('student') || '{}');
    const studentIdFormatted = formatStudentId(student.id);

    const navItems = [
        { path: '/studentdashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard', exact: true },
        { path: '/studentdashboard/my-registrations', icon: <CalendarCheck size={18} />, label: 'My Enrolled Courses' },
        { path: '/studentdashboard/courses', icon: <BookOpen size={18} />, label: 'Course Catalog' },
        { path: '/studentdashboard/fees', icon: <Receipt size={18} />, label: 'Fees & Invoices' },
        { path: '/studentdashboard/certificates', icon: <Award size={18} />, label: 'Certificates' },
        { path: '/studentdashboard/tickets', icon: <HelpCircle size={18} />, label: 'Helpdesk & Tickets' },
        { path: '/studentdashboard/webinars', icon: <Video size={18} />, label: 'Webinars & Events' },
        { path: '/studentdashboard/hackathons', icon: <Trophy size={18} />, label: 'Hackathons' },
        { path: '/studentdashboard/testimonials', icon: <MessageSquare size={18} />, label: 'Reviews & Feedback' },
        { path: '/studentdashboard/profile', icon: <User size={18} />, label: 'My Profile & Settings' },
    ];

    return (
        <aside className="w-64 bg-white text-slate-700 h-screen flex flex-col fixed left-0 top-0 z-50 font-sans border-r border-slate-200/90 shadow-xs select-none">
            {/* Brand Header */}
            <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center font-black text-lg shadow-md shadow-blue-500/20 text-white">
                        T
                    </div>
                    <div>
                        <h1 className="font-black text-base tracking-tight text-slate-900 leading-none">
                            TSAR <span className="text-blue-600">IT</span>
                        </h1>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mt-1">Student Portal</span>
                    </div>
                </div>
            </div>

            {/* Student ID Card Badge */}
            <div className="p-4 border-b border-slate-100 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
                        {student.name ? student.name.charAt(0).toUpperCase() : (student.username ? student.username.charAt(0).toUpperCase() : 'S')}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-slate-900 truncate">
                            {student.name || student.username || 'Student'}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                            <IdCard size={12} className="text-blue-600 shrink-0" />
                            <span className="font-mono text-[11px] font-bold text-blue-700 truncate">
                                {studentIdFormatted}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto mt-2">
                <span className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">Navigation</span>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.exact}
                        onClick={onClose}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-xs font-bold ${isActive
                                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`
                        }
                    >
                        {item.icon}
                        <span className="truncate">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Bottom ID & Academic Badge */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/60">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-semibold">Academic Year</span>
                    <span className="font-extrabold text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded-md">2026 Batch</span>
                </div>
            </div>
        </aside>
    );
};

export default StudentSidebar;
