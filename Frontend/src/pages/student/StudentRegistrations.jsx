
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getWebinars } from '../../services/webinarApi';
import { getPricing } from '../../services/studentApi';
import { Calendar, Video, PlayCircle } from 'lucide-react';

const StudentRegistrations = () => {
    const [registrations, setRegistrations] = useState([]);
    const student = JSON.parse(localStorage.getItem('student') || '{}');

    useEffect(() => {
        const fetchRegistrations = async () => {
            const [allWebinarsResponse, allCoursesResponse] = await Promise.all([
                getWebinars(),
                getPricing()
            ]);

            const allWebinars = allWebinarsResponse.data || [];
            const allCourses = allCoursesResponse.data || [];

            let myRegistrations = [];

            // 1. Handle Webinars
            const registeredIds = student.registeredWebinars || [];

            // Legacy webinar support (stored as string name)
            if (student.webinar) {
                const legacyMatch = allWebinars.find(w => w.title === student.webinar);
                if (legacyMatch && !registeredIds.some(r => (typeof r === 'object' ? r.id : r) === legacyMatch.id)) {
                    registeredIds.push({ id: legacyMatch.id, registeredAt: null }); // Treat legacy as object with null date
                }
            }

            const getRegistrationDate = (id) => {
                const entry = registeredIds.find(r => (typeof r === 'object' ? r.id : r) === id);
                if (entry && typeof entry === 'object' && entry.registeredAt) {
                    return new Date(entry.registeredAt).toLocaleDateString();
                }
                return "-";
            };

            const registeredIdValues = registeredIds.map(r => typeof r === 'object' ? r.id : r);
            const webinarMatches = allWebinars.filter(w => registeredIdValues.includes(w.id));

            myRegistrations = webinarMatches.map(w => ({
                ...w,
                type: 'webinar',
                registrationDate: getRegistrationDate(w.id)
            }));

            // 2. Handle Courses (Internships)
            // Check if student.course or student.webinar matches a Course Name
            const courseName = student.course || student.webinar;
            if (courseName) {
                const courseMatch = allCourses.find(c => c.course === courseName);
                if (courseMatch) {
                    // Check if already added
                    const alreadyExists = myRegistrations.some(r => r.title === courseMatch.course);
                    if (!alreadyExists) {
                        myRegistrations.push({
                            id: `course-${courseMatch.course}`,
                            title: courseMatch.course,
                            type: 'course',
                            date: 'Self-paced',
                            time: 'Flexible',
                            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop',
                            description: courseMatch.description,
                            registrationDate: '-' // Course registration date not tracked in this flow yet
                        });
                    }
                }
            }

            setRegistrations(myRegistrations);
        };

        fetchRegistrations();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">My Learning</h1>
                <p className="text-slate-500">Access your registered courses and webinars.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {registrations.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-left">
                                    <th className="px-6 py-4 font-bold text-slate-700 text-sm">Program</th>
                                    <th className="px-6 py-4 font-bold text-slate-700 text-sm">Type</th>
                                    <th className="px-6 py-4 font-bold text-slate-700 text-sm">Registration Date</th>
                                    <th className="px-6 py-4 font-bold text-slate-700 text-sm">Status</th>
                                    <th className="px-6 py-4 font-bold text-slate-700 text-sm text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {registrations.map((reg) => (
                                    <tr key={reg.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden">
                                                    <img src={reg.image} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-slate-900 block">{reg.title}</span>
                                                    <span className="text-xs text-slate-500">{reg.date} • {reg.time}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${reg.type === 'course' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {reg.type === 'course' ? 'Course' : 'Webinar'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {reg.registrationDate}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {reg.type === 'course' ? (
                                                <Link
                                                    to={`/student/course/${encodeURIComponent(reg.title)}`}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                                                >
                                                    <PlayCircle size={16} /> Go To Section
                                                </Link>
                                            ) : (
                                                new Date(reg.date) >= new Date() ? (
                                                    <a
                                                        href={reg.meetingLink || "#"}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                                    >
                                                        <Video size={16} /> Join
                                                    </a>
                                                ) : (
                                                    <button className="text-blue-600 text-sm font-medium hover:underline">
                                                        Watch Replay
                                                    </button>
                                                )
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">No Active Enrollments</h3>
                        <p className="text-slate-500 mb-6">You haven't enrolled in any courses or webinars yet.</p>
                        <Link to="/studentdashboard/courses" className="text-blue-600 font-semibold hover:underline">
                            Browse Courses
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentRegistrations;
