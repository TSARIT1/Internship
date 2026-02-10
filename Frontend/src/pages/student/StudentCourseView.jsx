import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseContent } from '../../services/studentApi';
import { PlayCircle, CheckCircle, ArrowLeft, Menu, X, Video, FileQuestion } from 'lucide-react';
import QuizPlayer from '../../components/QuizPlayer';

const StudentCourseView = () => {
    const { courseName } = useParams();
    const [courseContent, setCourseContent] = useState({ sections: [], liveLink: '' });
    const [activeItem, setActiveItem] = useState(null); // Replaces currentVideo
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const student = JSON.parse(localStorage.getItem('student') || '{}');

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            try {
                const decodedName = decodeURIComponent(courseName);
                const response = await getCourseContent(decodedName);
                if (response.success) {
                    let data = response.data;
                    if (Array.isArray(data)) {
                        data = { liveLink: '', sections: data };
                    }
                    setCourseContent(data);

                    // Set first item as default
                    if (!activeItem && data.sections.length > 0) {
                        const firstSection = data.sections[0];
                        if (firstSection.videos.length > 0) {
                            setActiveItem({ type: 'video', ...firstSection.videos[0] });
                        } else if (firstSection.quizzes && firstSection.quizzes.length > 0) {
                            setActiveItem({ type: 'quiz', ...firstSection.quizzes[0] });
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch course content", error);
            } finally {
                setLoading(false);
            }
        };

        if (courseName) {
            fetchContent();
        }
    }, [courseName]);

    const handleMarkAsViewed = async (contentId) => {
        try {
            // 1. Get Enrollment ID (Need to fetch if not stored)
            // Ideally we should have enrollment ID from dashboard, but for now let's fetch it or assume we passed it.
            // Simplified: Fetch "my enrollments" and find this course.
            const enrollmentsRes = await getMyEnrollments(student.id);
            if (enrollmentsRes.success) {
                const enrollment = enrollmentsRes.data.find(e => e.courseName === decodeURIComponent(courseName));

                if (enrollment) {
                    // 2. Calculate new progress (Mock logic: Increment by 5%, max 100)
                    let currentProgress = enrollment.progress || 0;
                    let newProgress = Math.min(currentProgress + 5, 100);

                    // 3. Update Backend
                    await updateEnrollmentProgress(enrollment.id, newProgress);
                    alert(`Progress updated to ${newProgress}%!`);
                    // Optional: Refresh data or state
                }
            }
        } catch (error) {
            console.error("Failed to update progress", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-slate-500">Loading course content...</div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar - Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-20 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <div className={`
                fixed lg:relative z-30 w-80 h-full bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden'}
                lg:translate-x-0 ${sidebarOpen ? 'lg:w-80' : 'lg:w-0'}
            `}>
                <div className="h-full flex flex-col">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="font-bold text-slate-800 truncate" title={courseName}>
                            {decodeURIComponent(courseName)}
                        </h2>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-500">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {/* Live Class Link */}
                        {courseContent.liveLink && (
                            <div className="mb-6">
                                <a
                                    href={courseContent.liveLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full bg-red-600 text-white p-4 rounded-xl shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all hover:scale-[1.02] text-center"
                                >
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <Video size={20} className="animate-pulse" />
                                        <span className="font-bold">Join Live Class</span>
                                    </div>
                                    <div className="text-xs text-red-100">Click to open Google Meet</div>
                                </a>
                            </div>
                        )}

                        {courseContent.sections && courseContent.sections.map((section, index) => (
                            <div key={section.id}>
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                    Section {index + 1}: {section.title}
                                </h3>
                                <div className="space-y-1">
                                    {/* Videos */}
                                    {section.videos.map((video) => (
                                        <button
                                            key={`vid-${video.id}`}
                                            onClick={() => setActiveItem({ type: 'video', ...video })}
                                            className={`w-full flex items-center gap-3 p-2 rounded-lg text-sm transition-colors text-left
                                                ${activeItem?.id === video.id && activeItem?.type === 'video'
                                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                                    : 'text-slate-600 hover:bg-slate-50'
                                                }
                                            `}
                                        >
                                            <PlayCircle size={16} className={activeItem?.id === video.id && activeItem?.type === 'video' ? 'text-blue-600' : 'text-slate-400'} />
                                            <span className="flex-1 truncate">{video.title}</span>
                                            <span className="text-xs text-slate-400">{video.duration}</span>
                                        </button>
                                    ))}

                                    {/* Quizzes */}
                                    {section.quizzes && section.quizzes.map((quiz) => (
                                        <button
                                            key={`quiz-${quiz.id}`}
                                            onClick={() => setActiveItem({ type: 'quiz', ...quiz })}
                                            className={`w-full flex items-center gap-3 p-2 rounded-lg text-sm transition-colors text-left
                                                ${activeItem?.id === quiz.id && activeItem?.type === 'quiz'
                                                    ? 'bg-purple-50 text-purple-700 font-medium'
                                                    : 'text-slate-600 hover:bg-slate-50'
                                                }
                                            `}
                                        >
                                            <FileQuestion size={16} className={activeItem?.id === quiz.id && activeItem?.type === 'quiz' ? 'text-purple-600' : 'text-slate-400'} />
                                            <span className="flex-1 truncate">{quiz.title}</span>
                                            <span className="text-xs text-slate-400">Quiz</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t border-slate-100">
                        <Link to="/studentdashboard" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
                            <ArrowLeft size={16} />
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 lg:px-8 justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 -ml-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <h1 className="font-semibold text-slate-800 line-clamp-1">
                            {activeItem?.title || "Select a lesson"}
                        </h1>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-4xl mx-auto">
                        {activeItem?.type === 'quiz' ? (
                            <QuizPlayer quiz={activeItem} studentId={student.id} />
                        ) : activeItem?.type === 'video' ? (
                            <>
                                <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-xl mb-6 flex items-center justify-center">
                                    {activeItem.type === 'local' || activeItem.url.startsWith('http') ? (
                                        activeItem.type === 'local' ? (
                                            <video
                                                controls
                                                autoPlay
                                                src={activeItem.url}
                                                className="w-full h-full"
                                            >
                                                Your browser does not support the video tag.
                                            </video>
                                        ) : (
                                            <iframe
                                                src={activeItem.url}
                                                title={activeItem.title}
                                                className="w-full h-full"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        )
                                    ) : (
                                        <iframe
                                            src={activeItem.url}
                                            title={activeItem.title}
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    )}
                                </div>
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{activeItem.title}</h2>
                                    <div className="flex items-center justify-between">
                                        <p className="text-slate-500">
                                            Duration: {activeItem.duration} • Section: {courseContent.sections.find(s => s.videos.some(v => v.id === activeItem.id))?.title}
                                        </p>
                                        <button
                                            onClick={() => handleMarkAsViewed(activeItem.id)} // Function to be defined
                                            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 font-medium text-sm transition-colors"
                                        >
                                            <CheckCircle size={16} /> Mark as Viewed
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-slate-400 text-center py-20">
                                <PlayCircle size={48} className="mx-auto mb-4 opacity-50" />
                                <p>Select a video or quiz to start learning</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StudentCourseView;
