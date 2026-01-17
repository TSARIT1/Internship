
import React, { useEffect, useState } from 'react';
import { getWebinars } from '../../services/webinarApi';
import { Calendar, Clock, Video, Download, ExternalLink } from 'lucide-react';

const StudentRegistrations = () => {
    const [registrations, setRegistrations] = useState([]);
    const student = JSON.parse(localStorage.getItem('student') || '{}');

    useEffect(() => {
        const fetchRegistrations = async () => {
            const allWebinarsResponse = await getWebinars();
            const allWebinars = allWebinarsResponse.data || [];

            // Get registered IDs
            const registeredIds = student.registeredWebinars || [];
            if (student.webinar) {
                // Try to find by title if ID is missing (legacy support)
                const legacyMatch = allWebinars.find(w => w.title === student.webinar);
                if (legacyMatch && !registeredIds.includes(legacyMatch.id)) {
                    registeredIds.push(legacyMatch.id);
                }
            }

            // Filter
            const myWebinars = allWebinars.filter(w => registeredIds.includes(w.id));
            setRegistrations(myWebinars);
        };

        fetchRegistrations();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">My Registrations</h1>
                <p className="text-slate-500">Manage your upcoming registered sessions.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {registrations.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-left">
                                    <th className="px-6 py-4 font-bold text-slate-700 text-sm">Webinar</th>
                                    <th className="px-6 py-4 font-bold text-slate-700 text-sm">Date & Time</th>
                                    <th className="px-6 py-4 font-bold text-slate-700 text-sm">Speaker</th>
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
                                                <span className="font-semibold text-slate-900">{reg.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm">
                                                <div className="font-medium text-slate-900 flex items-center gap-1.5"><Calendar size={14} /> {reg.date}</div>
                                                <div className="text-slate-500 flex items-center gap-1.5 mt-1"><Clock size={14} /> {reg.time}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-medium">{reg.speaker}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Confirmed
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <a
                                                href={reg.meetingLink || "#"}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <Video size={16} /> Join
                                            </a>
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
                        <h3 className="text-lg font-bold text-slate-900 mb-1">No Registrations Yet</h3>
                        <p className="text-slate-500 mb-6">You haven't registered for any webinars.</p>
                        <a href="/studentdashboard/webinars" className="text-blue-600 font-semibold hover:underline">
                            Browse Webinars
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentRegistrations;
