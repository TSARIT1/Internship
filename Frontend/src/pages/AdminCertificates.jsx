import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
    Award, 
    Search, 
    Filter, 
    CheckCircle2, 
    XCircle, 
    Download, 
    Eye, 
    Sparkles, 
    RefreshCw, 
    Edit3, 
    X, 
    ShieldCheck, 
    Check, 
    ExternalLink, 
    Copy,
    PlusCircle,
    Printer,
    FileText
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import CertificateTemplate from '../components/CertificateTemplate';
import { 
    updateStudentCertificate, 
    generateCertificateForEnrollment, 
    generateAllCertificates 
} from '../services/studentApi';
import { formatStudentId } from '../utils/studentUtils';

const API_BASE = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:8080/api' : '/api');

const AdminCertificates = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [courseFilter, setCourseFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [batchLoading, setBatchLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [copiedId, setCopiedId] = useState(null);

    // Edit Modal State
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [editForm, setEditForm] = useState({
        studentName: '',
        certificateId: '',
        certificateDate: '',
        status: true
    });

    // Preview & PDF State
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [downloadingId, setDownloadingId] = useState(null);
    const certificateRef = useRef(null);
    const [renderCertData, setRenderCertData] = useState({
        studentName: '',
        courseName: '',
        date: '',
        certificateId: '',
        duration: '6 Months'
    });

    const fetchEnrollments = async () => {
        setLoading(true);
        try {
            const [enrollRes, usersRes] = await Promise.all([
                axios.get(`${API_BASE}/enrollments/all`).catch(() => ({ data: [] })),
                axios.get(`${API_BASE}/users`).catch(() => ({ data: [] }))
            ]);

            const allEnrollments = enrollRes.data || [];
            const allUsers = usersRes.data || [];

            // Map enrollments with user info
            const mapped = allEnrollments.map(enr => {
                const user = enr.user || allUsers.find(u => u.id === enr.userId) || {};
                const studentName = enr.studentName || user.name || user.username || 'Student';
                const certId = enr.certificateId || (enr.certificateIssued ? `TSAR-2026-${enr.courseName?.substring(0, 2).toUpperCase() || 'IT'}-${enr.id}` : '');
                
                return {
                    ...enr,
                    studentName,
                    email: user.email || 'N/A',
                    phone: user.phone || 'N/A',
                    userId: user.id || enr.userId,
                    certificateId: certId
                };
            });

            setEnrollments(mapped);
        } catch (error) {
            console.error("Failed to fetch certificate enrollments", error);
            setMessage("Failed to load certificate data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnrollments();
    }, []);

    // Toggle Certificate Status (Issue / Revoke)
    const handleToggleCertificate = async (item) => {
        const nextStatus = !item.certificateIssued;
        const autoCertId = item.certificateId || `TSAR-2026-${item.courseName?.substring(0, 2).toUpperCase() || 'IT'}-${item.id}${Math.floor(1000 + Math.random() * 9000)}`;

        try {
            const res = await updateStudentCertificate(item.id, nextStatus, {
                certificateId: nextStatus ? autoCertId : null,
                certificateDate: nextStatus ? new Date().toISOString().split('T')[0] : null
            });

            if (res.success) {
                setEnrollments(prev => prev.map(e => e.id === item.id ? {
                    ...e,
                    certificateIssued: nextStatus,
                    certificateId: nextStatus ? autoCertId : '',
                    certificateDate: nextStatus ? new Date().toISOString().split('T')[0] : null
                } : e));
                setMessage(`Certificate ${nextStatus ? 'issued' : 'revoked'} for ${item.studentName}`);
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (err) {
            console.error("Failed to toggle certificate", err);
        }
    };

    // Auto-Generate All Certificates with 1 Click
    const handleAutoGenerateAll = async () => {
        if (!window.confirm("Auto-generate and issue verified certificates for all pending students?")) return;
        setBatchLoading(true);
        try {
            const res = await generateAllCertificates();
            if (res.success) {
                setMessage(`🎉 Successfully auto-generated and issued certificates!`);
                await fetchEnrollments();
            } else {
                setMessage(res.message || "Failed to auto-generate certificates.");
            }
        } catch (err) {
            console.error("Batch certificate error", err);
            setMessage("Encountered error during batch generation.");
        } finally {
            setBatchLoading(false);
            setTimeout(() => setMessage(''), 4000);
        }
    };

    // Single Student Auto-Generate
    const handleGenerateSingle = async (item) => {
        try {
            const res = await generateCertificateForEnrollment(item.id);
            if (res.success) {
                await fetchEnrollments();
                setMessage(`Certificate auto-generated for ${item.studentName}!`);
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Edit Certificate
    const openEditModal = (item) => {
        setEditingItem(item);
        setEditForm({
            studentName: item.studentName || '',
            certificateId: item.certificateId || `TSAR-2026-${item.courseName?.substring(0, 2).toUpperCase() || 'IT'}-${item.id}`,
            certificateDate: item.certificateDate || new Date().toISOString().split('T')[0],
            status: item.certificateIssued !== false
        });
        setEditModalOpen(true);
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!editingItem) return;

        try {
            const res = await updateStudentCertificate(editingItem.id, editForm.status, {
                certificateId: editForm.certificateId.trim().toUpperCase(),
                certificateDate: editForm.certificateDate,
                studentName: editForm.studentName.trim()
            });

            if (res.success) {
                setEnrollments(prev => prev.map(e => e.id === editingItem.id ? {
                    ...e,
                    studentName: editForm.studentName.trim(),
                    certificateId: editForm.certificateId.trim().toUpperCase(),
                    certificateDate: editForm.certificateDate,
                    certificateIssued: editForm.status
                } : e));
                setEditModalOpen(false);
                setMessage("Certificate details updated successfully!");
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Open Live Preview
    const openPreview = (item) => {
        const certId = item.certificateId || `TSAR-2026-${item.courseName?.substring(0, 2).toUpperCase() || 'IT'}-${item.id}`;
        setPreviewData({
            ...item,
            certificateId: certId,
            date: item.certificateDate || new Date().toISOString().split('T')[0]
        });
        setRenderCertData({
            studentName: item.studentName,
            courseName: item.courseName,
            date: item.certificateDate || new Date().toISOString().split('T')[0],
            certificateId: certId,
            duration: item.duration || '6 Months'
        });
        setPreviewModalOpen(true);
    };

    // Download PDF directly from Admin
    const handleDownloadPdf = async (item) => {
        setDownloadingId(item.id);
        const certId = item.certificateId || `TSAR-2026-${item.courseName?.substring(0, 2).toUpperCase() || 'IT'}-${item.id}`;
        
        setRenderCertData({
            studentName: item.studentName,
            courseName: item.courseName,
            date: item.certificateDate || new Date().toISOString().split('T')[0],
            certificateId: certId,
            duration: item.duration || '6 Months'
        });

        await new Promise(resolve => setTimeout(resolve, 600));

        try {
            if (!certificateRef.current) return;
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
            const sName = (item.studentName || "Student").replace(/\s+/g, '_');
            const cName = (item.courseName || "Course").replace(/\s+/g, '_');
            pdf.save(`${sName}_${cName}_Official_Certificate.pdf`);
        } catch (error) {
            console.error("Download PDF error", error);
            alert("Could not generate PDF");
        } finally {
            setDownloadingId(null);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedId(text);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Filters
    const coursesList = Array.from(new Set(enrollments.map(e => e.courseName).filter(Boolean)));
    
    const filteredEnrollments = enrollments.filter(e => {
        const matchesSearch = (e.studentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (e.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (e.certificateId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            formatStudentId(e.userId).toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCourse = courseFilter === 'All' || e.courseName === courseFilter;
        const matchesStatus = statusFilter === 'All' 
            ? true 
            : statusFilter === 'Issued' 
                ? e.certificateIssued 
                : !e.certificateIssued;

        return matchesSearch && matchesCourse && matchesStatus;
    });

    const totalIssued = enrollments.filter(e => e.certificateIssued).length;
    const totalPending = enrollments.filter(e => !e.certificateIssued).length;

    return (
        <div className="space-y-6 font-sans pb-16">
            {/* Top Title & Quick Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 font-display">
                        <Award className="text-amber-500 w-8 h-8" />
                        Certificate Management & Generation
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Control, issue, revoke, and auto-generate verifiable MSME-registered internship certificates.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleAutoGenerateAll}
                        disabled={batchLoading || totalPending === 0}
                        className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        <Sparkles size={16} className={batchLoading ? "animate-spin" : ""} />
                        <span>{batchLoading ? "Generating All..." : "Auto-Generate All Pending"}</span>
                    </button>

                    <button
                        onClick={fetchEnrollments}
                        className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-colors cursor-pointer"
                        title="Refresh List"
                    >
                        <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* Notification Banner */}
            {message && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-2xl font-bold flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 size={18} />
                    <span>{message}</span>
                </div>
            )}

            {/* Stat Counters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Total Students</span>
                        <span className="text-2xl font-black text-slate-900 mt-1">{enrollments.length}</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-lg">
                        <FileText size={22} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                        <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider block">Certificates Issued</span>
                        <span className="text-2xl font-black text-emerald-700 mt-1">{totalIssued}</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-lg">
                        <CheckCircle2 size={22} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                        <span className="text-xs font-extrabold text-amber-600 uppercase tracking-wider block">Pending Approval</span>
                        <span className="text-2xl font-black text-amber-700 mt-1">{totalPending}</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-lg">
                        <Award size={22} />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                        <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-wider block">Accreditation</span>
                        <span className="text-sm font-black text-slate-900 mt-1 block">Govt. MSME ISO 9001</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg">
                        <ShieldCheck size={22} />
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by student name, email, student ID, or Certificate ID..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:bg-white text-slate-900 transition-colors"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <select
                        value={courseFilter}
                        onChange={e => setCourseFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm py-3 px-4 rounded-2xl focus:outline-none focus:border-blue-600 cursor-pointer w-full md:w-auto"
                    >
                        <option value="All">All Courses</option>
                        {coursesList.map((c, i) => (
                            <option key={i} value={c}>{c}</option>
                        ))}
                    </select>

                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm py-3 px-4 rounded-2xl focus:outline-none focus:border-blue-600 cursor-pointer w-full md:w-auto"
                    >
                        <option value="All">All Status</option>
                        <option value="Issued">Issued Only</option>
                        <option value="Pending">Pending Only</option>
                    </select>
                </div>
            </div>

            {/* Certificates Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                                <th className="py-4 px-6">Student & Recipient</th>
                                <th className="py-4 px-6">Course Track</th>
                                <th className="py-4 px-6">Certificate ID</th>
                                <th className="py-4 px-6">Issue Date</th>
                                <th className="py-4 px-6">Status</th>
                                <th className="py-4 px-6 text-right">Super Admin Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
                                        Loading certificate records...
                                    </td>
                                </tr>
                            ) : filteredEnrollments.length > 0 ? (
                                filteredEnrollments.map((item) => {
                                    const certId = item.certificateId || (item.certificateIssued ? `TSAR-2026-${item.courseName?.substring(0, 2).toUpperCase() || 'IT'}-${item.id}` : 'Not Generated');

                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                                            {/* Student Details */}
                                            <td className="py-4 px-6">
                                                <div className="font-extrabold text-slate-900">{item.studentName}</div>
                                                <div className="text-[11px] text-slate-500">{item.email}</div>
                                                <div className="text-[10px] font-mono text-slate-400">ID: {formatStudentId(item.userId)}</div>
                                            </td>

                                            {/* Course */}
                                            <td className="py-4 px-6">
                                                <span className="font-bold text-slate-800">{item.courseName}</span>
                                                <div className="text-[11px] text-slate-500">Batch 2026 • 6 Months</div>
                                            </td>

                                            {/* Certificate ID */}
                                            <td className="py-4 px-6">
                                                {item.certificateIssued ? (
                                                    <div className="flex items-center gap-1.5 font-mono font-bold text-blue-700 bg-blue-50/80 px-2.5 py-1 rounded-lg border border-blue-200 w-fit">
                                                        <span>{certId}</span>
                                                        <button
                                                            onClick={() => copyToClipboard(certId)}
                                                            className="text-slate-400 hover:text-blue-700 cursor-pointer"
                                                            title="Copy Certificate ID"
                                                        >
                                                            {copiedId === certId ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 italic text-xs">Pending Generation</span>
                                                )}
                                            </td>

                                            {/* Issue Date */}
                                            <td className="py-4 px-6 text-slate-600">
                                                {item.certificateIssued && item.certificateDate
                                                    ? item.certificateDate
                                                    : item.certificateIssued
                                                        ? new Date().toISOString().split('T')[0]
                                                        : '—'}
                                            </td>

                                            {/* Status Badge */}
                                            <td className="py-4 px-6">
                                                {item.certificateIssued ? (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full uppercase tracking-wider">
                                                        <CheckCircle2 size={12} /> Issued
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider">
                                                        <XCircle size={12} /> Pending
                                                    </span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* Toggle Issued Button */}
                                                    <button
                                                        onClick={() => handleToggleCertificate(item)}
                                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                                            item.certificateIssued
                                                                ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                                                                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/20'
                                                        }`}
                                                    >
                                                        {item.certificateIssued ? "Revoke" : "Issue Certificate"}
                                                    </button>

                                                    {/* Auto-Gen ID if not issued */}
                                                    {!item.certificateIssued && (
                                                        <button
                                                            onClick={() => handleGenerateSingle(item)}
                                                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg border border-amber-200 transition-colors cursor-pointer"
                                                            title="Auto-Generate & Issue"
                                                        >
                                                            <Sparkles size={16} />
                                                        </button>
                                                    )}

                                                    {/* Edit */}
                                                    <button
                                                        onClick={() => openEditModal(item)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors cursor-pointer"
                                                        title="Edit Certificate Details"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>

                                                    {/* Preview */}
                                                    <button
                                                        onClick={() => openPreview(item)}
                                                        className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                                                        title="Preview Certificate"
                                                    >
                                                        <Eye size={16} />
                                                    </button>

                                                    {/* Download PDF */}
                                                    <button
                                                        onClick={() => handleDownloadPdf(item)}
                                                        disabled={downloadingId === item.id}
                                                        className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg border border-emerald-200 transition-colors cursor-pointer disabled:opacity-50"
                                                        title="Download Official PDF"
                                                    >
                                                        <Download size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
                                        No student certificates found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Certificate Modal */}
            {editModalOpen && editingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                <Award className="text-amber-500" size={20} />
                                Edit Certificate Details
                            </h3>
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEdit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                                    Recipient Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.studentName}
                                    onChange={e => setEditForm({ ...editForm, studentName: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-blue-600 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                                    Certificate Credential ID
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        required
                                        value={editForm.certificateId}
                                        onChange={e => setEditForm({ ...editForm, certificateId: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-mono focus:border-blue-600 focus:outline-none uppercase"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setEditForm({ ...editForm, certificateId: `TSAR-2026-${editingItem.courseName?.substring(0, 2).toUpperCase() || 'IT'}-${Math.floor(10000 + Math.random() * 90000)}` })}
                                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl shrink-0"
                                        title="Regenerate ID"
                                    >
                                        Auto-ID
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                                    Official Issue Date
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={editForm.certificateDate}
                                    onChange={e => setEditForm({ ...editForm, certificateDate: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-blue-600 focus:outline-none"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="statusCheckbox"
                                    checked={editForm.status}
                                    onChange={e => setEditForm({ ...editForm, status: e.target.checked })}
                                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                                />
                                <label htmlFor="statusCheckbox" className="text-xs font-bold text-slate-700 cursor-pointer">
                                    Issue and activate this certificate for student download
                                </label>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setEditModalOpen(false)}
                                    className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20"
                                >
                                    Save Certificate
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Live Certificate Preview Modal */}
            {previewModalOpen && previewData && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full p-6 relative max-h-[95vh] overflow-y-auto flex flex-col items-center">
                        <div className="w-full flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                            <div>
                                <h3 className="text-lg font-black text-slate-900">Certificate Live Preview</h3>
                                <p className="text-xs text-slate-500">Credential ID: {previewData.certificateId}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleDownloadPdf(previewData)}
                                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                    <Download size={14} /> Download PDF
                                </button>
                                <button
                                    onClick={() => setPreviewModalOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Certificate Render container scaled for preview */}
                        <div className="w-full overflow-x-auto flex justify-center py-4 bg-slate-100 rounded-2xl p-4">
                            <div className="transform scale-[0.6] sm:scale-[0.75] md:scale-[0.9] origin-top my-[-60px] sm:my-[-40px]">
                                <CertificateTemplate
                                    studentName={previewData.studentName}
                                    courseName={previewData.courseName}
                                    date={previewData.date}
                                    certificateId={previewData.certificateId}
                                    duration={previewData.duration || '6 Months'}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Hidden Certificate Template for PDF Rendering */}
            <div className="absolute top-0 left-0 -z-50 opacity-0 pointer-events-none" style={{ position: 'fixed', left: '-9999px' }}>
                <CertificateTemplate
                    ref={certificateRef}
                    studentName={renderCertData.studentName}
                    courseName={renderCertData.courseName}
                    date={renderCertData.date}
                    certificateId={renderCertData.certificateId}
                    duration={renderCertData.duration}
                />
            </div>
        </div>
    );
};

export default AdminCertificates;
