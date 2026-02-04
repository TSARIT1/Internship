import React, { useState, useEffect, useRef } from 'react';
import {
    getPricing,
    getCourseContent,
    addCourseVideo,
    deleteCourseVideo,
    updateLiveClassLink,
    deleteCourseSection,
    uploadFile
} from '../services/studentApi';
import {
    Video,
    Trash2,
    Plus,
    Link,
    Save,
    Upload,
    Youtube,
    FileVideo,
    Layout,
    X
} from 'lucide-react';

const AdminCourseContent = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [content, setContent] = useState({ liveLink: '', sections: [] });
    const [loading, setLoading] = useState(false);

    // Live Link State
    const [liveLinkInput, setLiveLinkInput] = useState('');
    const [savingLink, setSavingLink] = useState(false);

    // Add Video State
    const [showAddModal, setShowAddModal] = useState(false);
    const [newVideo, setNewVideo] = useState({
        title: '',
        section: '',
        type: 'youtube', // or 'local'
        url: '',
        duration: ''
    });
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchCourses = async () => {
            const response = await getPricing();
            if (response.data) {
                setCourses(response.data);
                if (response.data.length > 0) {
                    setSelectedCourse(response.data[0].course);
                }
            }
        };
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            fetchContent(selectedCourse);
        }
    }, [selectedCourse]);

    const fetchContent = async (courseName) => {
        setLoading(true);
        try {
            const response = await getCourseContent(courseName);
            if (response.success) {
                // Ensure data structure structure matches expectation
                let data = response.data;
                // Graceful handling if data is the old array format (though API should handle this now)
                if (Array.isArray(data)) {
                    data = { liveLink: '', sections: data };
                }
                setContent(data);
                setLiveLinkInput(data.liveLink || '');
            }
        } catch (error) {
            console.error("Failed to fetch content", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateLiveLink = async () => {
        setSavingLink(true);
        try {
            await updateLiveClassLink(selectedCourse, liveLinkInput);
            const updatedContent = { ...content, liveLink: liveLinkInput };
            setContent(updatedContent);
            alert('Live Class Link Updated!');
        } catch (error) {
            console.error(error);
            alert('Failed to update link');
        } finally {
            setSavingLink(false);
        }
    };

    const handleDeleteVideo = async (sectionId, videoId) => {
        if (!window.confirm("Are you sure you want to delete this video?")) return;

        try {
            await deleteCourseVideo(selectedCourse, sectionId, videoId);
            fetchContent(selectedCourse); // Refresh
        } catch (error) {
            console.error(error);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Real Upload
            setLoading(true); // Reusing loading state or add a specific one
            try {
                const response = await uploadFile(file);
                if (response.success) {
                    setNewVideo({ ...newVideo, url: response.data.fileUrl, type: 'local' });
                    alert("File uploaded successfully!");
                } else {
                    alert("Failed to upload file");
                }
            } catch (error) {
                console.error("Upload error", error);
                alert("Error submitting file");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleAddVideo = async (e) => {
        e.preventDefault();

        // Manual validation for local video
        if (newVideo.type === 'local' && !newVideo.url) {
            alert('Please select a video file');
            return;
        }

        try {
            await addCourseVideo(selectedCourse, newVideo.section, {
                title: newVideo.title,
                url: newVideo.url,
                duration: newVideo.duration || '00:00',
                type: newVideo.type
            });
            setShowAddModal(false);
            setNewVideo({ title: '', section: '', type: 'youtube', url: '', duration: '' });
            fetchContent(selectedCourse);
        } catch (error) {
            console.error(error);
            alert('Failed to add video');
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Course Content</h1>
                    <p className="text-slate-500 mt-1">Manage videos and live classes.</p>
                </div>

                <div className="w-full md:w-64">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Course</label>
                    <div className="relative">
                        <Layout className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
                        >
                            {courses.map(c => (
                                <option key={c.course} value={c.course}>{c.course}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </header>

            {/* Live Class Link Section */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-50 text-red-600 rounded-lg flex items-center justify-center">
                        <Video size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Live Class Link</h2>
                        <p className="text-sm text-slate-500">Google Meet URL for live sessions</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Link className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            value={liveLinkInput}
                            onChange={(e) => setLiveLinkInput(e.target.value)}
                            placeholder="https://meet.google.com/..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        onClick={handleUpdateLiveLink}
                        disabled={savingLink}
                        className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
                    >
                        <Save size={18} />
                        {savingLink ? 'Saving...' : 'Update Link'}
                    </button>
                </div>
            </div>

            {/* Video Content Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">Course Videos</h2>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm shadow-blue-200"
                    >
                        <Plus size={18} /> Add Video
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-slate-500">Loading content...</div>
                ) : (
                    <div className="space-y-6">
                        {content.sections && content.sections.length > 0 ? (
                            content.sections.map((section) => (
                                <div key={section.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                    <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
                                        <h3 className="font-bold text-slate-700">{section.title}</h3>
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{section.videos.length} Videos</span>
                                    </div>
                                    <div className="divide-y divide-slate-100">
                                        {section.videos.map((video) => (
                                            <div key={video.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${video.type === 'youtube' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                                                        {video.type === 'youtube' ? <Youtube size={20} /> : <FileVideo size={20} />}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-slate-800">{video.title}</h4>
                                                        <p className="text-xs text-slate-500 flex items-center gap-2">
                                                            {video.duration} • {video.type === 'youtube' ? 'YouTube' : 'Local Upload'}
                                                        </p>
                                                        {video.type === 'youtube' && (
                                                            <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline truncate max-w-xs block">
                                                                {video.url}
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteVideo(section.id, video.id)}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Delete Video"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ))}
                                        {section.videos.length === 0 && (
                                            <div className="p-8 text-center text-slate-400 text-sm">No videos in this section yet.</div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
                                <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Video size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-1">No Content Found</h3>
                                <p className="text-slate-500 mb-6">This course has no sections or videos yet.</p>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline"
                                >
                                    <Plus size={16} /> Add First Video
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Add Video Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Add New Video</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleAddVideo} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Video Title</label>
                                <input
                                    required
                                    type="text"
                                    value={newVideo.title}
                                    onChange={e => setNewVideo({ ...newVideo, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Intro to Python"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Section Name</label>
                                <input
                                    required
                                    type="text"
                                    list="sections-list"
                                    value={newVideo.section}
                                    onChange={e => setNewVideo({ ...newVideo, section: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Module 1: Basics"
                                />
                                <datalist id="sections-list">
                                    {content.sections?.map(s => <option key={s.id} value={s.title} />)}
                                </datalist>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Video Type</label>
                                    <select
                                        value={newVideo.type}
                                        onChange={e => setNewVideo({ ...newVideo, type: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="youtube">YouTube URL</option>
                                        <option value="local">Local Upload</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Duration</label>
                                    <input
                                        type="text"
                                        value={newVideo.duration}
                                        onChange={e => setNewVideo({ ...newVideo, duration: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="mm:ss"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">
                                    {newVideo.type === 'youtube' ? 'YouTube Embed Link' : 'Select Video File'}
                                </label>
                                {newVideo.type === 'youtube' ? (
                                    <input
                                        required={newVideo.type === 'youtube'}
                                        type="url"
                                        value={newVideo.url}
                                        onChange={e => setNewVideo({ ...newVideo, url: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="https://www.youtube.com/embed/..."
                                    />
                                ) : (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="relative border-2 border-dashed border-slate-200 rounded-lg text-center hover:bg-slate-50 transition-colors p-6 cursor-pointer"
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="video/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <Upload className="mx-auto text-slate-400 mb-2" size={24} />
                                        <p className="text-sm text-slate-500 font-medium">
                                            {newVideo.url ? 'File Selected' : 'Click to Upload Video'}
                                        </p>
                                        {newVideo.url && (
                                            <p className="text-xs text-green-600 mt-2 font-semibold">Video ready to add</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                            >
                                Add Video
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCourseContent;
