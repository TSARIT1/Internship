import React, { useEffect, useState } from 'react';
import { getMyEnrollments } from '../../services/studentApi';
import { CreditCard, Download, CheckCircle, Clock, ShieldCheck, Receipt, Globe, ArrowUpRight, IdCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatStudentId } from '../../utils/studentUtils';

const StudentFees = () => {
    const navigate = useNavigate();
    const student = JSON.parse(sessionStorage.getItem('student') || '{}');
    const studentIdFormatted = formatStudentId(student.id);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFees = async () => {
            if (!student.id) {
                setLoading(false);
                return;
            }
            try {
                const res = await getMyEnrollments(student.id);
                if (res.success) {
                    setEnrollments(res.data || []);
                }
            } catch (err) {
                console.error("Failed to load fee records", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFees();
    }, [student.id]);

    const totalPaid = enrollments.reduce((acc, curr) => acc + (curr.amountPaid || curr.fee || 0), 0);

    const handlePrintReceipt = (item) => {
        const printWindow = window.open('', '_blank');
        const printDate = item.paymentTime ? new Date(item.paymentTime).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString();
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Payment Receipt - ${item.courseName}</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
                    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
                    .logo { font-size: 24px; font-weight: 800; color: #2563eb; }
                    .badge { background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: bold; }
                    .details-table { width: 100%; border-collapse: collapse; margin: 25px 0; }
                    .details-table th, .details-table td { padding: 12px; border: 1px solid #e2e8f0; text-align: left; }
                    .details-table th { background: #f8fafc; font-weight: 600; }
                    .total { font-size: 18px; font-weight: bold; color: #0f172a; text-align: right; margin-top: 20px; }
                    .footer { margin-top: 50px; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <div class="logo">TSAR IT SERVICES PVT LTD</div>
                        <p style="font-size: 13px; color: #64748b; margin: 4px 0;">Official Internship & LMS Payment Receipt</p>
                        <p style="font-size: 12px; color: #64748b;">Email: tsarit@tsaritservices.com | Web: internship.tsaritservices.com</p>
                    </div>
                    <div style="text-align: right;">
                        <span class="badge">PAYMENT VERIFIED</span>
                        <p style="font-size: 12px; margin-top: 8px;">Date: <strong>${printDate}</strong></p>
                        <p style="font-size: 11px; color: #64748b; font-family: monospace;">TXN: ${item.transactionId || 'ONLINE_TXN'}</p>
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <h3 style="margin-bottom: 6px;">Billed To:</h3>
                    <p style="margin: 2px 0; font-weight: bold;">${student.name || student.username || 'Student'}</p>
                    <p style="margin: 2px 0; font-size: 13px; color: #2563eb; font-weight: 600;">Student ID: ${studentIdFormatted}</p>
                    <p style="margin: 2px 0; font-size: 14px; color: #475569;">Email: ${student.email || '-'}</p>
                    <p style="margin: 2px 0; font-size: 14px; color: #475569;">Phone: ${student.phone || '-'}</p>
                </div>

                <table class="details-table">
                    <thead>
                        <tr>
                            <th>Program / Course</th>
                            <th>Status</th>
                            <th>Fee (INR)</th>
                            <th>Discount</th>
                            <th>Amount Paid</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>${item.courseName}</strong><br><span style="font-size: 12px; color: #64748b;">Comprehensive Industry Internship Program</span></td>
                            <td><span style="color: #16a34a; font-weight: bold;">ACTIVE</span></td>
                            <td>₹${(item.fee || item.amountPaid || 5000).toLocaleString()}</td>
                            <td>₹${(item.discount || 0).toLocaleString()}</td>
                            <td><strong>₹${(item.amountPaid || item.fee || 5000).toLocaleString()}</strong></td>
                        </tr>
                    </tbody>
                </table>

                <div class="total">
                    Total Amount Paid: ₹${(item.amountPaid || item.fee || 5000).toLocaleString()} INR
                </div>

                <div class="footer">
                    <p>This is a computer-generated tax invoice and payment receipt. Certified by TSAR IT Services Pvt Ltd.</p>
                    <p>© 2026 TSAR IT INTERNSHIP (TSAR IT  Pvt Ltd). All rights reserved.</p>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 500);
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Receipt className="w-8 h-8 text-blue-600" />
                        Fee Statements & Invoices
                    </h1>
                    <p className="text-slate-500 mt-1">Review your tuition fee payments, transaction receipts, and payment status.</p>
                </div>
                <button
                    onClick={() => navigate('/studentdashboard/courses')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                    Enroll in New Course <ArrowUpRight size={16} />
                </button>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/10">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-200 block">Total Tuition Paid</span>
                    <h2 className="text-3xl font-black mt-2">₹{totalPaid.toLocaleString()}</h2>
                    <p className="text-xs text-blue-200 mt-1 flex items-center gap-1">
                        <CheckCircle size={14} /> 100% Cleared & Verified
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Active Subscriptions</span>
                    <h2 className="text-3xl font-black text-slate-900 mt-2">{enrollments.length}</h2>
                    <p className="text-xs text-slate-500 mt-1">Enrolled Internship Batches</p>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Accepted Gateways</span>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold flex items-center gap-1">
                            <CreditCard size={12} /> Razorpay (INR)
                        </span>
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold flex items-center gap-1">
                            <Globe size={12} /> PayPal (USD)
                        </span>
                    </div>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                        <ShieldCheck size={13} /> 256-Bit SSL Encrypted
                    </p>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Payment History & Receipts</h3>
                        <p className="text-xs text-slate-500">Click receipt to download or print your official tax invoice</p>
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-slate-400">Loading fee records...</div>
                ) : enrollments.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                                    <th className="py-4 px-6">Course / Batch</th>
                                    <th className="py-4 px-6">Date</th>
                                    <th className="py-4 px-6">Transaction ID</th>
                                    <th className="py-4 px-6">Amount</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6 text-right">Invoice</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {enrollments.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="py-4 px-6 font-bold text-slate-900">
                                            {item.courseName}
                                            <span className="block text-xs font-normal text-slate-500">Live Mentorship & LMS</span>
                                        </td>
                                        <td className="py-4 px-6 text-slate-600 text-xs">
                                            {item.enrollmentDate || (item.paymentTime ? new Date(item.paymentTime).toLocaleDateString() : '-')}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="font-mono text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded-md">
                                                {item.transactionId || 'ONLINE_VERIFIED'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 font-black text-slate-900">
                                            ₹{(item.amountPaid || item.fee || 5000).toLocaleString()}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100/80 text-emerald-800 rounded-full text-xs font-bold">
                                                <CheckCircle size={12} /> {item.status || 'PAID'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button
                                                onClick={() => handlePrintReceipt(item)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-slate-200 hover:border-blue-200"
                                            >
                                                <Download size={13} /> Receipt
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center text-slate-500">
                        <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h4 className="font-bold text-slate-800">No Payment Records Found</h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                            When you enroll in an internship program, your payment receipts, transaction IDs, and invoices will appear here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentFees;
