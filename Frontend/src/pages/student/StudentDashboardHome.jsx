import React, { useEffect, useState } from 'react';
import { getWebinars } from '../../services/webinarApi';
import { getPricing, getMyEnrollments, getHackathons } from '../../services/studentApi';
import { getIcon } from '../../utils/IconMapper';
import { Calendar, Clock, ArrowRight, BookOpen, CheckCircle, Video, Award, Trophy, User, Bell, Download, LifeBuoy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import CertificateTemplate from '../../components/CertificateTemplate';
import { useRef } from 'react';
import ShinyButton from '../../components/ui/ShinyButton';

const StudentDashboardHome = () => {
    const student = JSON.parse(localStorage.getItem('student') || '{}');
    const navigate = useNavigate();
    const [upcomingWebinar, setUpcomingWebinar] = useState(null);
    const [hackathons, setHackathons] = useState([]);
    const [enrollments, setEnrollments] = useState([]);

    // State for certificate generation
    const [certificateData, setCertificateData] = useState({
        studentName: student.name,
        courseName: student.webinar || student.course || "Course Completion",
        date: student.certificateDate || new Date().toLocaleDateString()
    });

    const [stats, setStats] = useState({
        upcomingWebinars: 0,
        registeredWebinars: 0,
        activeHackathons: 0,
        availableCourses: 0
    });

    const [availableCourses, setAvailableCourses] = useState([]);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        const fetchData = async () => {
            try {
                const [webinarsRes, coursesRes, enrollmentsRes, hackathonsRes] = await Promise.all([
                    getWebinars(),
                    getPricing(),
                    getMyEnrollments(student.id),
                    getHackathons()
                ]);

                const allWebinars = webinarsRes.data || [];
                const allCourses = coursesRes.data || [];
                const allHackathons = hackathonsRes.success ? hackathonsRes.data : [];
                setHackathons(allHackathons);
                setAvailableCourses(allCourses.slice(0, 3));

                const myEnrollments = enrollmentsRes.success ? enrollmentsRes.data : [];
                // Use real progress data from backend, default to 0 if null
                const enrichedEnrollments = myEnrollments.map(e => ({
                    ...e,
                    progress: e.progress || 0,
                    lastAccessed: 'Recently' // Still mock for now as we don't track access time yet
                }));
                setEnrollments(enrichedEnrollments);

                // Upcoming Webinars Count
                const upcoming = allWebinars.filter(w => new Date(w.date) >= new Date());
                const registeredIds = student.registeredWebinars || [];
                let registeredCount = registeredIds.length;
                if (student.webinar && !registeredIds.some(r => (typeof r === 'object' ? r.id : r) === allWebinars.find(w => w.title === student.webinar)?.id)) {
                    if (registeredCount === 0) registeredCount = 1;
                }

                const next = upcoming.sort((a, b) => new Date(a.date) - new Date(b.date))[0];
                setUpcomingWebinar(next);
                setStats({
                    upcomingWebinars: upcoming.length,
                    registeredWebinars: registeredCount,
                    activeHackathons: allHackathons.length,
                    availableCourses: allCourses.length
                });

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            }
        };
        fetchData();
    }, [student.id, student.registeredWebinars, student.webinar]);

    // Legacy fallback
    const enrolledCourse = student.webinar || student.course;
    const certificateRef = useRef(null);
    const [downloading, setDownloading] = useState(false);

    const handleDownloadCertificate = async (specificEnrollment = null) => {
        if (!certificateRef.current) return;
        setDownloading(true);

        if (specificEnrollment) {
            setCertificateData({
                studentName: student.name,
                courseName: specificEnrollment.courseName,
                date: specificEnrollment.certificateDate || new Date().toISOString().split('T')[0],
                certificateId: specificEnrollment.certificateId // Get ID from enrollment
            });
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        try {
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            const sName = student?.name || "Student";
            const cName = specificEnrollment?.courseName || "Course";

            const fileName = specificEnrollment
                ? `${sName.replace(/\s+/g, '_')}_${cName.replace(/\s+/g, '_')}_Certificate.pdf`
                : `${sName.replace(/\s+/g, '_')}_Certificate.pdf`;
            pdf.save(fileName);
        } catch (error) {
            console.error("Certificate download failed", error);
        } finally {
            setDownloading(false);
        }
    };

    const isProfileComplete = student.name && student.phone && /^\d{10}$/.test(student.phone);

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-50 pointer-events-none"></div>
                <div className="relative">
                    <h1 className="text-3xl font-bold font-display text-slate-900 tracking-tight">
                        {greeting}, <span className="text-blue-600">{student.name?.split(' ')[0]}</span>! 👋
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">You're making great progress. Keep it up!</p>
                </div>
                <div className="flex items-center gap-3 relative">
                    <div className="text-right hidden md:block mr-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today</p>
                        <p className="text-sm font-semibold text-slate-700">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>
            </header>

            {/* Profile Alert */}
            {!isProfileComplete && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
                    <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                        <User size={20} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-amber-800">Complete Your Profile</h3>
                        <p className="text-sm text-amber-700 mt-1">
                            Your profile is missing important details (Phone Number). Please update it to ensure smooth certification and enrollment.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/studentdashboard/profile')}
                        className="px-4 py-2 bg-amber-600 text-white text-sm font-bold rounded-lg hover:bg-amber-700 transition-colors"
                    >
                        Update Now
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area (Left 2/3) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Active Courses with Progress */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <BookOpen size={20} className="text-blue-600" />
                                Active Courses
                            </h2>
                        </div>

                        {enrollments.length > 0 ? (
                            <div className="space-y-4">
                                {enrollments.map((enrollment) => (
                                    <div key={enrollment.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600"></div>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                                                        {enrollment.status || "In Progress"}
                                                    </span>
                                                    {enrollment.certificateIssued && (
                                                        <span className="bg-yellow-100 text-yellow-700 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                                            <Award size={10} /> Certified
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-900 mb-1">{enrollment.courseName}</h3>
                                                <p className="text-slate-500 text-sm">Last accessed: {enrollment.lastAccessed || 'Recently'}</p>

                                                {/* Progress Bar */}
                                                <div className="mt-4 max-w-md">
                                                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1.5">
                                                        <span>Progress</span>
                                                        <span>{enrollment.progress || 15}%</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out"
                                                            style={{ width: `${enrollment.progress || 15}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 min-w-[140px]">
                                                <button
                                                    onClick={() => navigate(`/student/course/${encodeURIComponent(enrollment.courseName)}`)}
                                                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors shadow-blue-200 shadow-sm"
                                                >
                                                    Continue Learning
                                                </button>
                                                {enrollment.certificateIssued && (
                                                    <button
                                                        onClick={() => handleDownloadCertificate(enrollment)}
                                                        className="w-full bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <Award size={14} /> Certificate
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            // Fallback for legacy local state if no API enrollments
                            enrolledCourse ? (
                                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600"></div>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                                                Active
                                            </span>
                                            <h3 className="text-lg font-bold text-slate-900 mb-1">{enrolledCourse}</h3>
                                            <p className="text-slate-500 text-sm">Continue where you left off</p>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/student/course/${encodeURIComponent(enrolledCourse)}`)}
                                            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors shadow-blue-200 shadow-sm"
                                        >
                                            Go to Classroom
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-slate-50 rounded-xl p-8 border border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-slate-300">
                                        <BookOpen size={32} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">No Active Courses</h3>
                                    <p className="text-slate-500 text-sm mb-4 max-w-xs">Start your learning journey today by enrolling in one of our premium internships.</p>
                                    <button
                                        onClick={() => navigate('/studentdashboard/courses')}
                                        className="text-blue-600 font-bold text-sm hover:underline"
                                    >
                                        Browse Catalog
                                    </button>
                                </div>
                            )
                        )}
                    </div>

                    {/* Hackathons Section Overhaul */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <Trophy size={20} className="text-emerald-600" />
                                Upcoming Hackathons
                            </h2>
                            <button onClick={() => navigate('/studentdashboard/hackathons')} className="text-sm font-bold text-emerald-600 hover:text-emerald-700">View All</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {hackathons.slice(0, 2).map((hackathon) => (
                                <div key={hackathon.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                                    {/* Decorative Background Element */}
                                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-100 transform group-hover:rotate-6 transition-transform">
                                                <Trophy size={22} strokeWidth={2} />
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${hackathon.status === 'Open' || hackathon.status === 'Registering'
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                : 'bg-slate-50 text-slate-600 border-slate-100'
                                                }`}>
                                                {hackathon.status || 'Upcoming'}
                                            </span>
                                        </div>

                                        <h3 className="font-bold text-slate-900 text-xl mb-2 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                                            {hackathon.title}
                                        </h3>

                                        <p className="text-slate-500 text-sm mb-5 line-clamp-2">
                                            Join active developers to build innovative solutions.
                                        </p>

                                        <div className="flex flex-col gap-2 mb-6 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                                <Calendar size={14} className="text-emerald-500" />
                                                <span>{hackathon.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                                <Award size={14} className="text-amber-500" />
                                                <span>Prize Pool: <span className="font-bold text-slate-900">{hackathon.prizePool}</span></span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => navigate('/studentdashboard/hackathons')}
                                            className="w-full py-3 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-emerald-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group-hover:gap-3"
                                        >
                                            View Details <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {hackathons.length === 0 && (
                                <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center">
                                    <Trophy size={48} className="text-slate-200 mb-3" />
                                    <p>No hackathons scheduled at the moment.</p>
                                    <p className="text-xs mt-1">Check back later for exciting events!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar/Right Column (Right 1/3) */}
                <div className="space-y-6">

                    {/* Recent Activity Feed */}
                    <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Clock size={18} className="text-slate-400" /> Recent Activity
                        </h3>
                        <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                            {/* Mock Activity Data */}
                            <div className="relative pl-8">
                                <div className="absolute left-0 top-0.5 w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-500"></div>
                                <p className="text-sm font-medium text-slate-800">Logged in successfully</p>
                                <p className="text-xs text-slate-400 mt-0.5">Just now</p>
                            </div>
                            <div className="relative pl-8">
                                <div className="absolute left-0 top-0.5 w-4 h-4 rounded-full bg-emerald-100 border-2 border-emerald-500"></div>
                                <p className="text-sm font-medium text-slate-800">Checked {enrolledCourse || "Courses"}</p>
                                <p className="text-xs text-slate-400 mt-0.5">2 hours ago</p>
                            </div>
                            <div className="relative pl-8">
                                <div className="absolute left-0 top-0.5 w-4 h-4 rounded-full bg-purple-100 border-2 border-purple-500"></div>
                                <p className="text-sm font-medium text-slate-800">Updated Profile</p>
                                <p className="text-xs text-slate-400 mt-0.5">Yesterday</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white shadow-lg">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            Quick Actions
                        </h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/studentdashboard/profile')}
                                className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium"
                            >
                                <User size={16} /> Edit Profile
                            </button>
                            <button
                                onClick={() => navigate('/contact')}
                                className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-medium"
                            >
                                <LifeBuoy size={16} /> Contact Support
                            </button>
                        </div>
                    </div>

                    {/* Stats Summary */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
                            <div className="text-2xl font-bold text-blue-600 mb-1">{stats.upcomingWebinars}</div>
                            <div className="text-xs font-bold text-slate-500 uppercase">Webinars</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-center">
                            <div className="text-2xl font-bold text-purple-600 mb-1">{stats.registeredWebinars}</div>
                            <div className="text-xs font-bold text-slate-500 uppercase">Registered</div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Global Certificate Template - Hidden */}
            <div className="absolute top-0 left-0 -z-50 opacity-0 pointer-events-none" style={{ position: 'fixed', left: '-9999px' }}>
                <CertificateTemplate
                    ref={certificateRef}
                    studentName={certificateData.studentName}
                    courseName={certificateData.courseName}
                    date={certificateData.date}
                    certificateId={certificateData.certificateId} // Pass unique ID
                    duration="8 Weeks"
                />
            </div>
        </div >
    );
};

export default StudentDashboardHome;
