import React, { useState, useEffect } from 'react';
import { Users, Search, Phone, Mail, BookOpen, Trash2, CheckCircle2, MessageCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { getContactQueries, updateContactStatus, deleteContactQuery } from '../services/studentApi';

const AdminLeads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const fetchLeads = async () => {
        setLoading(true);
        const res = await getContactQueries();
        if (res.success && res.data) {
            setLeads(res.data.reverse());
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        const res = await updateContactStatus(id, newStatus);
        if (res.success) {
            setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
        } else {
            alert("Failed to update status");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this lead inquiry?")) {
            const res = await deleteContactQuery(id);
            if (res.success) {
                setLeads(prev => prev.filter(lead => lead.id !== id));
            } else {
                alert("Failed to delete inquiry");
            }
        }
    };

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = 
            (lead.name && lead.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (lead.phone && lead.phone.includes(searchTerm)) ||
            (lead.course && lead.course.toLowerCase().includes(searchTerm.toLowerCase()));

        if (statusFilter === 'ALL') return matchesSearch;
        return matchesSearch && (lead.status || 'NEW') === statusFilter;
    });

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto font-sans">
            <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 font-display">Admissions Leads & Inquiries</h1>
                    <p className="text-slate-500 text-sm">Review, contact, and manage incoming counseling and syllabus requests.</p>
                </div>
                <button
                    onClick={fetchLeads}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl font-bold text-xs transition-colors self-start sm:self-auto cursor-pointer"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                    <span>Refresh Leads</span>
                </button>
            </header>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-slate-400 uppercase">Total Inquiries</div>
                    <div className="text-2xl font-black text-slate-900 mt-1">{leads.length}</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-blue-500 uppercase">New Requests</div>
                    <div className="text-2xl font-black text-blue-600 mt-1">
                        {leads.filter(l => (l.status || 'NEW') === 'NEW').length}
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-amber-500 uppercase">Contacted</div>
                    <div className="text-2xl font-black text-amber-600 mt-1">
                        {leads.filter(l => l.status === 'CONTACTED').length}
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="text-xs font-bold text-emerald-500 uppercase">Enrolled</div>
                    <div className="text-2xl font-black text-emerald-600 mt-1">
                        {leads.filter(l => l.status === 'ENROLLED').length}
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search by name, email, phone, domain..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-blue-600"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
                    {['ALL', 'NEW', 'CONTACTED', 'ENROLLED', 'REJECTED'].map(st => (
                        <button
                            key={st}
                            onClick={() => setStatusFilter(st)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
                                statusFilter === st
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            {st}
                        </button>
                    ))}
                </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-400 text-sm">
                        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                        <span>Loading leads...</span>
                    </div>
                ) : filteredLeads.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <Users size={32} className="mx-auto text-slate-300 mb-2" />
                        <h4 className="font-bold text-slate-800">No leads found</h4>
                        <p className="text-xs text-slate-400 mt-1">Try changing search or filter parameters.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[11px] tracking-wider">
                                    <th className="p-4 pl-6">Applicant Name</th>
                                    <th className="p-4">Contact Channels</th>
                                    <th className="p-4">Tech Domain</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Quick Actions</th>
                                    <th className="p-4 text-right pr-6">Delete</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredLeads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                                        <td className="p-4 pl-6">
                                            <div className="font-bold text-slate-900">{lead.name || 'Anonymous'}</div>
                                            <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 max-w-xs">{lead.message}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-slate-800 font-medium">{lead.email || 'No email'}</div>
                                            <div className="text-slate-500 text-xs">{lead.phone || 'No phone'}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg text-xs border border-blue-200/60">
                                                {lead.course || 'General'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <select
                                                value={lead.status || 'NEW'}
                                                onChange={e => handleStatusChange(lead.id, e.target.value)}
                                                className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border outline-none cursor-pointer ${
                                                    (lead.status || 'NEW') === 'NEW' ? 'bg-blue-50 text-blue-700 border-blue-300' :
                                                    lead.status === 'CONTACTED' ? 'bg-amber-50 text-amber-700 border-amber-300' :
                                                    lead.status === 'ENROLLED' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' :
                                                    'bg-red-50 text-red-700 border-red-300'
                                                }`}
                                            >
                                                <option value="NEW">NEW</option>
                                                <option value="CONTACTED">CONTACTED</option>
                                                <option value="ENROLLED">ENROLLED</option>
                                                <option value="REJECTED">REJECTED</option>
                                            </select>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                {lead.phone && (
                                                    <>
                                                        <a
                                                            href={`tel:${lead.phone}`}
                                                            title="Direct Phone Call"
                                                            className="p-2 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 transition-colors"
                                                        >
                                                            <Phone size={14} />
                                                        </a>
                                                        <a
                                                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(lead.name || 'there')},%20greetings%20from%20TSAR%20IT%20Internship%20Admissions.`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            title="WhatsApp Chat"
                                                            className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 transition-colors"
                                                        >
                                                            <MessageCircle size={14} />
                                                        </a>
                                                    </>
                                                )}
                                                {lead.email && (
                                                    <a
                                                        href={`mailto:${lead.email}?subject=TSAR%20IT%20Internship%20Information`}
                                                        title="Send Email"
                                                        className="p-2 rounded-lg bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 transition-colors"
                                                    >
                                                        <Mail size={14} />
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right pr-6">
                                            <button
                                                onClick={() => handleDelete(lead.id)}
                                                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                                title="Delete inquiry"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminLeads;
