import React, { useState, useEffect, useRef } from 'react';
import { User, LogOut, Bell, Menu, X, Check, Sparkles, Trophy, BookOpen, Gift, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatStudentId } from '../utils/studentUtils';

const DEFAULT_NOTIFICATIONS = [
    {
        id: 1,
        title: "Welcome to TSAR IT Internship Portal",
        message: "Your official scholar profile is activated. Complete your milestones to earn certified credentials.",
        time: "Just now",
        type: "welcome",
        read: false,
        link: "/studentdashboard"
    },
    {
        id: 2,
        title: "Exclusive Scholarship Offer • 20% Off",
        message: "Use code TSAR20 on your next course enrollment for instant discount.",
        time: "2 hours ago",
        type: "offer",
        read: false,
        link: "/studentdashboard/courses"
    },
    {
        id: 3,
        title: "Upcoming National Hackathon 2026",
        message: "Registration is open for the 2026 AI Innovation Hackathon. Prize pool of ₹50,000!",
        time: "1 day ago",
        type: "hackathon",
        read: false,
        link: "/studentdashboard/hackathons"
    },
    {
        id: 4,
        title: "Course Invoices & Tax Receipts Ready",
        message: "Your verified tuition fee receipts are available in your Fees section.",
        time: "2 days ago",
        type: "invoice",
        read: true,
        link: "/studentdashboard/fees"
    }
];

const StudentNavbar = ({ onToggleSidebar }) => {
    const navigate = useNavigate();
    const student = JSON.parse(sessionStorage.getItem('student') || '{}');
    const studentIdFormatted = formatStudentId(student.id);

    const [showConfirmLogout, setShowConfirmLogout] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem('student_notifications');
        return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
    });

    const notifRef = useRef(null);

    // Save notifications to localStorage when changed
    useEffect(() => {
        localStorage.setItem('student_notifications', JSON.stringify(notifications));
    }, [notifications]);

    // Close notification dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const handleNotifClick = (notif) => {
        setNotifications(notifications.map(n => n.id === notif.id ? { ...n, read: true } : n));
        setShowNotifications(false);
        if (notif.link) {
            navigate(notif.link);
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        localStorage.clear();
        navigate('/login');
    };

    const getIcon = (type) => {
        switch (type) {
            case 'offer':
                return <Gift size={16} className="text-amber-600" />;
            case 'hackathon':
                return <Trophy size={16} className="text-purple-600" />;
            case 'invoice':
                return <Award size={16} className="text-emerald-600" />;
            default:
                return <Sparkles size={16} className="text-blue-600" />;
        }
    };

    return (
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40 shadow-xs font-sans">
            {/* Left: Mobile Toggle & Header */}
            <div className="flex items-center gap-3">
                {onToggleSidebar && (
                    <button
                        onClick={onToggleSidebar}
                        className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        aria-label="Toggle Navigation"
                    >
                        <Menu size={20} />
                    </button>
                )}
                <div>
                    <h2 className="text-sm sm:text-base font-extrabold text-slate-800 flex items-center gap-2">
                        <span>Student Portal</span>
                    </h2>
                </div>
            </div>

            {/* Right: Notifications, Student ID Badge & Logout */}
            <div className="flex items-center gap-3 sm:gap-5">
                {/* Notification Bell with Dropdown */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50/80 transition-all cursor-pointer"
                        title="Notifications & Announcements"
                        aria-label="Notifications"
                    >
                        <Bell size={19} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown Panel */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-fadeIn">
                            <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Bell size={16} className="text-blue-600" />
                                    <h4 className="font-extrabold text-sm text-slate-900">Notifications & Offers</h4>
                                </div>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
                                    >
                                        <Check size={12} /> Mark all read
                                    </button>
                                )}
                            </div>

                            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                                {notifications.length > 0 ? (
                                    notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            onClick={() => handleNotifClick(notif)}
                                            className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 items-start ${
                                                !notif.read ? 'bg-blue-50/40' : ''
                                            }`}
                                        >
                                            <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-xs shrink-0 mt-0.5">
                                                {getIcon(notif.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-1">
                                                    <h5 className={`text-xs font-bold truncate ${!notif.read ? 'text-blue-900' : 'text-slate-800'}`}>
                                                        {notif.title}
                                                    </h5>
                                                    {!notif.read && (
                                                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed line-clamp-2">
                                                    {notif.message}
                                                </p>
                                                <span className="text-[10px] text-slate-400 font-medium block mt-1">
                                                    {notif.time}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-slate-400 text-xs">
                                        No notifications right now.
                                    </div>
                                )}
                            </div>

                            <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                                <button
                                    onClick={() => {
                                        setShowNotifications(false);
                                        navigate('/studentdashboard/courses');
                                    }}
                                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1 w-full"
                                >
                                    Explore Active Offers & Discounts <ArrowRight size={13} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-5 w-px bg-slate-200"></div>

                {/* Student Avatar & ID Badge */}
                <div
                    onClick={() => navigate('/studentdashboard/profile')}
                    className="flex items-center gap-3 cursor-pointer p-1 rounded-2xl hover:bg-slate-50 transition-colors"
                    title="View Profile Settings"
                >
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                        {student.name ? student.name.charAt(0).toUpperCase() : (student.username ? student.username.charAt(0).toUpperCase() : 'S')}
                    </div>
                    <div className="text-left hidden sm:block">
                        <p className="text-xs font-black text-slate-900 leading-tight">
                            {student.name || student.username || 'Student'}
                        </p>
                        <span className="font-mono text-[10px] font-bold text-blue-600 block">
                            ID: {studentIdFormatted}
                        </span>
                    </div>
                </div>

                {/* Logout Action */}
                <button
                    onClick={() => setShowConfirmLogout(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer border border-slate-200 hover:border-red-200"
                    title="Sign Out"
                >
                    <LogOut size={14} />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>

            {/* Logout Confirmation Modal */}
            {showConfirmLogout && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-fadeIn">
                    <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                            <LogOut size={22} />
                        </div>
                        <h3 className="text-lg font-black text-slate-900">Sign Out of Student Portal?</h3>
                        <p className="text-xs text-slate-500 mt-1 mb-6">
                            You will need to enter your email and password to log in again.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setShowConfirmLogout(false)}
                                className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-xs text-slate-700 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 font-bold text-xs text-white shadow-md transition-colors cursor-pointer"
                            >
                                Yes, Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default StudentNavbar;
