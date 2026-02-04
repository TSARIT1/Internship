import React, { useState, useEffect } from 'react';
import { Search, Filter, Mail, Edit2, Check, X } from 'lucide-react';
import { getAllEnrollments, getStudents, updateStudentFee, updateStudentCertificate } from '../services/studentApi';

const AdminStudents = () => {
    const [allStudents, setAllStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterWebinar, setFilterWebinar] = useState('All');

    // Fee Editing State
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ totalFee: 0, discount: 0 });

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            // Fetch both enrollments AND all users
            const [enrollmentRes, usersRes] = await Promise.all([
                getAllEnrollments(),
                getStudents()
            ]);

            const enrollments = enrollmentRes.success ? enrollmentRes.data : [];
            const users = usersRes.data || [];

            // Map Enrollments first
            const enrolledMap = enrollments.map(enr => ({
                id: enr.id,
                studentId: enr.user.id,
                name: enr.studentName || enr.user.username, // Prefer historical name
                email: enr.user.email,
                webinar: enr.courseName,
                totalFee: enr.fee,
                discount: enr.discount,
                date: enr.enrollmentDate,
                certificateIssued: enr.certificateIssued,
                certificateDate: enr.certificateDate,
                transactionId: enr.transactionId,
                amountPaid: enr.amountPaid,
                status: 'Enrolled'
            }));

            // Identify users who are NOT in the enrollment list (by email or ID)
            // Note: A user might have multiple enrollments, so we don't just dedupe by ID.
            // We want to show:
            // 1. All Enrollments (as they are distinct records)
            // 2. Any User who has NO enrollments at all.

            const enrolledUserIds = new Set(enrollments.map(e => e.user.id));

            const nonEnrolledUsers = users
                .filter(u => !enrolledUserIds.has(u.id))
                .map(u => ({
                    id: `user-${u.id}`, // specific ID for table key
                    studentId: u.id,
                    name: u.name || u.username,
                    email: u.email,
                    webinar: "Not Enrolled",
                    totalFee: 0,
                    discount: 0,
                    date: "N/A", // or u.created_at if we had it
                    certificateIssued: false,
                    certificateDate: null,
                    transactionId: "-",
                    amountPaid: 0,
                    status: 'Registered'
                }));

            setAllStudents([...enrolledMap, ...nonEnrolledUsers]);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
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

    const handleSaveEdit = async (studentId) => {
        try {
            const response = await updateStudentFee(studentId, editForm.totalFee, editForm.discount);
            if (response.success) {
                setAllStudents(prev => prev.map(s =>
                    s.id === studentId ? { ...s, totalFee: Number(editForm.totalFee), discount: Number(editForm.discount) } : s
                ));
                setEditingId(null);
            }
        } catch (error) {
            console.error("Failed to update fee", error);
        }
    };

    const handleIssueCertificate = async (studentId, currentStatus) => {
        try {
            // If already issued, maybe we want to revoke? For now let's just allow issuing.
            if (currentStatus) return; // Or toggle

            const response = await updateStudentCertificate(studentId, true);
            if (response.success) {
                setAllStudents(prev => prev.map(s =>
                    s.id === studentId ? { ...s, certificateIssued: true, certificateDate: new Date().toISOString().split('T')[0] } : s
                ));
            }
        } catch (error) {
            console.error("Failed to issue certificate", error);
        }
    };

    const filteredStudents = allStudents.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterWebinar === 'All' || student.webinar === filterWebinar;
        return matchesSearch && matchesFilter;
    });

    const uniqueWebinars = ['All', ...new Set(allStudents.map(s => s.webinar))];

    return (
        <div className="p-6 md:p-12 max-w-7xl mx-auto">
            <header className="mb-12">
                <h1 className="text-3xl font-bold text-slate-900 font-display">Registered Students</h1>
                <p className="text-slate-500">View and manage webinar registrations</p>
            </header>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Controls */}
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Filter size={20} className="text-slate-400" />
                        <select
                            className="w-full md:w-auto bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500"
                            value={filterWebinar}
                            onChange={(e) => setFilterWebinar(e.target.value)}
                        >
                            {uniqueWebinars.map(w => (
                                <option key={w} value={w}>{w}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 pl-6 font-bold text-slate-700 text-sm">Student Name</th>
                                <th className="p-4 font-bold text-slate-700 text-sm">Email Address</th>
                                <th className="p-4 font-bold text-slate-700 text-sm">Webinar</th>
                                <th className="p-4 font-bold text-slate-700 text-sm">Txn ID</th>
                                <th className="p-4 font-bold text-slate-700 text-sm">Amount Paid</th>
                                <th className="p-4 font-bold text-slate-700 text-sm">Total Fee</th>
                                <th className="p-4 font-bold text-slate-700 text-sm">Discount</th>
                                <th className="p-4 font-bold text-slate-700 text-sm">Final Fee</th>
                                <th className="p-4 font-bold text-slate-700 text-sm">Certificate</th>
                                <th className="p-4 font-bold text-slate-700 text-sm">Date</th>
                                <th className="p-4 pr-6 text-right font-bold text-slate-700 text-sm">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map(student => (
                                    <tr key={student.id} className="hover:bg-blue-50/50 transition-colors">
                                        <td className="p-4 pl-6 font-medium text-slate-900">{student.name}</td>
                                        <td className="p-4 text-slate-600">{student.email}</td>
                                        <td className="p-4">
                                            <span className="bg-blue-100 text-blue-700 py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wide">
                                                {student.webinar}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-700 font-medium">
                                            <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">
                                                {student.transactionId || "N/A"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-green-700 font-bold">
                                            ₹{student.amountPaid?.toLocaleString() || "0"}
                                        </td>
                                        <td className="p-4 text-slate-700 font-medium">
                                            {editingId === student.id ? (
                                                <input
                                                    type="number"
                                                    className="w-24 p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                                    value={editForm.totalFee}
                                                    onChange={(e) => setEditForm({ ...editForm, totalFee: e.target.value })}
                                                />
                                            ) : (
                                                `₹${student.totalFee?.toLocaleString() || 0}`
                                            )}
                                        </td>
                                        <td className="p-4 text-slate-700 font-medium">
                                            {editingId === student.id ? (
                                                <input
                                                    type="number"
                                                    className="w-24 p-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                                    value={editForm.discount}
                                                    onChange={(e) => setEditForm({ ...editForm, discount: e.target.value })}
                                                />
                                            ) : (
                                                student.discount > 0 ? (
                                                    <span className="text-green-600 font-bold">-₹{student.discount?.toLocaleString()}</span>
                                                ) : '-'
                                            )}
                                        </td>
                                        <td className="p-4 text-slate-900 font-bold">
                                            ₹{((student.totalFee || 0) - (student.discount || 0)).toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            {student.certificateIssued ? (
                                                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 py-1 px-3 rounded-full text-xs font-bold uppercase tracking-wide border border-green-200">
                                                    <Check size={12} strokeWidth={3} /> Issued
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleIssueCertificate(student.id, student.certificateIssued)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded-lg text-xs font-bold uppercase tracking-wide shadow-sm hover:shadow transition-all"
                                                >
                                                    Issue
                                                </button>
                                            )}
                                        </td>
                                        <td className="p-4 text-slate-500 text-sm">{student.date}</td>
                                        <td className="p-4 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {editingId === student.id ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleSaveEdit(student.id)}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Save"
                                                        >
                                                            <Check size={18} />
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Cancel"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleEditClick(student)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Edit Fee"
                                                        >
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button className="text-slate-400 hover:text-blue-600 p-2 hover:bg-slate-50 rounded-lg transition-colors" title="Send Email">
                                                            <Mail size={18} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="p-8 text-center text-slate-500">
                                        No students found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 text-center text-xs text-slate-400">
                    Showing {filteredStudents.length} students
                </div>
            </div>
        </div>
    );
};

export default AdminStudents;
