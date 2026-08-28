import React, { useState, useEffect } from 'react';
import { Search, Filter, Mail, Edit2, Check, X, ShieldAlert, ShieldCheck, Trash2, Award, UserCheck, Phone } from 'lucide-react';
import {
    getAllEnrollments,
    getStudents,
    updateStudentFee,
    updateStudentCertificate,
    updateEnrollmentStatus,
    toggleFreezeStudent,
    deleteStudentAccount
} from '../services/studentApi';
import { formatStudentId } from '../utils/studentUtils';

const AdminStudents = () => {
    const [allStudents, setAllStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCourse, setFilterCourse] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');

    // Fee Editing State
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ totalFee: 0, discount: 0 });

    // Freeze Confirmation Modal
    const [freezeModalStudent, setFreezeModalStudent] = useState(null);
    const [freezeReason, setFreezeReason] = useState('');
    const [freezeActionLoading, setFreezeActionLoading] = useState(false);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        setLoading(true);
        try {
            const [enrollmentRes, usersRes] = await Promise.all([
                getAllEnrollments(),
                getStudents()
            ]);

            const enrollments = enrollmentRes.success ? enrollmentRes.data : [];
            const users = usersRes.data || [];

            // Create a lookup for users to get isFrozen & phone
            const userLookup = {};
            users.forEach(u => {
                userLookup[u.id] = u;
            });

            // Map Enrollments first
            const enrolledMap = enrollments.map(enr => {
                const u = userLookup[enr.user?.id] || enr.user || {};
                return {
                    id: enr.id,
                    studentId: u.id || enr.user?.id,
                    name: enr.studentName || u.name || u.username || 'Scholar',
                    email: u.email || enr.user?.email,
                    phone: u.phone || '-',
                    isFrozen: Boolean(u.isFrozen),
                    freezeReason: u.freezeReason || '',
                    course: enr.courseName,
                    totalFee: enr.fee || 5000,
                    discount: enr.discount || 0,
                    date: enr.enrollmentDate,
                    certificateIssued: enr.certificateIssued,
                    certificateDate: enr.certificateDate,
                    transactionId: enr.transactionId,
                    amountPaid: enr.amountPaid || enr.fee,
                    status: enr.status || 'ACTIVE'
                };
            });

            const enrolledUserIds = new Set(enrollments.map(e => e.user?.id).filter(Boolean));

            const nonEnrolledUsers = users
                .filter(u => !enrolledUserIds.has(u.id))
                .map(u => ({
                    id: `user-${u.id}`,
                    studentId: u.id,
                    name: u.name || u.username || 'Scholar',
                    email: u.email,
                    phone: u.phone || '-',
                    isFrozen: Boolean(u.isFrozen),
                    freezeReason: u.freezeReason || '',
                    course: "Not Enrolled",
                    totalFee: 0,
                    discount: 0,
                    date: "Registered",
                    certificateIssued: false,
                    certificateDate: null,
                    transactionId: "-",
                    amountPaid: 0,
                    status: 'REGISTERED'
                }));

            setAllStudents([...enrolledMap, ...nonEnrolledUsers]);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleFreeze = async (student, shouldFreeze) => {
        setFreezeActionLoading(true);
        try {
            const res = await toggleFreezeStudent(student.studentId, shouldFreeze, freezeReason);
            if (res.success) {
                setAllStudents(prev => prev.map(s =>
                    s.studentId === student.studentId
                        ? { ...s, isFrozen: shouldFreeze, freezeReason: shouldFreeze ? freezeReason : '' }
                        : s
                ));
                setFreezeModalStudent(null);
                setFreezeReason('');
            } else {
                alert(res.message || "Failed to update freeze status");
            }
        } catch (error) {
            console.error("Freeze error", error);
            alert("Error updating freeze state");
        } finally {
            setFreezeActionLoading(false);
        }
    };

    const handleEditClick = (student) => {
        setEditingId(student.id);
        setEditForm({ totalFee: student.totalFee, discount: student.discount });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({ totalFee: 0, discount: 0 });
    };

    const handleSaveEdit = async (enrollmentId) => {
        try {
            const response = await updateStudentFee(enrollmentId, editForm.totalFee, editForm.discount);
            if (response.success) {
                setAllStudents(prev => prev.map(s =>
                    s.id === enrollmentId ? { ...s, totalFee: Number(editForm.totalFee), discount: Number(editForm.discount) } : s
                ));
                setEditingId(null);
            }
        } catch (error) {
            console.error("Failed to update fee", error);
        }
    };

    const handleIssueCertificate = async (enrollmentId, currentStatus) => {
        try {
            const response = await updateStudentCertificate(enrollmentId, !currentStatus);
            if (response.success) {
                setAllStudents(prev => prev.map(s =>
                    s.id === enrollmentId ? { ...s, certificateIssued: !currentStatus, certificateDate: !currentStatus ? new Date().toISOString().split('T')[0] : null } : s
                ));
            }
        } catch (error) {
            console.error("Failed to toggle certificate", error);
        }
    };

    const filteredStudents = allStudents.filter(student => {
        const matchesSearch = (student.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (student.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            formatStudentId(student.studentId).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCourse = filterCourse === 'All' || student.course === filterCourse;
        const matchesStatus = filterStatus === 'All' || 
            (filterStatus === 'FROZEN' && student.isFrozen) || 
            (filterStatus === 'ACTIVE' && !student.isFrozen);

        return matchesSearch && matchesCourse && matchesStatus;
    });

    const uniqueCourses = ['All', ...new Set(allStudents.map(s => s.course))];

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <UserCheck className="w-8 h-8 text-blue-600" />
                    Student Management & Account Access
                </h1>
                <p className="text-slate-500 mt-1">Super Admin Controls: freeze/unfreeze accounts, adjust fees, verify certificates, and manage enrollments.</p>
            </div>

            {/* Controls Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                    <input
                        type="text"
                        placeholder="Search student ID, name, email..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                    <Filter size={16} className="text-slate-400 hidden sm:block" />
                    
                    {/* Status Filter */}
                    <select
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="ACTIVE">Active Accounts</option>
                        <option value="FROZEN">Frozen / Suspended</option>
                    </select>

                    {/* Course Filter */}
                    <select
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        value={filterCourse}
                        onChange={(e) => setFilterCourse(e.target.value)}
                    >
                        {uniqueCourses.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-400">Loading student directory...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                                    <th className="py-4 px-6">Student ID & Name</th>
                                    <th className="py-4 px-6">Contact Details</th>
                                    <th className="py-4 px-6">Enrolled Course</th>
                                    <th className="py-4 px-6">Tuition Paid</th>
                                    <th className="py-4 px-6">Account Status</th>
                                    <th className="py-4 px-6">Certificate</th>
                                    <th className="py-4 px-6 text-right">Admin Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs">
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map(student => {
                                        const formattedId = formatStudentId(student.studentId);
                                        const isStringId = typeof student.id === 'string' && student.id.startsWith('user-');

                                        return (
                                            <tr key={student.id} className={`hover:bg-slate-50/70 transition-colors ${student.isFrozen ? 'bg-red-50/30' : ''}`}>
                                                <td className="py-4 px-6">
                                                    <span className="font-mono text-xs font-bold text-blue-700 block">
                                                        {formattedId}
                                                    </span>
                                                    <span className="font-extrabold text-slate-900 text-sm">
                                                        {student.name}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="text-slate-700 font-medium">{student.email}</div>
                                                    <div className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                                                        <Phone size={11} /> {student.phone}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-blue-50 text-blue-800 border border-blue-100 inline-block">
                                                        {student.course}
                                                    </span>
                                                    {student.transactionId && student.transactionId !== '-' && (
                                                        <span className="block font-mono text-[10px] text-slate-400 mt-1">
                                                            Txn: {student.transactionId}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 font-black text-slate-900">
                                                    ₹{student.amountPaid?.toLocaleString() || 0}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {student.isFrozen ? (
                                                        <div>
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-red-100 text-red-800">
                                                                <ShieldAlert size={12} /> FROZEN
                                                            </span>
                                                            {student.freezeReason && (
                                                                <span className="block text-[10px] text-red-600 mt-0.5 max-w-[120px] truncate" title={student.freezeReason}>
                                                                    {student.freezeReason}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800">
                                                            <ShieldCheck size={12} /> ACTIVE
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {!isStringId ? (
                                                        <button
                                                            onClick={() => handleIssueCertificate(student.id, student.certificateIssued)}
                                                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                                                student.certificateIssued
                                                                    ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                            }`}
                                                            title="Toggle certificate issue status"
                                                        >
                                                            <Award size={12} className={student.certificateIssued ? "text-amber-600" : "text-slate-400"} />
                                                            {student.certificateIssued ? 'Issued' : 'Grant'}
                                                        </button>
                                                    ) : (
                                                        <span className="text-slate-400">-</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 text-right space-x-2">
                                                    {/* Freeze / Unfreeze Toggle Button */}
                                                    {student.isFrozen ? (
                                                        <button
                                                            onClick={() => handleToggleFreeze(student, false)}
                                                            disabled={freezeActionLoading}
                                                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                                                            title="Reactivate student account"
                                                        >
                                                            Unfreeze
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => setFreezeModalStudent(student)}
                                                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold rounded-xl transition-colors cursor-pointer"
                                                            title="Freeze student access"
                                                        >
                                                            Freeze
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="p-12 text-center text-slate-400">
                                            No students found matching your search criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Freeze Confirmation Modal */}
            {freezeModalStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-fadeIn">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center relative">
                        <button
                            onClick={() => setFreezeModalStudent(null)}
                            className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                            <X size={20} />
                        </button>

                        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                            <ShieldAlert size={24} />
                        </div>

                        <h3 className="text-xl font-black text-slate-900">Freeze Student Account?</h3>
                        <p className="text-xs text-slate-500 mt-1 mb-4">
                            Freezing will immediately block <strong>{freezeModalStudent.name}</strong> ({formatStudentId(freezeModalStudent.studentId)}) from logging in and accessing course materials.
                        </p>

                        <div className="text-left mb-6">
                            <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Suspension (Optional)</label>
                            <input
                                type="text"
                                placeholder="e.g., Pending fee verification, terms violation..."
                                value={freezeReason}
                                onChange={(e) => setFreezeReason(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setFreezeModalStudent(null)}
                                className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-xs text-slate-700 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleToggleFreeze(freezeModalStudent, true)}
                                disabled={freezeActionLoading}
                                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 font-bold text-xs text-white shadow-md transition-colors cursor-pointer disabled:opacity-60"
                            >
                                {freezeActionLoading ? 'Freezing...' : 'Confirm Freeze'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminStudents;
