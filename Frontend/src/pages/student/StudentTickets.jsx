import React, { useEffect, useState } from 'react';
import { getMyTickets, createTicket } from '../../services/studentApi';
import {
    HelpCircle,
    Plus,
    Clock,
    CheckCircle,
    AlertCircle,
    MessageSquare,
    Send,
    Tag,
    ChevronRight,
    Search,
    ShieldAlert,
    Sparkles,
    User,
    X,
    Filter
} from 'lucide-react';
import { formatStudentId } from '../../utils/studentUtils';

const StudentTickets = () => {
    const student = JSON.parse(sessionStorage.getItem('student') || '{}');
    const studentIdFormatted = formatStudentId(student.id);

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    // Create Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formMessage, setFormMessage] = useState(null);

    const [formData, setFormData] = useState({
        subject: '',
        category: 'COURSE_ACCESS',
        priority: 'MEDIUM',
        description: ''
    });

    // View Details Modal State
    const [selectedTicket, setSelectedTicket] = useState(null);

    const fetchTickets = async () => {
        if (!student.id) {
            setLoading(false);
            return;
        }
        try {
            const res = await getMyTickets(student.id);
            if (res.success) {
                setTickets(res.data || []);
            }
        } catch (err) {
            console.error("Failed to load tickets", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [student.id]);

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setFormMessage(null);

        try {
            const res = await createTicket({
                userId: student.id,
                studentName: student.name || student.username,
                studentEmail: student.email,
                studentPhone: student.phone,
                subject: formData.subject,
                category: formData.category,
                priority: formData.priority,
                description: formData.description
            });

            if (res.success) {
                setFormMessage({ type: 'success', text: `Ticket ${res.data.ticketNumber || 'created'} submitted successfully!` });
                setFormData({ subject: '', category: 'COURSE_ACCESS', priority: 'MEDIUM', description: '' });
                fetchTickets();
                setTimeout(() => {
                    setShowCreateModal(false);
                    setFormMessage(null);
                }, 1500);
            } else {
                setFormMessage({ type: 'error', text: res.message || 'Failed to submit ticket.' });
            }
        } catch (err) {
            setFormMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'RESOLVED':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800">
                        <CheckCircle size={12} /> Resolved
                    </span>
                );
            case 'IN_PROGRESS':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800">
                        <Clock size={12} /> In Progress
                    </span>
                );
            case 'CLOSED':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-700">
                        Closed
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800">
                        <AlertCircle size={12} /> Open
                    </span>
                );
        }
    };

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case 'URGENT':
                return <span className="text-[11px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">URGENT</span>;
            case 'HIGH':
                return <span className="text-[11px] font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200">HIGH</span>;
            default:
                return <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">MEDIUM</span>;
        }
    };

    const filteredTickets = tickets.filter(t => {
        const matchesSearch = (t.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (t.ticketNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <HelpCircle className="w-8 h-8 text-blue-600" />
                        Helpdesk & Support Tickets
                    </h1>
                    <p className="text-slate-500 mt-1">Raise support inquiries, request batch assistance, and track official Super Admin resolutions.</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                >
                    <Plus size={18} /> Raise Support Ticket
                </button>
            </div>

            {/* Quick Filter & Search Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-80">
                    <input
                        type="text"
                        placeholder="Search ticket # or subject..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                    <Filter size={15} className="text-slate-400 hidden sm:block" />
                    {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                                filterStatus === status
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tickets Table / List */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-400">Loading support tickets...</div>
                ) : filteredTickets.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {filteredTickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                onClick={() => setSelectedTicket(ticket)}
                                className="p-5 sm:p-6 hover:bg-slate-50/70 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                            >
                                <div className="space-y-1.5 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                                            {ticket.ticketNumber || `TKT-2026-${ticket.id}`}
                                        </span>
                                        {getStatusBadge(ticket.status)}
                                        {getPriorityBadge(ticket.priority)}
                                        <span className="text-[11px] font-semibold text-slate-400">
                                            {ticket.category}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                                        {ticket.subject}
                                    </h3>
                                    <p className="text-xs text-slate-500 line-clamp-1">
                                        {ticket.description}
                                    </p>
                                    {ticket.adminReply && (
                                        <div className="mt-2 text-xs bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-100 flex items-start gap-2">
                                            <Sparkles size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                                            <div>
                                                <strong>Admin Response:</strong> {ticket.adminReply}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 shrink-0 text-slate-400 group-hover:text-blue-600 transition-colors">
                                    <span className="text-xs text-slate-400 font-medium">View Thread</span>
                                    <ChevronRight size={18} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center text-slate-500">
                        <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h4 className="font-bold text-slate-800 text-sm">No Support Tickets Found</h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto mb-4">
                            Have an issue with your course access, LMS videos, quiz grades, or fee receipt? Raise a ticket anytime.
                        </p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-sm cursor-pointer"
                        >
                            Raise Ticket
                        </button>
                    </div>
                )}
            </div>

            {/* Modal: Raise New Ticket */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-fadeIn">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 relative">
                        <button
                            onClick={() => setShowCreateModal(false)}
                            className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <HelpCircle size={22} />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-lg text-slate-900">Raise a Support Ticket</h3>
                                <p className="text-xs text-slate-500">Super admin will review and respond directly.</p>
                            </div>
                        </div>

                        {formMessage && (
                            <div className={`p-3 rounded-xl mb-4 text-xs font-bold ${formMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                {formMessage.text}
                            </div>
                        )}

                        <form onSubmit={handleCreateTicket} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    >
                                        <option value="COURSE_ACCESS">Course & LMS Access</option>
                                        <option value="PAYMENT_FEE">Tuition Fee & Invoice</option>
                                        <option value="CERTIFICATE">Certificate Verification</option>
                                        <option value="TECHNICAL_SUPPORT">Technical & Coding</option>
                                        <option value="GENERAL">General Inquiries</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    >
                                        <option value="LOW">Low</option>
                                        <option value="MEDIUM">Medium</option>
                                        <option value="HIGH">High</option>
                                        <option value="URGENT">Urgent</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Brief summary of your issue..."
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description</label>
                                <textarea
                                    required
                                    rows={4}
                                    placeholder="Explain the problem in detail so our administration can assist quickly..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                ></textarea>
                            </div>

                            <div className="pt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                                >
                                    <Send size={13} /> {submitting ? 'Submitting...' : 'Submit Ticket'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: View Ticket Thread & Super Admin Reply */}
            {selectedTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-fadeIn">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setSelectedTicket(null)}
                            className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                            <X size={20} />
                        </button>

                        <div className="border-b border-slate-100 pb-4 mb-5">
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md">
                                    {selectedTicket.ticketNumber || `TKT-2026-${selectedTicket.id}`}
                                </span>
                                {getStatusBadge(selectedTicket.status)}
                                {getPriorityBadge(selectedTicket.priority)}
                            </div>
                            <h3 className="font-black text-xl text-slate-900">{selectedTicket.subject}</h3>
                            <span className="text-[11px] text-slate-400">
                                Category: {selectedTicket.category} • Student ID: {studentIdFormatted}
                            </span>
                        </div>

                        {/* Student Inquiry Box */}
                        <div className="space-y-4">
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <User size={15} className="text-slate-600" />
                                    <span className="text-xs font-bold text-slate-800">Your Inquiry</span>
                                </div>
                                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                                    {selectedTicket.description}
                                </p>
                            </div>

                            {/* Super Admin Reply Box */}
                            {selectedTicket.adminReply ? (
                                <div className="bg-emerald-50/80 rounded-2xl p-5 border border-emerald-200 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Sparkles size={16} className="text-emerald-700" />
                                            <span className="text-xs font-black text-emerald-900">
                                                Super Admin Official Reply ({selectedTicket.adminRepliedBy || 'Administration'})
                                            </span>
                                        </div>
                                        <span className="text-[10px] text-emerald-700 font-medium">
                                            {selectedTicket.adminRepliedAt ? new Date(selectedTicket.adminRepliedAt).toLocaleString() : 'Verified Resolution'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-emerald-900 leading-relaxed whitespace-pre-line bg-white/70 p-3.5 rounded-xl border border-emerald-100">
                                        {selectedTicket.adminReply}
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 text-center text-xs text-amber-800">
                                    <Clock size={16} className="mx-auto mb-1 text-amber-600" />
                                    Our Super Administration is reviewing your ticket and will post the official resolution here shortly.
                                </div>
                            )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={() => setSelectedTicket(null)}
                                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 font-bold text-xs text-slate-700 rounded-xl transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentTickets;
