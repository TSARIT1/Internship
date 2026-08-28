import React, { useEffect, useState, useRef } from 'react';
import { getWebinars } from '../../services/webinarApi';
import { getPricing, getMyEnrollments, getHackathons } from '../../services/studentApi';
import {
    Calendar,
    Clock,
    ArrowRight,
    BookOpen,
    CheckCircle,
    Video,
    Award,
    Trophy,
    User,
    Download,
    Receipt,
    Sparkles,
    PlayCircle,
    TrendingUp,
    Gift,
    Tag,
    Bell,
    Check,
    IdCard,
    Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import CertificateTemplate from '../../components/CertificateTemplate';
import { formatStudentId } from '../../utils/studentUtils';

const StudentDashboardHome = () => {
    const student = JSON.parse(sessionStorage.getItem('student') || '{}');
    const navigate = useNavigate();
    const studentIdFormatted = formatStudentId(student.id);

    const [upcomingWebinar, setUpcomingWebinar] = useState(null);
    const [hackathons, setHackathons] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [certificateData, setCertificateData] = useState({
        studentName: student.name || student.username || 'Student',
        courseName: student.course || "Internship Program",
        date: new Date().toLocaleDateString(),
        certificateId: 'CERT-TSAR-2026'
    });

    const [stats, setStats] = useState({
        enrolledCourses: 0,
        completedMilestones: 0,
        upcomingWebinars: 0,
        activeHackathons: 0
    });

    const [greeting, setGreeting] = useState('');
    const certificateRef = useRef(null);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        const fetchData = async () => {
            if (!student.id) {
                setLoading(false);
                return;
            }
            try {
                const [webinarsRes, enrollmentsRes, hackathonsRes] = await Promise.all([
                    getWebinars(),
                    getMyEnrollments(student.id),
                    getHackathons()
                ]);

                const allWebinars = webinarsRes.data || [];
                const allHackathons = hackathonsRes.success ? hackathonsRes.data : [];
                const myEnrollments = enrollmentsRes.success ? enrollmentsRes.data : [];

                setHackathons(allHackathons);
                setEnrollments(myEnrollments);

                const upcoming = allWebinars.filter(w => new Date(w.date) >= new Date());
                setUpcomingWebinar(upcoming[0] || allWebinars[0]);

                setStats({
                    enrolledCourses: myEnrollments.length,
                    completedMilestones: myEnrollments.filter(e => e.progress >= 50).length,
                    upcomingWebinars: upcoming.length,
                    activeHackathons: allHackathons.length
                });

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [student.id]);

    const handleDownloadCertificate = async (enrollment) => {
        if (!certificateRef.current) return;
        setDownloading(true);

        const certId = enrollment.certificateId || `CERT-${enrollment.id}-${Math.floor(1000 + Math.random() * 9000)}`;
        setCertificateData({
            studentName: student.name || student.username || 'Student',
            courseName: enrollment.courseName,
            date: enrollment.certificateDate || new Date().toISOString().split('T')[0],
            certificateId: certId
        });

        await new Promise(resolve => setTimeout(resolve, 500));

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
            const sName = (student?.name || "Student").replace(/\s+/g, '_');
            const cName = (enrollment?.courseName || "Course").replace(/\s+/g, '_');
            pdf.save(`${sName}_${cName}_Certificate.pdf`);
        } catch (error) {
            console.error("Certificate download failed", error);
        } finally {
            setDownloading(false);
        }
    };

    const isProfileComplete = Boolean(student.name && student.phone && /^\d{10}$/.test(student.phone));

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
            {/* Clean Light Hero Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-black uppercase tracking-wider border border-blue-100">
                                <Sparkles size={13} className="text-blue-600" /> Scholar Dashboard
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-mono font-bold border border-slate-200">
                                <IdCard size={13} className="text-slate-600" /> Student ID: {studentIdFormatted}
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            {greeting}, <span className="text-blue-600">{student.name || student.username || 'Scholar'}</span>!
                        </h1>
                        <p className="text-slate-500 text-sm mt-1 max-w-xl">
                            Track your active internship curriculum, download verified certificates, review tuition fee invoices, and build industry-ready projects.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => navigate('/studentdashboard/courses')}
                            className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 font-extrabold text-xs tracking-wider uppercase text-white shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                        >
                            Browse Courses
                        </button>
                        <button
                            onClick={() => navigate('/studentdashboard/fees')}
                            className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 font-bold text-xs tracking-wider uppercase text-slate-700 border border-slate-200 transition-all cursor-pointer"
                        >
                            Fee Invoices
                        </button>
                    </div>
                </div>
            </div>

            {/* Dynamic Banner: Profile Completion OR Announcements & Special Offers */}
            {!isProfileComplete ? (
                /* Profile Incomplete Banner */
                <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start justify-between gap-4 shadow-xs animate-fadeIn">
                    <div className="flex items-start gap-3.5">
                        <div className="p-2.5 bg-amber-100 rounded-xl text-amber-700 shrink-0 mt-0.5">
                            <User size={19} />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-sm text-amber-900">Complete Your Scholar Profile</h3>
                            <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                                Please update your full name and 10-digit mobile number so your official certificates and invoices are generated accurately.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/studentdashboard/profile')}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0 cursor-pointer shadow-sm"
                    >
                        Update Profile
                    </button>
                </div>
            ) : (
                /* Profile Complete -> Announcements, Offers & Live Opportunities */
                <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs animate-fadeIn">
                    <div className="flex items-center gap-3.5">
                        <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs shrink-0">
                            <Gift size={18} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-black uppercase rounded-md">
                                    Special Offer
                                </span>
                                <h3 className="font-extrabold text-sm text-slate-900">
                                    Get 20% Instant Scholarship on Advanced AI & Full Stack Tracks!
                                </h3>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5">
                                Limited seats available for the upcoming 2026 Batch. Use code <strong className="text-blue-700">TSAR20</strong> during enrollment.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/studentdashboard/courses')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl transition-colors shrink-0 cursor-pointer shadow-sm flex items-center gap-1.5"
                    >
                        Claim Offer <ArrowRight size={13} />
                    </button>
                </div>
            )}

            {/* Metrics Overview Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Enrolled Courses</span>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.enrolledCourses}</h3>
                        <span className="text-[11px] text-blue-600 font-bold mt-0.5 block">Active Batches</span>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <BookOpen size={20} />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Milestones</span>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.completedMilestones}</h3>
                        <span className="text-[11px] text-emerald-600 font-bold mt-0.5 block">Modules Completed</span>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <TrendingUp size={20} />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Certificates</span>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">{enrollments.length}</h3>
                        <span className="text-[11px] text-amber-600 font-bold mt-0.5 block">Ready to Download</span>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Award size={20} />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Hackathons</span>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.activeHackathons}</h3>
                        <span className="text-[11px] text-purple-600 font-bold mt-0.5 block">Live Challenges</span>
                    </div>
                    <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Trophy size={20} />
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2 Columns: Active Learning & Enrollments */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Active Course Classroom Card */}
                    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                                    <BookOpen size={20} className="text-blue-600" />
                                    My Enrolled Courses & Classroom
                                </h2>
                                <p className="text-xs text-slate-500">Pick up where you left off in your curriculum</p>
                            </div>
                            <button
                                onClick={() => navigate('/studentdashboard/courses')}
                                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                            >
                                View Catalog <ArrowRight size={13} />
                            </button>
                        </div>

                        {enrollments.length > 0 ? (
                            <div className="space-y-4">
                                {enrollments.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-5 rounded-2xl border border-slate-200 hover:border-blue-400 bg-slate-50/60 hover:bg-white transition-all shadow-xs group"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800">
                                                        {item.status || 'ACTIVE BATCH'}
                                                    </span>
                                                    <span className="text-xs text-slate-400 font-medium">
                                                        Txn: {item.transactionId || 'VERIFIED'}
                                                    </span>
                                                </div>
                                                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                    {item.courseName}
                                                </h3>
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    Fee Paid: ₹{(item.amountPaid || item.fee || 5000).toLocaleString()} INR
                                                </p>

                                                {/* Progress Bar */}
                                                <div className="mt-3 max-w-md">
                                                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                                                        <span>Progress</span>
                                                        <span>{item.progress || 25}%</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-600 rounded-full transition-all duration-700"
                                                            style={{ width: `${item.progress || 25}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex sm:flex-col gap-2 shrink-0">
                                                <button
                                                    onClick={() => navigate(`/student/course/${encodeURIComponent(item.courseName)}`)}
                                                    className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                                >
                                                    <PlayCircle size={15} /> Go to Classroom
                                                </button>
                                                <button
                                                    onClick={() => handleDownloadCertificate(item)}
                                                    className="flex-1 py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                                                >
                                                    <Award size={14} className="text-amber-500" /> Certificate
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <h4 className="font-bold text-slate-800 text-sm">No Enrolled Courses Found</h4>
                                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
                                    Explore our premium internship programs and enroll with Razorpay or PayPal to start learning immediately.
                                </p>
                                <button
                                    onClick={() => navigate('/studentdashboard/courses')}
                                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                                >
                                    Browse Internship Catalog
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Upcoming Hackathons Highlights */}
                    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                                    <Trophy size={20} className="text-purple-600" />
                                    Upcoming Hackathons & Challenges
                                </h2>
                                <p className="text-xs text-slate-500">Participate, build projects, and win cash prizes</p>
                            </div>
                            <button
                                onClick={() => navigate('/studentdashboard/hackathons')}
                                className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
                            >
                                View All <ArrowRight size={13} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {hackathons.slice(0, 2).map((item) => (
                                <div key={item.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200">
                                                {item.status || 'Open'}
                                            </span>
                                            <span className="text-xs font-black text-amber-600">
                                                {item.prizePool || '₹25,000'}
                                            </span>
                                        </div>
                                        <h3 className="font-extrabold text-base text-slate-900 line-clamp-1">{item.title}</h3>
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                                    </div>
                                    <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between">
                                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                            <Calendar size={12} className="text-slate-400" /> {item.date}
                                        </span>
                                        <button
                                            onClick={() => navigate('/studentdashboard/hackathons')}
                                            className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-extrabold text-xs hover:bg-blue-700 transition-colors cursor-pointer"
                                        >
                                            Participate
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Invoices, Certificates & Support */}
                <div className="space-y-6">
                    {/* Fee Summary Widget */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                                <Receipt size={17} className="text-blue-600" />
                                Fee & Invoices
                            </h3>
                            <button
                                onClick={() => navigate('/studentdashboard/fees')}
                                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                            >
                                All Invoices
                            </button>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Payment Status:</span>
                                <span className="font-bold text-emerald-700 flex items-center gap-1">
                                    <CheckCircle size={12} /> 100% Cleared
                                </span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Active Receipts:</span>
                                <strong className="text-slate-900">{enrollments.length} Available</strong>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/studentdashboard/fees')}
                            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Download size={14} /> Download Tax Receipts
                        </button>
                    </div>

                    {/* Quick Certificate Widget */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-6 shadow-xs space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase tracking-wider">
                                Official Credential
                            </span>
                            <Award size={20} className="text-amber-500" />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-slate-900 leading-tight">Internship Certificates</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Industry-recognized certificate with unique verification ID.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/studentdashboard/certificates')}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Award size={14} /> View & Download Credentials
                        </button>
                    </div>

                    {/* Academic Support Card */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
                        <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">Academic Support</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Have questions regarding your batch, projects, or fees? Contact official support at <strong className="text-slate-800">tsarit@tsaritservices.com</strong>.
                        </p>
                    </div>
                </div>
            </div>

            {/* Hidden Certificate Template for PDF Rendering */}
            <div className="absolute top-0 left-0 -z-50 opacity-0 pointer-events-none" style={{ position: 'fixed', left: '-9999px' }}>
                <CertificateTemplate
                    ref={certificateRef}
                    studentName={certificateData.studentName}
                    courseName={certificateData.courseName}
                    date={certificateData.date}
                    certificateId={certificateData.certificateId}
                    duration="8 Weeks"
                />
            </div>
        </div>
    );
};

export default StudentDashboardHome;
