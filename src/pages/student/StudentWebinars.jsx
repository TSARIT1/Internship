
import React, { useEffect, useState } from 'react';
import { getWebinars } from '../../services/webinarApi';
import { Calendar, User, Clock, CheckCircle } from 'lucide-react';

const StudentWebinars = () => {
    const [webinars, setWebinars] = useState([]);
    const [student, setStudent] = useState(JSON.parse(localStorage.getItem('student') || '{}'));
    const [registeredIds, setRegisteredIds] = useState([]);

    useEffect(() => {
        loadWebinars();

        // Initialize registered IDs from student data
        // Support both old format (single 'webinar' string) and new 'registeredWebinars' array
        const initialRegistered = new Set();
        if (student.webinar) initialRegistered.add(student.webinar); // Add legacy singular webinar name if matches title (approx)
        if (student.registeredWebinars) {
            student.registeredWebinars.forEach(id => initialRegistered.add(id));
        }
        setRegisteredIds(Array.from(initialRegistered));

    }, []);

    const loadWebinars = async () => {
        const response = await getWebinars();
        setWebinars(response.data || []);
    };

    const handleRegister = (webinar) => {
        // Mock Registration Logic
        // In a real app, this would call an API
        const updatedRegistered = [...registeredIds, webinar.id];
        setRegisteredIds(updatedRegistered);

        // Update local storage for persistence
        const updatedStudent = {
            ...student,
            registeredWebinars: updatedRegistered
        };
        setStudent(updatedStudent);
        localStorage.setItem('student', JSON.stringify(updatedStudent));

        // Optional: Call generic register API if needed but local update is enough for UI
        alert("Successfully registered for " + webinar.title);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Upcoming Webinars</h1>
                <p className="text-slate-500">Explore and register for expert-led sessions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {webinars.map((webinar) => {
                    const isRegistered = registeredIds.includes(webinar.id);

                    return (
                        <div key={webinar.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={webinar.image}
                                    alt={webinar.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <div className="flex items-center gap-2 text-sm font-medium mb-1">
                                        <Calendar size={14} /> {webinar.date}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-medium text-white/80">
                                        <Clock size={14} /> {webinar.time}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{webinar.title}</h3>

                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                        <User size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Speaker</p>
                                        <p className="text-sm font-medium text-slate-900">{webinar.speaker}</p>
                                    </div>
                                </div>

                                <p className="text-slate-500 text-sm mb-6 line-clamp-2">
                                    {webinar.description}
                                </p>

                                <button
                                    onClick={() => handleRegister(webinar)}
                                    disabled={isRegistered}
                                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isRegistered
                                            ? 'bg-emerald-50 text-emerald-600 cursor-default'
                                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                                        }`}
                                >
                                    {isRegistered ? (
                                        <>
                                            <CheckCircle size={20} /> Registered
                                        </>
                                    ) : (
                                        "Register Now"
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StudentWebinars;
