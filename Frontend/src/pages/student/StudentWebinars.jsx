
import React, { useEffect, useState } from 'react';
import { getWebinars, registerForWebinar, getMyWebinarRegistrations } from '../../services/webinarApi';
import { Calendar, User, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const StudentWebinars = () => {
    const [webinars, setWebinars] = useState([]);
    const [student] = useState(JSON.parse(sessionStorage.getItem('student') || '{}'));
    const [registeredIds, setRegisteredIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [registeringId, setRegisteringId] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch webinars and registered IDs in parallel
            const userId = student?.id;
            const [webinarsRes, registrationsRes] = await Promise.all([
                getWebinars(userId),
                userId ? getMyWebinarRegistrations(userId) : Promise.resolve({ data: [] })
            ]);

            setWebinars(webinarsRes.data || []);
            setRegisteredIds(registrationsRes.data || []);
        } catch (err) {
            console.error("Error loading webinars:", err);
            setError("Failed to load webinars. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (webinar) => {
        if (!student?.id) {
            alert("Please login to register for webinars.");
            return;
        }

        setRegisteringId(webinar.id);
        try {
            const response = await registerForWebinar(webinar.id, student.id);
            if (response.data.success) {
                setRegisteredIds(prev => [...prev, webinar.id]);
                alert("Successfully registered for " + webinar.title + "!");
            }
        } catch (err) {
            console.error("Registration failed:", err);
            const message = err.response?.data?.error || "Failed to register. Please try again.";
            alert(message);
        } finally {
            setRegisteringId(null);
        }
    };

    // Helper to get webinar status
    const getWebinarStatus = (webinar) => {
        if (!webinar.date) return { label: 'No Date', color: 'bg-slate-100 text-slate-600' };
        const now = new Date();
        const webinarDate = new Date(webinar.date);
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const wDate = new Date(webinarDate.getFullYear(), webinarDate.getMonth(), webinarDate.getDate());

        if (wDate > today) return { label: 'Upcoming', color: 'bg-blue-100 text-blue-700' };
        if (wDate < today) return { label: 'Completed', color: 'bg-slate-100 text-slate-600' };
        return { label: 'Live Today', color: 'bg-green-100 text-green-700' };
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <AlertCircle className="mx-auto mb-4 text-red-400" size={48} />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h3>
                <p className="text-slate-500 mb-4">{error}</p>
                <button
                    onClick={loadData}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Upcoming Webinars</h1>
                <p className="text-slate-500">Explore and register for expert-led sessions.</p>
            </div>

            {webinars.length === 0 ? (
                <div className="text-center py-20">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No webinars available</h3>
                    <p className="text-slate-500">Check back later for upcoming sessions.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {webinars.map((webinar) => {
                        const isRegistered = registeredIds.includes(webinar.id);
                        const isRegistering = registeringId === webinar.id;
                        const status = getWebinarStatus(webinar);
                        const isCompleted = status.label === 'Completed';

                        return (
                            <div key={webinar.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={webinar.image}
                                        alt={webinar.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute top-4 right-4">
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${status.color}`}>
                                            {status.label}
                                        </span>
                                    </div>
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

                                    <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                                        {webinar.description}
                                    </p>

                                    {/* Show meeting link if registered */}
                                    {isRegistered && webinar.meetingLink && (
                                        <a
                                            href={webinar.meetingLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block text-center mb-3 py-2 px-4 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-colors"
                                        >
                                            🔗 Join Meeting
                                        </a>
                                    )}

                                    <button
                                        onClick={() => handleRegister(webinar)}
                                        disabled={isRegistered || isRegistering || isCompleted}
                                        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isRegistered
                                                ? 'bg-emerald-50 text-emerald-600 cursor-default'
                                                : isCompleted
                                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                                            }`}
                                    >
                                        {isRegistering ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Registering...
                                            </>
                                        ) : isRegistered ? (
                                            <>
                                                <CheckCircle size={20} /> Registered
                                            </>
                                        ) : isCompleted ? (
                                            "Webinar Ended"
                                        ) : (
                                            "Register Now"
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default StudentWebinars;
