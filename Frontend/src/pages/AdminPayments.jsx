import React, { useState, useEffect } from 'react';
import { getAllEnrollments, getStudents } from '../services/studentApi';
import {
    Download,
    Search,
    Filter,
    TrendingUp,
    CreditCard,
    Users,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    DollarSign
} from 'lucide-react';
import * as XLSX from 'xlsx';

const AdminPayments = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [period, setPeriod] = useState('all'); // all, today, week, month

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch both Enrollments and Users (for legacy support)
            const [enrollmentRes, usersRes] = await Promise.all([
                getAllEnrollments(),
                getStudents()
            ]);

            const enrollments = enrollmentRes.success ? enrollmentRes.data : [];
            const users = usersRes.data || [];

            // 1. Process Real Enrollments
            const mappedEnrollments = enrollments.map(e => ({
                id: e.id,
                transactionId: e.transactionId,
                studentName: e.studentName || e.user.username,
                email: e.user.email,
                courseName: e.courseName,
                // amountPaid logic: if stored, use it, else fee-discount
                amountPaid: e.amountPaid !== undefined ? e.amountPaid : ((e.fee || 0) - (e.discount || 0)),
                paymentTime: e.paymentTime || e.enrollmentDate,
                status: e.status || "ACTIVE",
                userId: e.user.id
            }));

            // 2. Process Legacy Users (who are NOT in enrollment list)
            // We check if they have a 'course' and 'totalFee' set directly on User entity
            const enrolledUserIds = new Set(enrollments.map(e => e.user.id));

            const legacyPayments = users
                .filter(u => !enrolledUserIds.has(u.id) && u.webinar && u.webinar !== "Not Selected") // u.webinar is mapped from u.course
                .map(u => ({
                    id: `legacy-${u.id}`,
                    transactionId: "LEGACY", // Placeholder for old data
                    studentName: u.name,
                    email: u.email,
                    courseName: u.webinar,
                    amountPaid: (u.totalFee || 0) - (u.discount || 0),
                    paymentTime: u.date, // User creation date or similar
                    status: "ACTIVE", // Assumed active
                    userId: u.id
                }));

            // Combine and Sort
            const combinedData = [...mappedEnrollments, ...legacyPayments];
            const sortedData = combinedData.sort((a, b) => {
                // Sort by date/ID desc
                return new Date(b.paymentTime || 0) - new Date(a.paymentTime || 0);
            });

            setEnrollments(sortedData);

        } catch (error) {
            console.error("Failed to fetch payments", error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate Stats
    const totalRevenue = enrollments.reduce((sum, e) => sum + (e.amountPaid || 0), 0);
    const totalTransactions = enrollments.filter(e => e.transactionId).length;

    // Recent (Today)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const revenueToday = enrollments
        .filter(e => new Date(e.paymentTime || e.enrollmentDate) >= todayStart)
        .reduce((sum, e) => sum + (e.amountPaid || 0), 0);

    const filteredEnrollments = enrollments.filter(e => {
        const searchLower = searchTerm.toLowerCase();
        // Check name, course, transaction ID
        const matchSearch =
            (e.studentName?.toLowerCase() || '').includes(searchLower) ||
            (e.courseName?.toLowerCase() || '').includes(searchLower) ||
            (e.transactionId?.toLowerCase() || '').includes(searchLower);

        if (!matchSearch) return false;

        // Date Filter
        if (period === 'all') return true;

        const date = new Date(e.paymentTime || e.enrollmentDate);
        const now = new Date();

        if (period === 'today') {
            return date.toDateString() === now.toDateString();
        }
        if (period === 'week') {
            const weekAgo = new Date(now.setDate(now.getDate() - 7));
            return date >= weekAgo;
        }
        if (period === 'month') {
            const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
            return date >= monthAgo;
        }
        return true;
    });

    const exportToExcel = () => {
        const dataToExport = filteredEnrollments.map(e => ({
            "Transaction ID": e.transactionId || "N/A",
            "Student Name": e.studentName || "N/A",
            "Course": e.courseName,
            "Amount Paid": e.amountPaid || 0,
            "Date": e.paymentTime ? new Date(e.paymentTime).toLocaleString() : e.enrollmentDate,
            "Status": e.status
        }));

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Payments");
        XLSX.writeFile(wb, "Payment_Report.xlsx");
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Financial Overview</h1>
                    <p className="text-slate-500 mt-1">Track revenue and transaction history.</p>
                </div>
                <button
                    onClick={exportToExcel}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm"
                >
                    <Download size={20} /> Export Report
                </button>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <DollarSign size={24} />
                        </div>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                            <TrendingUp size={12} /> Live
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Total Revenue</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-1">
                        ₹{totalRevenue.toLocaleString()}
                    </h3>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                            <CreditCard size={24} />
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Total Transactions</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-1">
                        {totalTransactions}
                    </h3>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                            <Calendar size={24} />
                        </div>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                            Today
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Revenue Today</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-1">
                        ₹{revenueToday.toLocaleString()}
                    </h3>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Users size={20} className="text-slate-400" />
                        Recent Transactions
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search transaction..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                            />
                        </div>

                        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
                            {['all', 'today', 'week', 'month'].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${period === p
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Transaction ID</th>
                                <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Student</th>
                                <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Course</th>
                                <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Amount</th>
                                <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Date</th>
                                <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-500">Loading payments...</td>
                                </tr>
                            ) : filteredEnrollments.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-500">No transactions found.</td>
                                </tr>
                            ) : (
                                filteredEnrollments.map((enrollment) => (
                                    <tr key={enrollment.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4">
                                            <span className="font-mono text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                                {enrollment.transactionId || "N/A"}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-slate-900">{enrollment.studentName || enrollment.user?.email || "Unknown"}</div>
                                            <div className="text-xs text-slate-500">{enrollment.user?.email}</div>
                                        </td>
                                        <td className="p-4 text-sm font-medium text-slate-700">
                                            {enrollment.courseName}
                                        </td>
                                        <td className="p-4 font-bold text-slate-900">
                                            ₹{enrollment.amountPaid?.toLocaleString()}
                                        </td>
                                        <td className="p-4 text-sm text-slate-500">
                                            {enrollment.paymentTime
                                                ? new Date(enrollment.paymentTime).toLocaleDateString()
                                                : new Date(enrollment.enrollmentDate).toLocaleDateString()
                                            }
                                            <div className="text-xs text-slate-400">
                                                {enrollment.paymentTime ? new Date(enrollment.paymentTime).toLocaleTimeString() : ''}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${enrollment.status === 'ACTIVE'
                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                : 'bg-slate-100 text-slate-600 border-slate-200'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${enrollment.status === 'ACTIVE' ? 'bg-green-500' : 'bg-slate-400'
                                                    }`} />
                                                {enrollment.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPayments;
