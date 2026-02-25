import React, { useState, useEffect } from 'react';
import { getHackathons, addHackathon, updateHackathon, deleteHackathon, getSubmissions, gradeSubmission, markAsWinner } from '../services/hackathonApi';
import { Trash2, Plus, Calendar, Clock, Trophy, MapPin, Pencil, X, CheckCircle, Users, Download, Code, ExternalLink, Star, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx'; // Assuming user has this or we use simple CSV

const AdminHackathons = () => {
    const [hackathons, setHackathons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        prizePool: '',
        status: 'Upcoming', // Default
        mode: 'Online' // Default
    });

    useEffect(() => {
        fetchHackathons();
    }, []);

    const fetchHackathons = async () => {
        try {
            const response = await getHackathons();
            if (response.success) {
                setHackathons(response.data);
            }
        } catch (error) {
            console.error("Error fetching hackathons:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                const response = await updateHackathon(editingId, formData);
                if (response.success) {
                    setHackathons(hackathons.map(h => h.id === editingId ? response.data : h));
                    setEditingId(null);
                    alert("Hackathon updated successfully!");
                } else {
                    console.error("Update Hackathon Error:", response.error);
                    alert(`Failed to update hackathon: ${response.error?.message || "Unknown error"}`);
                }

            } else {
                const response = await addHackathon(formData);
                if (response.success) {
                    setHackathons([...hackathons, response.data]);
                    alert("Hackathon added successfully!");
                } else {
                    console.error("Add Hackathon Error:", response.error);
                    alert(`Failed to add hackathon: ${response.error?.message || "Unknown error"}`);
                }
            }
            // Clear form only on success or intended flow? 
            // Better to keep data if it failed, but adhering to original logic for now, or improving it?
            // Let's only clear if success.
            if (editingId ? (await updateHackathon(editingId, formData)).success : (await addHackathon(formData)).success) {
                setFormData({
                    title: '', description: '', date: '', time: '', prizePool: '', status: 'Upcoming', mode: 'Online'
                });
            }
        } catch (error) {
            console.error("Error saving hackathon (Exception):", error);
            let errorMessage = error.response?.data || error.message || "Unknown error";
            if (typeof errorMessage === 'object') {
                errorMessage = JSON.stringify(errorMessage);
            }
            alert(`Failed to save hackathon: ${errorMessage}`);
        }
    };

    const handleEdit = (hackathon) => {
        setEditingId(hackathon.id);
        setFormData({
            title: hackathon.title || '',
            description: hackathon.description || '',
            date: hackathon.date || '',
            time: hackathon.time || '',
            prizePool: hackathon.prizePool || '',
            status: hackathon.status || 'Upcoming',
            mode: hackathon.mode || 'Online',
            entryFee: hackathon.entryFee || ''
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({
            title: '', description: '', date: '', time: '', prizePool: '', status: 'Upcoming', mode: 'Online', entryFee: ''
        });
    };

    const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
    const [selectedHackathonSubmissions, setSelectedHackathonSubmissions] = useState([]);
    const [loadingSubmissions, setLoadingSubmissions] = useState(false);

    const handleViewSubmissions = async (hackathonId) => {
        setLoadingSubmissions(true);
        setShowSubmissionsModal(true);
        setSelectedHackathonSubmissions([]);

        const response = await getSubmissions(hackathonId);
        if (response.success) {
            setSelectedHackathonSubmissions(response.data);
        } else {
            alert("Failed to fetch submissions");
        }
        setLoadingSubmissions(false);
    };

    const [showGradeModal, setShowGradeModal] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [gradeData, setGradeData] = useState({ score: '', feedback: '' });

    const openGradeModal = (submission) => {
        setSelectedSubmission(submission);
        setGradeData({
            score: submission.score || '',
            feedback: submission.feedback || ''
        });
        setShowGradeModal(true);
    };

    const handleGradeSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await gradeSubmission(selectedSubmission.id, gradeData.score, gradeData.feedback);
            if (response.success) {
                alert("Graded successfully!");
                setShowGradeModal(false);
                // Refresh submissions list locally
                setSelectedHackathonSubmissions(prev => prev.map(item =>
                    item.submission.id === selectedSubmission.id ?
                        { ...item, submission: { ...item.submission, score: gradeData.score, feedback: gradeData.feedback } }
                        : item
                ));
            } else {
                alert("Failed to grade submission");
            }
        } catch (error) {
            console.error("Grading error:", error);
        }
    };

    const handleMarkWinner = async (submissionId) => {
        if (!window.confirm("Mark this submission as the 🏆 Winner? This will remove the winner badge from any other submission.")) return;
        const response = await markAsWinner(submissionId);
        if (response.success) {
            // Update local state: clear all winners, set this one
            setSelectedHackathonSubmissions(prev => prev.map(item => ({
                ...item,
                submission: {
                    ...item.submission,
                    winner: item.submission.id === submissionId
                }
            })));
            alert("🏆 Winner marked successfully!");
        } else {
            alert("Failed to mark winner.");
        }
    };

    const handleExportParticipants = (hackathon) => {
        if (!hackathon.registeredUserIds || hackathon.registeredUserIds.length === 0) {
            alert("No participants to export.");
            return;
        }

        // In a real app, we'd fetch full user details by these IDs. 
        // For now, we'll export IDs or just a count + ID list.
        // Assuming we might have a service to get user details later.

        const data = hackathon.registeredUserIds.map(uid => ({
            Hackathon: hackathon.title,
            UserID: uid,
            Date: new Date().toLocaleDateString()
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Participants");
        XLSX.writeFile(wb, `${hackathon.title}_Participants.xlsx`);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this hackathon?")) return;
        try {
            const response = await deleteHackathon(id);
            if (response.success) {
                setHackathons(hackathons.filter(h => h.id !== id));
                alert("Hackathon deleted successfully!");
            } else {
                alert("Failed to delete hackathon.");
            }
        } catch (error) {
            console.error("Error deleting hackathon:", error);
            alert("Failed to delete hackathon.");
        }
    };

    return (
        <div className="p-6 md:p-12 max-w-7xl mx-auto">
            <header className="mb-12">
                <h1 className="text-3xl font-bold text-slate-900 font-display">Hackathons</h1>
                <p className="text-slate-500">Manage coding challenges and events</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add/Edit Hackathon Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                {editingId ? <Pencil size={20} className="text-blue-600" /> : <Plus size={20} className="text-blue-600" />}
                                {editingId ? 'Edit Hackathon' : 'Add New Hackathon'}
                            </h2>
                            {editingId && (
                                <button onClick={handleCancelEdit} className="text-slate-400 hover:text-slate-600">
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
                                <input
                                    type="text" name="title" required
                                    value={formData.title} onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="e.g. Code The Future 2024"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                                <textarea
                                    name="description" required rows="3"
                                    value={formData.description} onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Event details..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
                                    <input
                                        type="text" name="date" required
                                        value={formData.date} onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="e.g. March 15-16, 2024"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Time</label>
                                    <input
                                        type="text" name="time" required
                                        value={formData.time} onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="e.g. 24 Hours"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Prize Pool</label>
                                <div className="relative">
                                    <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text" name="prizePool" required
                                        value={formData.prizePool} onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="e.g. ₹ 50,000"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Entry Fee</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                    <input
                                        type="text" name="entryFee" required
                                        value={formData.entryFee} onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                                        placeholder="e.g. 500 or Free"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Mode</label>
                                    <select
                                        name="mode"
                                        value={formData.mode} onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                                    >
                                        <option value="Online">Online</option>
                                        <option value="Offline">Offline</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status} onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                                    >
                                        <option value="Upcoming">Upcoming</option>
                                        <option value="Ongoing">Ongoing</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" className={`w-full text-white font-bold py-3 rounded-xl transition-colors shadow-md ${editingId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                {editingId ? 'Update Hackathon' : 'Create Hackathon'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Hackathon List */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-slate-900">Upcoming Hackathons</h2>
                    {loading ? (
                        <div className="flex justify-center p-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-200 border-t-slate-600"></div>
                        </div>
                    ) : hackathons.length === 0 ? (
                        <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center text-slate-500">
                            No updated hackathons found.
                        </div>
                    ) : (
                        hackathons.map((hackathon) => (
                            <motion.div
                                key={hackathon.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`bg-white rounded-2xl border shadow-sm p-4 flex gap-6 items-center transition-all ${editingId === hackathon.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'}`}
                            >
                                <div className="hidden sm:flex w-16 h-16 bg-blue-50 rounded-xl items-center justify-center text-blue-600">
                                    <Trophy size={32} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="text-lg font-bold text-slate-900">{hackathon.title}</h3>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${hackathon.status === 'Upcoming' ? 'bg-emerald-100 text-emerald-700' :
                                            hackathon.status === 'Ongoing' ? 'bg-amber-100 text-amber-700' :
                                                'bg-slate-100 text-slate-700'
                                            }`}>
                                            {hackathon.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-2 line-clamp-2">{hackathon.description}</p>
                                    <div className="flex gap-4 text-xs font-bold text-slate-500 uppercase tracking-wide flex-wrap">
                                        <span className="flex items-center gap-1"><Calendar size={14} /> {hackathon.date}</span>
                                        <span className="flex items-center gap-1"><Clock size={14} /> {hackathon.time}</span>
                                        <span className="flex items-center gap-1"><MapPin size={14} /> {hackathon.mode}</span>
                                        <span className="flex items-center gap-1 text-emerald-600">₹ {hackathon.entryFee || "Free"}</span>
                                        <span className="flex items-center gap-1 text-blue-600"><Users size={14} /> {hackathon.participantCount || 0} Registered</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleEdit(hackathon)}
                                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit Hackathon"
                                    >
                                        <Pencil size={20} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleViewSubmissions(hackathon.id)}
                                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="View Submissions"
                                    >
                                        <Code size={20} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleExportParticipants(hackathon)}
                                        className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                                        title="Export Participants"
                                    >
                                        <Download size={20} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(hackathon.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Hackathon"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Submissions Modal */}
            {showSubmissionsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden"
                    >
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800">Project Submissions</h2>
                            <button onClick={() => setShowSubmissionsModal(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            {loadingSubmissions ? (
                                <div className="flex justify-center py-10">
                                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            ) : selectedHackathonSubmissions.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">
                                    <Code size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>No projects submitted yet.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {[...selectedHackathonSubmissions]
                                        .sort((a, b) => (b.submission.score ?? -1) - (a.submission.score ?? -1))
                                        .map((item, index) => (
                                            <div
                                                key={index}
                                                className={`border rounded-xl p-5 transition-colors relative ${item.submission.winner
                                                        ? 'border-amber-400 bg-amber-50 shadow-md shadow-amber-100'
                                                        : 'border-gray-200 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {/* Winner badge */}
                                                {item.submission.winner && (
                                                    <div className="absolute top-3 right-3 bg-amber-400 text-white text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1 shadow">
                                                        🏆 WINNER
                                                    </div>
                                                )}

                                                <div className="flex justify-between items-start mb-3 pr-24">
                                                    <div>
                                                        <h3 className="font-bold text-lg text-gray-900">
                                                            {item.submission.projectTitle || "Coding Challenge Entry"}
                                                        </h3>
                                                        <p className="text-sm text-gray-600">by <span className="font-semibold">{item.username}</span> ({item.email})</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded block mb-1">
                                                            {new Date(item.submission.submittedAt).toLocaleDateString()}
                                                        </span>
                                                        {item.submission.status && (
                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${item.submission.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                                                                    item.submission.status === 'WRONG_ANSWER' ? 'bg-red-100 text-red-700' :
                                                                        'bg-slate-100 text-slate-700'
                                                                }`}>
                                                                {item.submission.status}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {item.submission.description ? (
                                                    <p className="text-gray-700 mb-4 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                        {item.submission.description}
                                                    </p>
                                                ) : (
                                                    <div className="mb-4 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg flex items-center gap-4">
                                                        <span>Language: <strong>{item.submission.language || 'N/A'}</strong></span>
                                                        <span>Passed Cases: <strong>{item.submission.passedTestCases}/{item.submission.totalTestCases}</strong></span>
                                                    </div>
                                                )}

                                                {/* Score + Feedback display */}
                                                {item.submission.score !== null && item.submission.score !== undefined && (
                                                    <div className="mb-3 flex items-center gap-3">
                                                        <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-lg text-sm font-bold">
                                                            Score: {item.submission.score}
                                                        </span>
                                                        {item.submission.feedback && (
                                                            <span className="text-sm text-gray-500 italic">"{item.submission.feedback}"</span>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="flex gap-3 flex-wrap">
                                                    {item.submission.repoLink && (
                                                        <a
                                                            href={item.submission.repoLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-white border px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                                                        >
                                                            <Code size={16} /> GitHub Repo
                                                        </a>
                                                    )}
                                                    {item.submission.videoLink && (
                                                        <a
                                                            href={item.submission.videoLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                                        >
                                                            <ExternalLink size={16} /> View Demo
                                                        </a>
                                                    )}
                                                    <button
                                                        onClick={() => openGradeModal(item.submission)}
                                                        className="flex items-center gap-2 text-sm font-medium text-amber-600 bg-amber-50 border border-amber-200 px-4 py-2 rounded-lg hover:bg-amber-100 transition-colors"
                                                    >
                                                        <Star size={16} /> {item.submission.score != null ? `Score: ${item.submission.score}` : 'Grade Project'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleMarkWinner(item.submission.id)}
                                                        className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${item.submission.winner
                                                                ? 'bg-amber-400 text-white border-amber-400'
                                                                : 'text-amber-700 bg-white border-amber-300 hover:bg-amber-50'
                                                            }`}
                                                    >
                                                        🏆 {item.submission.winner ? 'Winner!' : 'Mark as Winner'}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Grade Modal */}
            {showGradeModal && selectedSubmission && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
                    >
                        <div className="flex justify-between items-center mb-5">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Star size={20} className="text-amber-500" /> Grade Submission
                            </h2>
                            <button onClick={() => setShowGradeModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={22} />
                            </button>
                        </div>

                        <div className="mb-4 bg-slate-50 rounded-xl p-3 border border-slate-100">
                            <p className="font-semibold text-slate-800">{selectedSubmission.projectTitle || 'Coding Submission'}</p>
                        </div>

                        <form onSubmit={handleGradeSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Score (0–100)</label>
                                <input
                                    type="number" min="0" max="100" required
                                    value={gradeData.score}
                                    onChange={e => setGradeData({ ...gradeData, score: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors text-lg font-bold"
                                    placeholder="e.g. 85"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Feedback (optional)</label>
                                <textarea
                                    rows="3"
                                    value={gradeData.feedback}
                                    onChange={e => setGradeData({ ...gradeData, feedback: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Great work on the UI! Could improve error handling..."
                                />
                            </div>
                            <div className="flex gap-3 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setShowGradeModal(false)}
                                    className="flex-1 border border-slate-200 text-slate-600 py-2 rounded-xl font-medium hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-xl font-bold transition-colors"
                                >
                                    Save Grade
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default AdminHackathons;
