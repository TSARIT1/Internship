
import React from 'react';
import { User, LogOut, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentNavbar = () => {
    const navigate = useNavigate();
    const student = JSON.parse(localStorage.getItem('student') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('student');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
            {/* Left: Welcome (Optional, or Breadcrumbs) */}
            <div>
                <h2 className="text-lg font-bold text-slate-700">Student Portal</h2>
            </div>

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-6">
                {/* Notifications */}
                <button className="relative text-slate-400 hover:text-blue-600 transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="h-6 w-px bg-slate-200"></div>

                {/* Profile Dropdown Trigger */}
                <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-slate-900 leading-tight">{student.name || 'Student'}</p>
                        <p className="text-xs text-slate-500">{student.course || student.webinar || 'General'}</p>
                    </div>
                    <div
                        onClick={() => navigate('/studentdashboard/profile')}
                        className="cursor-pointer w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-100 shadow-sm hover:scale-105 transition-transform"
                        title="View Profile"
                    >
                        {student.name ? student.name.charAt(0) : <User size={20} />}
                    </div>

                    <button
                        onClick={handleLogout}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors ml-2"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default StudentNavbar;
