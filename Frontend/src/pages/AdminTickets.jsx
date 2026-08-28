import React, { useEffect, useState } from 'react';
import { getAllTickets, replyToTicket, updateTicketStatus } from '../services/studentApi';
import {
    HelpCircle,
    MessageSquare,
    Clock,
    CheckCircle,
    AlertCircle,
    Send,
    Search,
    Filter,
    X,
    User,
    Mail,
    Phone,
    Sparkles,
    Check
} from 'lucide-react';
import { formatStudentId } from '../utils/studentUtils';

const AdminTickets = () => {
    const adminUser = JSON.parse(sessionStorage.getItem('user') || '{}');
    const [tickets, setTickets] = useState([]);
    const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0 });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    // Reply Modal State
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [replyStatus, setReplyStatus] = useState('RESOLVED');
    const [submitting, setSubmitting] = useState(false);
    const [replyMessage, setReplyMessage] = useState(null);

    const fetchTickets = async () => {
        try {
            const res = await getAllTickets();
            if (res.success) {
                setTickets(res.data || []);
                setStats(res.stats || { total: 0, open: 0, inProgress: 0, resolved: 0 });
            }
        } catch (err) {
            console.error("Failed to load admin tickets", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleOpenReplyModal = (ticket) => {
        setSelectedTicket(ticket);
        setReplyText(ticket.adminReply || '');
        setReplyStatus(ticket.status === 'OPEN' ? 'RESOLVED' : ticket.status);
        setReplyMessage(null);
    };

    const handleSendReply = async (e) => {
        e.preventDefault();
        if (!selectedTicket || !replyText.trim()) return;

        setSubmitting(true);
        setReplyMessage(null);

        try {
            const res = await replyToTicket(selectedTicket.id, {
                reply: replyText,
                status: replyStatus,
                adminName: adminUser.username || 'Super Admin'
            });

            if (res.success) {
                setReplyMessage({ type: 'success', text: 'Reply submitted and dispatched to student email!' });
                fetchTickets();
                setTimeout(() => {
                    setSelectedTicket(null);
                    setReplyMessage(null);
                }, 1500);
            } else {
                setReplyMessage({ type: 'error', text: res.message || 'Failed to submit reply.' });
            }
        } catch (err) {
            setReplyMessage({ type: 'error', text: 'Error replying to ticket.' });
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
                return <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200 uppercase">URGENT</span>;
            case 'HIGH':
                return <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200 uppercase">HIGH</span>;
            default:
                return <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md uppercase">MEDIUM</span>;
        }
    };

    const filteredTickets = tickets.filter(t => {
        const matchesSearch = (t.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (t.ticketNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (t.studentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (t.studentEmail || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <HelpCircle className="w-8 h-8 text-blue-600" />
                    Student Support Tickets & Inquiries
                </h1>
                <p className="text-slate-500 mt-1">Review student issues, respond to LMS/fee tickets, and dispatch official resolutions.</p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Raised</span>
                    <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.total || tickets.length}</h3>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">Pending / Open</span>
                    <h3 className="text-2xl font-black text-amber-600 mt-1">{stats.open || 0}</h3>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">In Progress</span>
                    <h3 className="text-2xl font-black text-blue-600 mt-1">{stats.inProgress || 0}</h3>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">Resolved</span>
                    <h3 className="text-2xl font-black text-emerald-600 mt-1">{stats.resolved || 0}</h3>
                </div>
            </div>

            {/* Filter & Search */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-80">
                    <input
                        type="text"
                        placeholder="Search student, ticket # or subject..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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

            {/* Tickets Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-400">Loading tickets...</div>
                ) : filteredTickets.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                                    <th className="py-4 px-6">Ticket & Student</th>
                                    <th className="py-4 px-6">Category & Priority</th>
                                    <th className="py-4 px-6">Subject & Message</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-xs">
                                {filteredTickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="font-mono font-bold text-blue-700">
                                                {ticket.ticketNumber || `TKT-2026-${ticket.id}`}
                                            </div>
                                            <div className="font-black text-slate-900 mt-0.5">
                                                {ticket.studentName || (ticket.user ? ticket.user.username : 'Student')}
                                            </div>
                                            <div className="text-slate-400 text-[11px]">
                                                {ticket.studentEmail || (ticket.user ? ticket.user.email : '-')}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 space-y-1">
                                            <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-bold text-[10px]">
                                                {ticket.category}
                                            </span>
                                            <div>{getPriorityBadge(ticket.priority)}</div>
                                        </td>
                                        <td className="py-4 px-6 max-w-xs">
                                            <div className="font-bold text-slate-900 truncate">{ticket.subject}</div>
                                            <div className="text-slate-500 line-clamp-2 mt-0.5">{ticket.description}</div>
                                            {ticket.adminReply && (
                                                <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                                                    ✓ Replied: {ticket.adminReply.substring(0, 45)}...
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            {getStatusBadge(ticket.status)}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <button
                                                onClick={() => handleOpenReplyModal(ticket)}
                                                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                                            >
                                                {ticket.adminReply ? 'Update Reply' : 'Reply & Resolve'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center text-slate-400 text-xs">
                        No support tickets found for this filter.
                    </div>
                )}
            </div>

            {/* Modal: Super Admin Reply to Student */}
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
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md">
                                    {selectedTicket.ticketNumber || `TKT-2026-${selectedTicket.id}`}
                                </span>
                                {getStatusBadge(selectedTicket.status)}
                            </div>
                            <h3 className="font-black text-xl text-slate-900">{selectedTicket.subject}</h3>
                            <p className="text-xs text-slate-500 mt-1">
                                Student: <strong>{selectedTicket.studentName}</strong> ({selectedTicket.studentEmail || 'No email'})
                            </p>
                        </div>

                        {/* Student Message */}
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-5">
                            <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">Student Inquiry</span>
                            <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                                {selectedTicket.description}
                            </p>
                        </div>

                        {replyMessage && (
                            <div className={`p-3 rounded-xl mb-4 text-xs font-bold ${replyMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                {replyMessage.text}
                            </div>
                        )}

                        {/* Reply Form */}
                        <form onSubmit={handleSendReply} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Update Ticket Status</label>
                                <select
                                    value={replyStatus}
                                    onChange={(e) => setReplyStatus(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                >
                                    <option value="RESOLVED">RESOLVED (Issue Solved)</option>
                                    <option value="IN_PROGRESS">IN_PROGRESS (Under Review)</option>
                                    <option value="CLOSED">CLOSED (Closed Ticket)</option>
                                    <option value="OPEN">OPEN (Keep Open)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Official Admin Reply</label>
                                <textarea
                                    required
                                    rows={5}
                                    placeholder="Type your official resolution response to the student..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 leading-relaxed"
                                ></textarea>
                                <p className="text-[11px] text-slate-400 mt-1">
                                    Submitting will notify the student and dispatch an email from <strong>tsarit@tsaritservices.com</strong>.
                                </p>
                            </div>

                            <div className="pt-2 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedTicket(null)}
                                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                                >
                                    <Send size={13} /> {submitting ? 'Sending...' : 'Send Official Reply & Email'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTickets;
