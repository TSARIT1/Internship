
import React from 'react';
import { Outlet } from 'react-router-dom';
import StudentSidebar from '../components/StudentSidebar';
import StudentNavbar from '../components/StudentNavbar';

const StudentLayout = () => {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <StudentSidebar />

            <div className="flex-1 flex flex-col ml-64 min-w-0">
                <StudentNavbar />

                <main className="flex-1 p-8 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StudentLayout;
