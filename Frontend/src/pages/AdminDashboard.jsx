import React, { useState, useEffect } from 'react';
import { 
    Users, 
    Video, 
    MessageSquareQuote, 
    TrendingUp, 
    Award, 
    HelpCircle, 
    UserCheck, 
    BookOpen, 
    ShieldCheck, 
    CircleDollarSign, 
    ArrowUpRight, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    RefreshCw, 
    Sparkles, 
    ChevronRight,
    Search,
    ExternalLink,
    Building2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAdminStats, getContactQueries } from '../services/studentApi';
import { formatStudentId } from '../utils/studentUtils';

const API_BASE = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:8080/api' : '/api');

const StatCard = ({ title, value, subtitle, icon: Icon, gradient, badge, onClick }) => (
    <div 
        onClick={onClick}
        className={`bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 relative overflow-hidden group ${onClick ? 'cursor-pointer' : ''}`}
    >
        <div className={`absolute top-0 right-0 w-32 h-32 ${gradient} opacity-10 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform`}></div>
        
        <div className="flex items-start justify-between relative z-10 mb-4">
            <div className={`w-12 h-12 rounded-2xl ${gradient} flex items-center justify-center text-white shadow-md`}>
                <Icon size={24} />
            </div>
            {badge && (
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {badge}
                </span>
            )}
        </div>

        <div className="relative z-10">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-3xl font-black text-slate-900 font-display tracking-tight">{value}</h3>
            {subtitle && <p className="text-slate-500 text-xs mt-1 font-medium">{subtitle}</p>}
        </div>
    </div>
);

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [statsData, setStatsData] = useState({
        totalStudents: 0,
        totalEnrollments: 0,
        totalWebinars: 0,
        totalTestimonials: 0,
        totalRevenue: 0,
        totalCourses: 0,
        certificatesIssued: 0,
        pendingCertificates: 0,
        openTickets: 0,
        totalLeads: 0
    });

    const [recentEnrollments, setRecentEnrollments] = useState([]);
    const [recentLeads, setRecentLeads] = useState([]);
    const [recentTickets, setRecentTickets] = useState([]);
    const [liveTime, setLiveTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const timer = setInterval(() => {
            setLiveTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchAllDashboardData = async () => {
        setLoading(true);
        try {
            const [statsRes, enrollRes, leadsRes, ticketsRes, usersRes] = await Promise.all([
                getAdminStats().catch(() => ({ success: false })),
                axios.get(`${API_BASE}/enrollments/all`).catch(() => ({ data: [] })),
                getContactQueries().catch(() => ({ success: false })),
                axios.get(`${API_BASE}/tickets/all`).catch(() => ({ data: [] })),
                axios.get(`${API_BASE}/users`).catch(() => ({ data: [] }))
            ]);

            const allEnrollments = enrollRes.data || [];
            const allUsers = usersRes.data || [];
            const allTickets = ticketsRes.data || [];
            const allLeads = (leadsRes.success && leadsRes.data) ? leadsRes.data : [];

            // Compute live revenue and student metrics
            const totalRevenue = allEnrollments.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);
            const certificatesIssued = allEnrollments.filter(e => e.certificateIssued).length;
            const openTickets = allTickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;

            if (statsRes.success && statsRes.data) {
                setStatsData({
                    ...statsRes.data,
                    totalRevenue: statsRes.data.totalRevenue || totalRevenue,
                    totalEnrollments: allEnrollments.length,
                    certificatesIssued,
                    pendingCertificates: Math.max(0, allEnrollments.length - certificatesIssued),
                    openTickets: openTickets || statsRes.data.openTickets || 0,
                    totalLeads: allLeads.length
                });
            } else {
                setStatsData({
                    totalStudents: allUsers.length,
                    totalEnrollments: allEnrollments.length,
                    totalWebinars: 0,
                    totalTestimonials: 0,
                    totalRevenue,
                    totalCourses: 9,
                    certificatesIssued,
                    pendingCertificates: Math.max(0, allEnrollments.length - certificatesIssued),
                    openTickets,
                    totalLeads: allLeads.length
                });
            }

            // Map and sort recent enrollments
            const mappedEnrollments = allEnrollments.map(enr => {
                const user = enr.user || allUsers.find(u => u.id === enr.userId) || {};
                return {
                    ...enr,
                    studentName: enr.studentName || user.name || user.username || 'Student',
                    email: user.email || 'N/A',
                    userId: user.id || enr.userId
                };
            }).reverse().slice(0, 6);
            setRecentEnrollments(mappedEnrollments);

            // Recent leads
            setRecentLeads(allLeads.slice().reverse().slice(0, 5));

            // Recent tickets
            setRecentTickets(allTickets.slice().reverse().slice(0, 5));

        } catch (error) {
            console.error("Dashboard fetch failed", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllDashboardData();
    }, []);

    return (
        <div className="p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8 font-sans pb-16">
            
            {/* Top Welcome & System Status Command Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-black uppercase tracking-wider">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                Live Production Engine
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-black uppercase tracking-wider">
                                <ShieldCheck size={13} />
                                ISO 9001:2015 Verified
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-white mb-2">
                            Super Admin Control Center
                        </h1>
                        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
                            Real-time platform metrics, student admissions, automated certificate issuance, and payment verification.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="px-4 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-center sm:text-right">
                            <span className="text-[10px] uppercase font-extrabold text-slate-400 block tracking-widest">System Clock</span>
                            <span className="text-lg font-mono font-bold text-amber-300">{liveTime}</span>
                        </div>
                        <button
                            onClick={fetchAllDashboardData}
                            className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer"
                        >
                            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                            <span>Sync Live Data</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 6 Real-Time KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <StatCard
                    title="Total Revenue"
                    value={`₹${(statsData.totalRevenue || 0).toLocaleString()}`}
                    subtitle="Live Verified Payments"
                    icon={TrendingUp}
                    gradient="bg-emerald-600"
                    badge="Verified"
                    onClick={() => navigate('/admin/payments')}
                />
                <StatCard
                    title="Total Students"
                    value={statsData.totalStudents}
                    subtitle="Registered Accounts"
                    icon={Users}
                    gradient="bg-blue-600"
                    badge="Active"
                    onClick={() => navigate('/admin/students')}
                />
                <StatCard
                    title="Enrollments"
                    value={statsData.totalEnrollments}
                    subtitle="Course Registrations"
                    icon={BookOpen}
                    gradient="bg-indigo-600"
                    badge="Live"
                    onClick={() => navigate('/admin/students')}
                />
                <StatCard
                    title="Certificates"
                    value={statsData.certificatesIssued}
                    subtitle={`${statsData.pendingCertificates} Pending Issuance`}
                    icon={Award}
                    gradient="bg-amber-600"
                    badge="Verified"
                    onClick={() => navigate('/admin/certificates')}
                />
                <StatCard
                    title="Support Tickets"
                    value={statsData.openTickets}
                    subtitle="Open Student Queries"
                    icon={HelpCircle}
                    gradient="bg-rose-600"
                    badge="Helpdesk"
                    onClick={() => navigate('/admin/tickets')}
                />
                <StatCard
                    title="Counseling Leads"
                    value={statsData.totalLeads}
                    subtitle="Admission Inquiries"
                    icon={UserCheck}
                    gradient="bg-purple-600"
                    badge="New Leads"
                    onClick={() => navigate('/admin/leads')}
                />
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-black text-slate-900 font-display flex items-center gap-2">
                        <Sparkles size={18} className="text-amber-500" />
                        Quick Command Actions
                    </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <button
                        onClick={() => navigate('/admin/certificates')}
                        className="p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-extrabold text-xs transition-all border border-amber-200/80 text-center flex flex-col items-center gap-1.5 cursor-pointer"
                    >
                        <Award size={20} className="text-amber-600" />
                        <span>Issue Certificates</span>
                    </button>
                    <button
                        onClick={() => navigate('/admin/courses')}
                        className="p-3.5 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-extrabold text-xs transition-all border border-blue-200/80 text-center flex flex-col items-center gap-1.5 cursor-pointer"
                    >
                        <BookOpen size={20} className="text-blue-600" />
                        <span>Manage Courses</span>
                    </button>
                    <button
                        onClick={() => navigate('/admin/students')}
                        className="p-3.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-extrabold text-xs transition-all border border-purple-200/80 text-center flex flex-col items-center gap-1.5 cursor-pointer"
                    >
                        <Users size={20} className="text-purple-600" />
                        <span>Registered Students</span>
                    </button>
                    <button
                        onClick={() => navigate('/admin/payments')}
                        className="p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-extrabold text-xs transition-all border border-emerald-200/80 text-center flex flex-col items-center gap-1.5 cursor-pointer"
                    >
                        <CircleDollarSign size={20} className="text-emerald-600" />
                        <span>Payment History</span>
                    </button>
                    <button
                        onClick={() => navigate('/admin/tickets')}
                        className="p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-900 font-extrabold text-xs transition-all border border-rose-200/80 text-center flex flex-col items-center gap-1.5 cursor-pointer"
                    >
                        <HelpCircle size={20} className="text-rose-600" />
                        <span>Support Helpdesk</span>
                    </button>
                    <button
                        onClick={() => navigate('/verify-certificate')}
                        className="p-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition-all border border-slate-300 text-center flex flex-col items-center gap-1.5 cursor-pointer"
                    >
                        <ShieldCheck size={20} className="text-slate-700" />
                        <span>Public Certificate Check</span>
                    </button>
                </div>
            </div>

            {/* Main Content Grid: Recent Enrollments & Side Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Recent Real-Time Enrollments (2 Columns) */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                            <div>
                                <h2 className="text-lg font-black text-slate-900 font-display">Recent Student Enrollments</h2>
                                <p className="text-xs text-slate-500">Live incoming course registrations & payments</p>
                            </div>
                            <button
                                onClick={() => navigate('/admin/students')}
                                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline cursor-pointer"
                            >
                                View All ({statsData.totalEnrollments}) <ChevronRight size={14} />
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100">
                                        <th className="py-3 px-4">Student</th>
                                        <th className="py-3 px-4">Course Track</th>
                                        <th className="py-3 px-4">Amount</th>
                                        <th className="py-3 px-4">Certificate</th>
                                        <th className="py-3 px-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentEnrollments.length > 0 ? (
                                        recentEnrollments.map((enr) => (
                                            <tr key={enr.id} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="py-3 px-4">
                                                    <div className="font-bold text-slate-900">{enr.studentName}</div>
                                                    <div className="text-[11px] text-slate-400">{enr.email}</div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className="font-semibold text-slate-800">{enr.courseName}</span>
                                                </td>
                                                <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                                                    ₹{enr.amountPaid != null ? enr.amountPaid.toLocaleString() : (enr.fee || 0).toLocaleString()}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {enr.certificateIssued ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                                                            <CheckCircle2 size={11} /> Issued
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-full text-[10px]">
                                                            Pending
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <button
                                                        onClick={() => navigate('/admin/certificates')}
                                                        className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold rounded-lg transition-colors cursor-pointer text-[11px]"
                                                    >
                                                        Manage
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="py-8 text-center text-slate-400">
                                                No enrollments recorded yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                        <span>Database: MySQL (Localhost / VPS Active)</span>
                        <span className="text-blue-600 font-bold">TSAR IT Central Service</span>
                    </div>
                </div>

                {/* Right Column: Recent Admissions Leads & Helpdesk Tickets */}
                <div className="space-y-6">
                    
                    {/* Admissions Counseling Leads */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                            <div>
                                <h3 className="text-base font-black text-slate-900 font-display">Admissions Counseling Leads</h3>
                                <p className="text-xs text-slate-500">Prospective student inquiries</p>
                            </div>
                            <button
                                onClick={() => navigate('/admin/leads')}
                                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                            >
                                View All
                            </button>
                        </div>

                        <div className="space-y-2.5">
                            {recentLeads.length > 0 ? (
                                recentLeads.map((lead, i) => (
                                    <div key={i} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs hover:bg-slate-100/80 transition-colors">
                                        <div>
                                            <div className="font-bold text-slate-900">{lead.name || 'Anonymous Lead'}</div>
                                            <div className="text-slate-500 text-[11px]">{lead.phone || lead.email}</div>
                                        </div>
                                        <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md">
                                            {lead.course || lead.subject || 'Internship'}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-400 text-xs py-4 text-center">No new inquiries at this moment.</p>
                            )}
                        </div>
                    </div>

                    {/* Urgent Support Tickets */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                            <div>
                                <h3 className="text-base font-black text-slate-900 font-display">Helpdesk Support</h3>
                                <p className="text-xs text-slate-500">Active student tickets</p>
                            </div>
                            <button
                                onClick={() => navigate('/admin/tickets')}
                                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                            >
                                View All
                            </button>
                        </div>

                        <div className="space-y-2.5">
                            {recentTickets.length > 0 ? (
                                recentTickets.map((t, i) => (
                                    <div key={i} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs hover:bg-slate-100/80 transition-colors">
                                        <div>
                                            <div className="font-bold text-slate-900">#{t.ticketNumber || t.id} — {t.subject || 'Student Ticket'}</div>
                                            <div className="text-slate-500 text-[11px]">{t.user?.username || 'Student'}</div>
                                        </div>
                                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                                            t.status === 'OPEN' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                                        }`}>
                                            {t.status || 'OPEN'}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-400 text-xs py-4 text-center">All support tickets resolved.</p>
                            )}
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default AdminDashboard;
