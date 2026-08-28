import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Trophy, MapPin, Users, Target, CheckCircle, AlertCircle, Share2, ArrowLeft, Code, X, Sparkles } from 'lucide-react';
import ShinyButton from '../components/ui/ShinyButton';
import { getHackathons, registerForHackathon, submitProject, getMySubmission, getSubmissions } from '../services/hackathonApi';
import { getProblems } from '../services/problemApi';
import confetti from 'canvas-confetti';
import useAntiCheat from '../hooks/useAntiCheat';
import AntiCheatWarning from '../components/AntiCheatWarning';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import AIChatWidget from '../components/AIChatWidget';

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
    const [problems, setProblems] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [formData, setFormData] = useState({
        projectTitle: '',
        repoLink: '',
        videoLink: '',
        description: ''
    });

    const studentData = JSON.parse(sessionStorage.getItem('student') || 'null');
    const antiCheatEnabled = !!studentData;
    const { tabSwitchCount, warningVisible, dismissWarning } = useAntiCheat(
        antiCheatEnabled,
        studentData?.id,
        id
    );

    const calculateStatus = (data) => {
        if (!data || !data.date) return;
        const now = new Date();
        const hackathonDate = new Date(data.date);
        if (now < hackathonDate) {
            setStatus('Upcoming');
        } else if (now > new Date(hackathonDate.getTime() + 24 * 60 * 60 * 1000)) {
            setStatus('Completed');
        } else {
            setStatus('Live');
        }
    };

    const calculateTimeLeft = () => {
        if (!hackathon || !hackathon.date) return;
        const now = new Date();
        const target = new Date(hackathon.date);
        const diff = target - now;
        if (diff <= 0) {
            setTimeLeft("00:00:00");
            return;
        }
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    const loadHackathon = async () => {
        try {
            const response = await getHackathons();
            if (response.success) {
                const found = response.data.find(h => String(h.id) === String(id));
                if (found) {
                    setHackathon(found);
                    calculateStatus(found);

                    try {
                        const probRes = await getProblems(id);
                        if (probRes.success) {
                            setProblems(probRes.data || []);
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
        } catch (error) {
            console.error("Error loading hackathon:", error);
        } finally {
            setLoading(false);
        }
    };

    const checkRegistration = async () => {
        if (!studentData) return;
        try {
            const subRes = await getMySubmission(id, studentData.id);
            if (subRes.success && subRes.data) {
                setSubmission(subRes.data);
                setIsRegistered(true);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchLeaderboard = async () => {
        try {
            const res = await getSubmissions(id);
            if (res.success && res.data) {
                const sorted = res.data.sort((a, b) => (b.score || 0) - (a.score || 0));
                setLeaderboard(sorted);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        loadHackathon();
    }, [id]);

    useEffect(() => {
        if (hackathon) {
            checkRegistration();
            if (status === 'Completed') {
                fetchLeaderboard();
            }
            const timer = setInterval(() => calculateTimeLeft(), 1000);
            return () => clearInterval(timer);
        }
    }, [hackathon, status]);

    const handleRegister = async () => {
        const student = JSON.parse(sessionStorage.getItem('student') || 'null');
        if (!student) {
            alert("Please login as a student to register for this hackathon.");
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
                setHackathon(prev => ({
                    ...prev,
                    participantCount: (prev.participantCount || 0) + 1
                }));
                alert("Successfully registered for the hackathon! 🎉");
            } else {
                alert(response.message || "Registration failed");
            }
        } catch (error) {
            alert("An error occurred during registration");
        } finally {
            setRegistering(false);
        }
    };

    const handleSubmitProject = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await submitProject({
                hackathonId: id,
                studentId: studentData.id,
                ...formData
            });
            if (response.success) {
                alert("Project submitted successfully! 🚀");
                setSubmission(response.data);
                setShowSubmissionModal(false);
            } else {
                alert(response.message || "Submission failed");
            }
        } catch (error) {
            alert("An error occurred during submission");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-200 border-t-teal-600"></div>
        </div>
    );

    if (!hackathon) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            <Header />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Hackathon Not Found</h2>
            <button onClick={() => navigate('/hackathons')} className="text-blue-600 font-bold underline">Back to Hackathons</button>
            <Footer />
        </div>
    );

    return (
        <div className={`min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-100 ${antiCheatEnabled ? 'anti-cheat-zone' : ''}`}>
            <Header />

            {/* Anti-cheat warning overlay */}
            <AntiCheatWarning
                visible={warningVisible}
                switchCount={tabSwitchCount}
                onDismiss={dismissWarning}
            />

            {/* Bright, Modern Hero Header */}
            <div className="pt-32 pb-12 bg-gradient-to-b from-white via-teal-50/30 to-slate-50 border-b border-slate-200">
                <div className="container mx-auto px-6">
                    <button
                        onClick={() => navigate('/hackathons')}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                        <ArrowLeft size={16} /> Back to Hackathons
                    </button>

                    <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-10 shadow-sm relative overflow-hidden">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <span className={`px-3.5 py-1 rounded-full text-xs font-bold border ${
                                status === 'Live' ? 'bg-emerald-50 text-emerald-700 border-emerald-300 animate-pulse' :
                                status === 'Completed' ? 'bg-slate-100 text-slate-600 border-slate-300' :
                                'bg-blue-50 text-blue-700 border-blue-200'
                            }`}>
                                {status === 'Live' ? '● LIVE NOW' : status || 'Upcoming'}
                            </span>
                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                Mode: {hackathon.mode || "Online"}
                            </span>
                        </div>

                        <div className="max-w-3xl">
                            <h1 className="text-3xl md:text-5xl font-black font-display text-slate-900 mb-4 tracking-tight leading-tight">
                                {hackathon.title}
                            </h1>
                            <p className="text-slate-600 text-base leading-relaxed mb-6">
                                {hackathon.description}
                            </p>

                            <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-600 mb-8">
                                <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                                    <Calendar size={15} className="text-teal-600" /> {hackathon.date}
                                </span>
                                <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                                    <Clock size={15} className="text-blue-600" /> {hackathon.time}
                                </span>
                                <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                                    <Users size={15} className="text-purple-600" /> {hackathon.participantCount || 0} Registered
                                </span>
                                <span className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-xl">
                                    Entry Fee: {hackathon.entryFee ? `₹${hackathon.entryFee}` : 'FREE'}
                                </span>
                            </div>

                            {status === 'Upcoming' && timeLeft && (
                                <div className="bg-slate-50 inline-flex flex-col sm:flex-row items-center gap-3 px-5 py-3 rounded-2xl border border-slate-200 mb-6">
                                    <span className="text-slate-500 text-xs font-semibold">Registration closes in:</span>
                                    <span className="font-mono text-lg text-slate-900 font-black tracking-wider">
                                        {timeLeft}
                                    </span>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap gap-3">
                                {isRegistered ? (
                                    <>
                                        <button disabled className="bg-emerald-50 text-emerald-700 border border-emerald-300 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 cursor-default">
                                            <CheckCircle size={18} /> Registered
                                        </button>
                                        {problems.length > 0 && (
                                            <button
                                                onClick={() => navigate(`/student/problem/${problems[0].id}`)}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
                                            >
                                                <Code size={16} /> Start Challenge
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setShowSubmissionModal(true)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-md shadow-blue-600/20 cursor-pointer"
                                        >
                                            <Code size={16} /> {submission ? "Edit Project" : "Submit Project"}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleRegister}
                                        disabled={status === 'Completed' || registering}
                                        className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3.5 rounded-xl font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-teal-600/25 transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-60"
                                    >
                                        {registering ? "Registering..." : "Register Now"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Info & Challenges */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Coding Challenges Section */}
                        {problems.length > 0 && (
                            <section className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm">
                                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Code className="text-blue-600" />
                                    <span>Coding Challenges ({problems.length})</span>
                                </h3>
                                <div className="space-y-3">
                                    {problems.map(prob => (
                                        <div key={prob.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex justify-between items-center hover:border-blue-300 transition-colors">
                                            <div>
                                                <h4 className="font-bold text-sm text-slate-900">{prob.title}</h4>
                                                <div className="flex gap-2 text-xs text-slate-500 mt-1">
                                                    <span className={`font-bold ${prob.difficulty === 'Easy' ? 'text-green-600' : prob.difficulty === 'Medium' ? 'text-amber-600' : 'text-red-600'}`}>{prob.difficulty}</span>
                                                    <span>• {prob.timeLimit || 2}s limit</span>
                                                    <span>• {prob.memoryLimit || 256}MB</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => navigate(`/student/problem/${prob.id}`)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                                            >
                                                Solve Problem
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Prizes & Rewards */}
                        <section className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm">
                            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 font-display">
                                <Trophy className="text-amber-500" />
                                <span>Prizes & Awards</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl text-center">
                                    <div className="text-2xl font-black text-amber-600 mb-1">🥇 1st Prize</div>
                                    <div className="font-bold text-slate-900 text-lg">₹25,000</div>
                                    <div className="text-xs text-slate-500 mt-1">Cash + Certificate + Job Interview</div>
                                </div>
                                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-center">
                                    <div className="text-2xl font-black text-slate-600 mb-1">🥈 2nd Prize</div>
                                    <div className="font-bold text-slate-900 text-lg">₹15,000</div>
                                    <div className="text-xs text-slate-500 mt-1">Cash + Verified Certificate</div>
                                </div>
                                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-center">
                                    <div className="text-2xl font-black text-orange-600 mb-1">🥉 3rd Prize</div>
                                    <div className="font-bold text-slate-900 text-lg">₹5,000</div>
                                    <div className="text-xs text-slate-500 mt-1">Cash + Goodies</div>
                                </div>
                            </div>
                        </section>

                        {/* About the Challenge */}
                        <section className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm">
                            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 font-display">
                                <Target className="text-teal-600" />
                                <span>Challenge Guidelines & Evaluation</span>
                            </h3>
                            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
                                <p>
                                    Join us for an exciting journey of engineering innovation! This hackathon evaluates clean architecture, algorithmic efficiency, problem-solving, and deployment readiness.
                                </p>
                                <ul className="space-y-1.5 list-disc pl-5">
                                    <li>Work individually or in teams of up to 4 members.</li>
                                    <li>Submit a working GitHub repository and video demonstration.</li>
                                    <li>Automated anti-cheat detection enabled during competitive rounds.</li>
                                </ul>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Event Details Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                            <h4 className="font-bold text-base text-slate-900 mb-4">Event Snapshot</h4>
                            <div className="space-y-3 text-xs">
                                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                    <span className="text-slate-500 font-medium">Registration Fee</span>
                                    <span className="font-bold text-emerald-700">{hackathon.entryFee ? `₹${hackathon.entryFee}` : 'Free'}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                    <span className="text-slate-500 font-medium">Team Size</span>
                                    <span className="font-bold text-slate-900">1 - 4 Members</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                    <span className="text-slate-500 font-medium">Eligibility</span>
                                    <span className="font-bold text-slate-900">Open to all Tech Students</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-slate-500 font-medium">Platform</span>
                                    <span className="font-bold text-slate-900">TSAR IT Coding Arena</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50/70 rounded-3xl p-6 border border-blue-200">
                            <h4 className="font-bold text-sm text-blue-950 mb-1 flex items-center gap-1.5">
                                <AlertCircle size={16} className="text-blue-600" />
                                <span>Need Admissions or Event Help?</span>
                            </h4>
                            <p className="text-xs text-slate-600 mb-4">
                                Contact the TSAR IT event coordination team for guidelines or submission support.
                            </p>
                            <div className="space-y-2">
                                <a
                                    href="https://wa.me/919491301258"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block w-full py-2.5 text-center bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors"
                                >
                                    WhatsApp Support (+91 9491301258)
                                </a>
                                <a
                                    href="https://wa.me/918142616767"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block w-full py-2.5 text-center bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
                                >
                                    WhatsApp Helpline (+91 8142616767)
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submission Modal */}
            {showSubmissionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white border border-slate-200 rounded-3xl p-7 w-full max-w-lg relative shadow-2xl"
                    >
                        <button
                            onClick={() => setShowSubmissionModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Project Submission</h2>

                        <form onSubmit={handleSubmitProject} className="space-y-4 text-xs sm:text-sm">
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Project Title *</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:border-blue-600 outline-none"
                                    value={formData.projectTitle}
                                    onChange={e => setFormData({ ...formData, projectTitle: e.target.value })}
                                    placeholder="e.g. AI Autonomous Drone Controller"
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">GitHub Repository Link *</label>
                                <input
                                    required
                                    type="url"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:border-blue-600 outline-none"
                                    value={formData.repoLink}
                                    onChange={e => setFormData({ ...formData, repoLink: e.target.value })}
                                    placeholder="https://github.com/username/project"
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Demo Video Link (YouTube/Loom)</label>
                                <input
                                    type="url"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:border-blue-600 outline-none"
                                    value={formData.videoLink}
                                    onChange={e => setFormData({ ...formData, videoLink: e.target.value })}
                                    placeholder="https://youtu.be/..."
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Description *</label>
                                <textarea
                                    required
                                    rows="3"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:border-blue-600 outline-none resize-none"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Briefly describe what your prototype accomplishes..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all cursor-pointer disabled:opacity-60"
                            >
                                {submitting ? "Submitting..." : (submission ? "Update Submission" : "Submit Project")}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}

            <Footer />
            <WhatsAppButton />
            <AIChatWidget />
        </div>
    );
};

export default HackathonDetails;
