import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Trophy, MapPin, Users, Target, CheckCircle, AlertCircle, Share2, ArrowLeft, Code, X } from 'lucide-react';
import ShinyButton from '../components/ui/ShinyButton';
import { getHackathons, registerForHackathon, getMyHackathonRegistrations, submitProject, getMySubmission, getSubmissions } from '../services/hackathonApi';
import { getProblems } from '../services/problemApi';
import confetti from 'canvas-confetti';
import useAntiCheat from '../hooks/useAntiCheat';
import AntiCheatWarning from '../components/AntiCheatWarning';

const HackathonDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hackathon, setHackathon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [timeLeft, setTimeLeft] = useState("");
    const [status, setStatus] = useState("");
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [submission, setSubmission] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        projectTitle: '',
        repoLink: '',
        videoLink: '',
        description: ''
    });

    // Anti-cheat: active for any logged-in student on this page
    const studentData = JSON.parse(sessionStorage.getItem('student') || 'null');
    const antiCheatEnabled = !!studentData;
    const { tabSwitchCount, warningVisible, dismissWarning } = useAntiCheat(
        antiCheatEnabled,
        studentData?.id,
        id   // hackathon id from useParams
    );

    useEffect(() => {
        loadHackathon();
    }, [id]);

    useEffect(() => {
        if (hackathon) {
            checkRegistration();
            const timer = setInterval(() => calculateTimeLeft(), 1000);
            return () => clearInterval(timer);
        }
    }, [hackathon]);

    const [problems, setProblems] = useState([]);

    // Import getProblems at the top (I'll add import line separately)

    const loadHackathon = async () => {
        try {
            const response = await getHackathons();
            if (response.success) {
                // Find hackathon by ID (comparing as strings/numbers safely)
                const found = response.data.find(h => h.id == id);
                if (found) {
                    setHackathon(found);
                    calculateStatus(found);

                    // Fetch problems for this hackathon
                    try {
                        const probRes = await getProblems(id);
                        if (probRes.success) {
                            setProblems(probRes.data || []);
                        }
                    } catch (err) {
                        console.error("Failed to load problems", err);
                    }
                } else {
                    alert("Hackathon not found");
                    navigate('/');
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const checkRegistration = async () => {
        const student = JSON.parse(sessionStorage.getItem('student'));
        if (!student) return;

        try {
            const response = await getMyHackathonRegistrations(student.id);
            if (response.success) {
                const registered = response.data.some(h => h.id == id);
                setIsRegistered(registered);
                if (registered) fetchSubmission(student.id);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const [leaderboard, setLeaderboard] = useState([]);

    const fetchSubmission = async (userId) => {
        const response = await getMySubmission(id, userId);
        if (response.success && response.data) {
            setSubmission(response.data);
            setFormData({
                projectTitle: response.data.projectTitle,
                repoLink: response.data.repoLink,
                videoLink: response.data.videoLink || '',
                description: response.data.description
            });
        }
    };

    useEffect(() => {
        if (status === 'Completed') {
            fetchLeaderboard();
        }
    }, [status, id]);

    const fetchLeaderboard = async () => {
        const response = await getSubmissions(id);
        if (response.success && response.data) {
            // Sort by score descending
            const sorted = response.data
                .filter(item => item.submission.score != null)
                .sort((a, b) => b.submission.score - a.submission.score);
            setLeaderboard(sorted);
        }
    };

    const handleSubmitProject = async (e) => {
        e.preventDefault();
        const student = JSON.parse(sessionStorage.getItem('student'));
        if (!student) return;

        setSubmitting(true);
        const payload = {
            hackathonId: id,
            userId: student.id,
            ...formData
        };

        const result = await submitProject(payload);
        if (result.success) {
            alert(submission ? "Project updated successfully!" : "Project submitted successfully!");
            setSubmission(result.data);
            setShowSubmissionModal(false);
        } else {
            alert("Failed to submit project: " + result.message);
        }
        setSubmitting(false);
    };

    const calculateStatus = (data) => {
        const eventDate = new Date(`${data.date} ${data.time}`);
        const now = new Date();

        if (now > eventDate) {
            setStatus("Completed");
        } else if (now.toDateString() === eventDate.toDateString()) {
            setStatus("Live");
        } else {
            setStatus("Upcoming");
        }
    };

    const calculateTimeLeft = () => {
        if (!hackathon) return;

        // Assuming date format "YYYY-MM-DD" and time "HH:mm"
        // Adjust parsing if needed based on backend format
        const eventDate = new Date(`${hackathon.date} ${hackathon.time}`);
        const now = new Date();
        const difference = eventDate - now;

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        } else {
            setTimeLeft("Event Started");
        }
    };

    const handleRegister = async () => {
        const token = sessionStorage.getItem('token');
        const student = JSON.parse(sessionStorage.getItem('student'));

        if (!token || !student) {
            // Redirect to login with return url
            navigate('/login');
            return;
        }

        if (isRegistered) return;

        setRegistering(true);
        try {
            const response = await registerForHackathon(hackathon.id, student.id);
            if (response.success) {
                setIsRegistered(true);
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
                // Update local participant count visually
                setHackathon(prev => ({
                    ...prev,
                    participantCount: (prev.participantCount || 0) + 1
                }));
            } else {
                alert(response.message || "Registration failed");
            }
        } catch (error) {
            alert("An error occurred");
        } finally {
            setRegistering(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
    );

    return (
        <div className={`min-h-screen bg-slate-900 text-white pb-20 pt-24 ${antiCheatEnabled ? 'anti-cheat-zone' : ''}`}>
            {/* Anti-cheat warning overlay */}
            <AntiCheatWarning
                visible={warningVisible}
                switchCount={tabSwitchCount}
                onDismiss={dismissWarning}
            />
            {/* Header / Hero */}
            <div className="container mx-auto px-6 mb-12">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
                    <ArrowLeft size={20} /> Back
                </button>

                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/50 to-slate-900 border border-white/10 p-8 md:p-12">
                    <div className="absolute top-0 right-0 p-4">
                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${status === 'Live' ? 'bg-green-500/20 text-green-400 border-green-500/50 animate-pulse' :
                            status === 'Completed' ? 'bg-slate-700 text-slate-400 border-slate-600' :
                                'bg-blue-500/20 text-blue-400 border-blue-500/50'
                            }`}>
                            {status === 'Live' ? '● LIVE NOW' : status}
                        </span>
                    </div>

                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-6xl font-bold font-display mb-6 leading-tight">{hackathon.title}</h1>
                        <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                            {hackathon.description}
                        </p>

                        <div className="flex flex-wrap gap-6 mb-8">
                            <div className="flex items-center gap-2 text-slate-300">
                                <Calendar className="text-purple-400" size={20} />
                                <span>{hackathon.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-300">
                                <Clock className="text-blue-400" size={20} />
                                <span>{hackathon.time}</span>
                            </div>
                            <div className="flex gap-4 mb-8 text-sm font-medium text-slate-500 uppercase tracking-widest">
                                <span className="flex items-center gap-2"><Calendar size={18} /> {hackathon.date}</span>
                                <span className="flex items-center gap-2"><Clock size={18} /> {hackathon.time}</span>
                                <span className="flex items-center gap-2"><MapPin size={18} /> {hackathon.mode}</span>
                                <span className="flex items-center gap-2 text-emerald-600 font-bold">₹ {hackathon.entryFee || "Free"} Entry</span>
                            </div>    <Users className="text-amber-400" size={20} />
                            <span>{hackathon.participantCount || 0} Registered</span>
                        </div>
                    </div>

                    {status === 'Upcoming' && (
                        <div className="bg-slate-950/50 inline-flex flex-col sm:flex-row items-center gap-4 px-6 py-4 rounded-xl border border-white/5 mb-8">
                            <span className="text-slate-400 font-medium">Registration closes in:</span>
                            <span className="font-mono text-xl md:text-2xl text-white font-bold tracking-wider">
                                {timeLeft}
                            </span>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-4">
                        {isRegistered ? (
                            <div className="flex flex-wrap gap-3">
                                <button disabled className="bg-green-600/20 text-green-400 border border-green-500/50 px-6 py-3 rounded-xl font-bold flex items-center gap-2 cursor-default">
                                    <CheckCircle size={20} />
                                    Registered
                                </button>

                                {problems.length > 0 && (
                                    <ShinyButton
                                        onClick={() => navigate(`/student/problem/${problems[0].id}`)}
                                        className="!bg-emerald-600 !from-emerald-500 !to-emerald-700"
                                        icon={Code}
                                    >
                                        Start Challenge
                                    </ShinyButton>
                                )}

                                <ShinyButton
                                    onClick={() => setShowSubmissionModal(true)}
                                    className="!bg-blue-600 !from-blue-500 !to-blue-700"
                                    icon={Code}
                                >
                                    {submission ? "Edit Project" : "Submit Project"}
                                </ShinyButton>
                            </div>
                        ) : (
                            <ShinyButton
                                onClick={handleRegister}
                                disabled={status === 'Completed' || registering}
                                className="!bg-purple-600 !px-10 !py-4 !text-lg"
                            >
                                {registering ? "Registering..." : "Register Now"}
                            </ShinyButton>
                        )}
                        <button className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2 font-medium">
                            <Share2 size={20} /> Share
                        </button>
                    </div>
                </div>
            </div>


            {/* Submission Modal */}
            {
                showSubmissionModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg relative"
                        >
                            <button
                                onClick={() => setShowSubmissionModal(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>

                            <h2 className="text-2xl font-bold mb-6">Project Submission</h2>

                            <form onSubmit={handleSubmitProject} className="space-y-4">
                                <div>
                                    <label className="block text-slate-400 mb-1 text-sm">Project Title</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.projectTitle}
                                        onChange={e => setFormData({ ...formData, projectTitle: e.target.value })}
                                        placeholder="e.g. AI Content Generator"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 mb-1 text-sm">GitHub Repository Link</label>
                                    <input
                                        required
                                        type="url"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.repoLink}
                                        onChange={e => setFormData({ ...formData, repoLink: e.target.value })}
                                        placeholder="https://github.com/username/repo"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 mb-1 text-sm">Demo Video Link (YouTube/Loom)</label>
                                    <input
                                        type="url"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.videoLink}
                                        onChange={e => setFormData({ ...formData, videoLink: e.target.value })}
                                        placeholder="https://youtu.be/..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 mb-1 text-sm">Description</label>
                                    <textarea
                                        required
                                        rows="4"
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Briefly describe your project..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all mt-4 disabled:opacity-50"
                                >
                                    {submitting ? "Submitting..." : (submission ? "Update Submission" : "Submit Project")}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )
            }

            {/* Details Grid */}
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Leaderboard Section - Only visible when Completed */}
                        {status === 'Completed' && leaderboard.length > 0 && (
                            <section className="bg-gradient-to-br from-amber-500/10 to-purple-500/10 rounded-2xl p-8 border border-amber-500/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3 opacity-10">
                                    <Trophy size={120} />
                                </div>
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 relative z-10">
                                    <Trophy className="text-amber-400" />
                                    Leaderboard
                                </h3>

                                <div className="space-y-4 relative z-10">
                                    {leaderboard.map((item, index) => (
                                        <div key={index} className={`flex items-center p-4 rounded-xl border ${index === 0 ? 'bg-amber-500/20 border-amber-500/50' :
                                            index === 1 ? 'bg-slate-700/50 border-slate-500/50' :
                                                index === 2 ? 'bg-orange-700/20 border-orange-500/50' :
                                                    'bg-slate-800/50 border-white/5'
                                            }`}>
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl mr-4 ${index === 0 ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/50' :
                                                index === 1 ? 'bg-slate-400 text-slate-900' :
                                                    index === 2 ? 'bg-orange-600 text-white' :
                                                        'bg-slate-700 text-slate-400'
                                                }`}>
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-lg">{item.submission.projectTitle}</h4>
                                                <p className="text-sm text-slate-400">by {item.username}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-white">{item.submission.score}</div>
                                                <div className="text-xs text-slate-400 uppercase tracking-wider">Score</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        <section className="bg-slate-800/30 rounded-2xl p-8 border border-white/5">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Code className="text-blue-400" />
                                Coding Challenges
                            </h3>
                            {problems.length > 0 ? (
                                <div className="space-y-4">
                                    {problems.map(prob => (
                                        <div key={prob.id} className="bg-slate-800/50 p-4 rounded-xl border border-white/5 flex justify-between items-center transition hover:border-blue-500/30">
                                            <div>
                                                <h4 className="font-bold text-lg text-white mb-1">{prob.title}</h4>
                                                <div className="flex gap-3 text-sm text-slate-400">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${prob.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                                        prob.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                                                            'bg-red-500/20 text-red-400'
                                                        }`}>{prob.difficulty}</span>
                                                    <span>{prob.timeLimit}s</span>
                                                    <span>{prob.memoryLimit}MB</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => navigate(`/student/problem/${prob.id}`)}
                                                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-sm transition"
                                            >
                                                Solve
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-400 italic">No coding problems released yet.</p>
                            )}
                        </section>

                        <section className="bg-slate-800/30 rounded-2xl p-8 border border-white/5">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Target className="text-purple-400" />
                                About the Challenge
                            </h3>
                            <div className="prose prose-invert max-w-none text-slate-300">
                                <p>
                                    Join us for an exciting journey of innovation and coding! This hackathon is designed to test your skills in real-world problem solving.
                                    Collaborate with like-minded developers, build amazing projects, and win exclusive rewards.
                                </p>
                                <ul className="mt-4 space-y-2 list-disc pl-5">
                                    <li>Work on cutting-edge technologies.</li>
                                    <li>Mentorship from industry experts.</li>
                                    <li>Networking opportunities with top companies.</li>
                                </ul>
                            </div>
                        </section>

                        <section className="bg-slate-800/30 rounded-2xl p-8 border border-white/5">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Trophy className="text-amber-400" />
                                Prizes & Rewards
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-xl text-center">
                                    <div className="text-3xl font-bold text-amber-400 mb-2">1st</div>
                                    <div className="font-semibold text-white">₹25,000</div>
                                    <div className="text-sm text-slate-400">Cash + Swag</div>
                                </div>
                                <div className="bg-slate-700/30 border border-slate-600/30 p-6 rounded-xl text-center">
                                    <div className="text-3xl font-bold text-slate-300 mb-2">2nd</div>
                                    <div className="font-semibold text-white">₹15,000</div>
                                    <div className="text-sm text-slate-400">Cash + Swag</div>
                                </div>
                                <div className="bg-slate-700/30 border border-slate-600/30 p-6 rounded-xl text-center">
                                    <div className="text-3xl font-bold text-slate-300 mb-2">3rd</div>
                                    <div className="font-semibold text-white">₹5,000</div>
                                    <div className="text-sm text-slate-400">Cash + Swag</div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/5">
                            <h4 className="font-bold text-lg mb-4">Event Details</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-slate-400">Entry Fee</span>
                                    <span className="font-bold text-green-400">Free</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-slate-400">Team Size</span>
                                    <span className="font-bold">1 - 4 Members</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-slate-400">Eligibility</span>
                                    <span className="font-bold">Open to All</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-slate-400">Platform</span>
                                    <span className="font-bold">Discord / Zoom</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-900/20 rounded-2xl p-6 border border-blue-500/20">
                            <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                                <AlertCircle size={18} className="text-blue-400" />
                                Need Help?
                            </h4>
                            <p className="text-sm text-slate-400 mb-4">
                                Join our community discord for updates and queries regarding the hackathon.
                            </p>
                            <button className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors">
                                Join Discord
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default HackathonDetails;
