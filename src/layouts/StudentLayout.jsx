
import React from 'react';
import { Outlet } from 'react-router-dom';
import StudentSidebar from '../components/StudentSidebar';

const StudentLayout = () => {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <StudentSidebar />
            <main className="flex-1 w-full ml-64 p-8 overflow-x-hidden">
                <Outlet />
            </main>
        </div>
    );
};

export default StudentLayout;
