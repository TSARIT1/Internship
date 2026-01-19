import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseContent } from '../services/studentApi';
import { PlayCircle, CheckCircle, ArrowLeft, Menu, X } from 'lucide-react';

const StudentCourseView = () => {
    const { courseName } = useParams();
    const [courseContent, setCourseContent] = useState([]);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            try {
                // Decode course name if necessary, though react-router usually handles it
                const decodedName = decodeURIComponent(courseName);
                const response = await getCourseContent(decodedName);
                if (response.success) {
                    setCourseContent(response.data);
                    // Set first video as default
                    if (response.data.length > 0 && response.data[0].videos.length > 0) {
                        setCurrentVideo(response.data[0].videos[0]);
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
                        {courseContent.map((section, index) => (
                            <div key={section.id}>
                                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                    Section {index + 1}: {section.title}
                                </h3>
                                <div className="space-y-1">
                                    {section.videos.map((video) => (
                                        <button
                                            key={video.id}
                                            onClick={() => setCurrentVideo(video)}
                                            className={`w-full flex items-center gap-3 p-2 rounded-lg text-sm transition-colors text-left
                                                ${currentVideo?.id === video.id
                                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                                    : 'text-slate-600 hover:bg-slate-50'
                                                }
                                            `}
                                        >
                                            <PlayCircle size={16} className={currentVideo?.id === video.id ? 'text-blue-600' : 'text-slate-400'} />
                                            <span className="flex-1 truncate">{video.title}</span>
                                            <span className="text-xs text-slate-400">{video.duration}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 border-t border-slate-100">
                        <Link to="/studentdashboard/registrations" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
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
                            {currentVideo?.title || "Select a video"}
                        </h1>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-xl mb-6">
                            {currentVideo ? (
                                <iframe
                                    src={currentVideo.url}
                                    title={currentVideo.title}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/50">
                                    <div className="text-center">
                                        <PlayCircle size={48} className="mx-auto mb-2 opacity-50" />
                                        <p>Select a lesson to start learning</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {currentVideo && (
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">{currentVideo.title}</h2>
                                <p className="text-slate-500">
                                    Duration: {currentVideo.duration} • Section: {courseContent.find(s => s.videos.some(v => v.id === currentVideo.id))?.title}
                                </p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StudentCourseView;
