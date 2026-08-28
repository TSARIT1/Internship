import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Video,
    MessageSquareQuote,
    Users,
    LogOut,
    Menu,
    X,
    ChevronRight,
    CircleDollarSign,
    BookOpen,
    Server,
    Code,
    UserCog,
    HelpCircle,
    Award,
    ShieldCheck,
    Receipt
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            sessionStorage.removeItem('adminToken');
            sessionStorage.removeItem('isAdmin');
            sessionStorage.removeItem('token');
            navigate('/admin/login');
        }
    };

    const menuGroups = [
        {
            group: 'Core Operations',
            items: [
                { path: '/admin/dashboard', name: 'Dashboard', icon: LayoutDashboard },
                { path: '/admin/students', name: 'Students', icon: Users },
                { path: '/admin/certificates', name: 'Certificates', icon: Award },
                { path: '/admin/tickets', name: 'Support Tickets', icon: HelpCircle },
                { path: '/admin/leads', name: 'Admissions Leads', icon: UserCog },
                { path: '/admin/payments', name: 'Payments', icon: CircleDollarSign },
            ]
        },
        {
            group: 'Curriculum & Programs',
            items: [
                { path: '/admin/courses', name: 'Tech Courses', icon: BookOpen },
                { path: '/admin/course-content', name: 'Curriculum Content', icon: Video },
                { path: '/admin/pricing', name: 'Course Pricing', icon: Receipt },
                { path: '/admin/problems', name: 'Coding Problems', icon: Code },
                { path: '/admin/hackathons', name: 'Hackathons', icon: Server },
                { path: '/admin/webinars', name: 'Webinars', icon: Video },
            ]
        },
        {
            group: 'Community & System',
            items: [
                { path: '/admin/testimonials', name: 'Testimonials', icon: MessageSquareQuote },
                { path: '/admin/video-testimonials', name: 'Video Reviews', icon: Video },
                { path: '/admin/profile', name: 'Admin Profile', icon: ShieldCheck },
            ]
        }
    ];

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-700"
                aria-label="Toggle Sidebar"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Backdrop for Mobile */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-40"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <aside className={`
                fixed lg:sticky top-0 left-0 z-40 h-screen w-64
                transition-transform duration-300 ease-in-out shrink-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="flex flex-col h-full bg-slate-900 text-white border-r border-slate-800 shadow-2xl">
                    
                    {/* Header Brand */}
                    <div className="p-4 sm:p-5 border-b border-slate-800 shrink-0 bg-slate-950/60">
                        <div className="flex items-center gap-3">
                            <img 
                                src="/logo-main.jpeg" 
                                alt="TSAR IT" 
                                className="w-9 h-9 rounded-xl object-contain bg-white/10 p-0.5 shadow-md shadow-blue-600/30"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/tsar-logo.jpg';
                                }}
                            />
                            <div className="min-w-0">
                                <h1 className="font-black text-sm text-white truncate tracking-tight font-display">
                                    TSAR IT INTERNSHIP
                                </h1>
                                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                                    Super Admin Control
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Navigation Menu */}
                    <nav className="flex-1 p-3 space-y-4 overflow-y-auto custom-sidebar-scroll">
                        {menuGroups.map((grp, idx) => (
                            <div key={idx} className="space-y-1">
                                <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                                    {grp.group}
                                </div>
                                {grp.items.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                                        className={({ isActive }) => `
                                            flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 group
                                            ${isActive
                                                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 font-extrabold'
                                                : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                                            }
                                        `}
                                    >
                                        <item.icon size={17} className="group-hover:scale-110 transition-transform shrink-0" />
                                        <span className="flex-1 truncate">{item.name}</span>
                                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                                    </NavLink>
                                ))}
                            </div>
                        ))}
                    </nav>

                    {/* Footer Logout */}
                    <div className="p-3 border-t border-slate-800 shrink-0 bg-slate-950/40">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2.5 px-3 py-2 w-full text-left text-xs font-extrabold text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all cursor-pointer"
                        >
                            <LogOut size={16} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
