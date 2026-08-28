import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import StudentSidebar from '../components/StudentSidebar';
import StudentNavbar from '../components/StudentNavbar';
import { X } from 'lucide-react';

const StudentLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <StudentSidebar />
            </div>

            {/* Mobile Drawer */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex">
                    <div
                        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <div className="relative z-50 flex">
                        <StudentSidebar onClose={() => setSidebarOpen(false)} />
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="absolute top-4 -right-12 p-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
                <StudentNavbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

                <main className="flex-1 p-4 sm:p-8 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StudentLayout;
