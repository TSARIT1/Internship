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
    X,
    FileQuestion
} from 'lucide-react';
import { createQuiz } from '../services/studentApi';

const AdminCourseContent = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [content, setContent] = useState({ liveLink: '', sections: [] });
    const [loading, setLoading] = useState(false);

    // Live Link State
    const [liveLinkInput, setLiveLinkInput] = useState('');
    const [savingLink, setSavingLink] = useState(false);

    // Add Video State
    // Quiz State
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [newQuiz, setNewQuiz] = useState({
        title: '',
        description: '',
        section: '',
        questions: [
            { questionText: '', options: ['', '', '', ''], correctOptionIndex: 0 }
        ]
    });

    const handleAddQuestion = () => {
        setNewQuiz({
            ...newQuiz,
            questions: [
                ...newQuiz.questions,
                { questionText: '', options: ['', '', '', ''], correctOptionIndex: 0 }
            ]
        });
    };

    const handleRemoveQuestion = (index) => {
        const updatedQuestions = newQuiz.questions.filter((_, i) => i !== index);
        setNewQuiz({ ...newQuiz, questions: updatedQuestions });
    };

    const handleQuestionChange = (index, field, value) => {
        const updatedQuestions = [...newQuiz.questions];
        updatedQuestions[index][field] = value;
        setNewQuiz({ ...newQuiz, questions: updatedQuestions });
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const updatedQuestions = [...newQuiz.questions];
        updatedQuestions[qIndex].options[oIndex] = value;
        setNewQuiz({ ...newQuiz, questions: updatedQuestions });
    };

    const handleCorrectOptionChange = (qIndex, value) => {
        const updatedQuestions = [...newQuiz.questions];
        updatedQuestions[qIndex].correctOptionIndex = parseInt(value);
        setNewQuiz({ ...newQuiz, questions: updatedQuestions });
    };

    // State for Video Modal & File Upload
    const [showAddModal, setShowAddModal] = useState(false);
    const [newVideo, setNewVideo] = useState({ title: '', section: '', type: 'youtube', url: '', duration: '' });
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            fetchContent(selectedCourse);
        }
    }, [selectedCourse]);

    const fetchCourses = async () => {
        const response = await getPricing();
        if (response.data) {
            setCourses(response.data);
            if (response.data.length > 0 && !selectedCourse) {
                setSelectedCourse(response.data[0].course);
            }
        }
    };

    const fetchContent = async (courseName) => {
        setLoading(true);
        const response = await getCourseContent(courseName);
        if (response.success) {
            setContent(response.data);
            setLiveLinkInput(response.data.liveLink || '');
        } else {
            setContent({ liveLink: '', sections: [] });
        }
        setLoading(false);
    };

    const handleAddVideo = async (e) => {
        e.preventDefault();

        let videoUrl = newVideo.url; // Default to text input (YouTube)

        // Handle file upload if type is local
        if (newVideo.type === 'local') {
            if (fileInputRef.current && fileInputRef.current.files[0]) {
                const uploadRes = await uploadFile(fileInputRef.current.files[0]);
                if (uploadRes.success) {
                    videoUrl = uploadRes.data.fileUrl || uploadRes.data; // Adjust based on API return
                } else {
                    alert("File upload failed");
                    return;
                }
            } else {
                alert("Please select a file");
                return;
            }
        }

        const res = await addCourseVideo(selectedCourse, newVideo.section, { ...newVideo, url: videoUrl });
        if (res.success) {
            alert("Video added successfully!");
            setShowAddModal(false);
            fetchContent(selectedCourse);
            // Reset form
            setNewVideo({ title: '', section: '', type: 'youtube', url: '', duration: '' });
        } else {
            alert("Failed to add video");
        }
    };

    const handleDeleteVideo = async (sectionId, videoId) => {
        if (!window.confirm("Are you sure you want to delete this video?")) return;
        const res = await deleteCourseVideo(selectedCourse, sectionId, videoId);
        if (res.success) {
            fetchContent(selectedCourse);
        } else {
            alert("Failed to delete video");
        }
    };

    const handleUpdateLiveLink = async () => {
        setSavingLink(true);
        const res = await updateLiveClassLink(selectedCourse, liveLinkInput);
        if (res.success) {
            alert("Live link updated successfully");
        } else {
            alert("Failed to update link");
        }
        setSavingLink(false);
    };

    const handleFileChange = (e) => {
        // Just for UI feedback
        if (e.target.files[0]) {
            setNewVideo({ ...newVideo, url: e.target.files[0].name });
        }
    };

    // Quiz Handlers
    const handleCreateQuiz = async (e) => {
        e.preventDefault();
        // Find section ID
        const targetSection = content.sections.find(s => s.title === newQuiz.section);
        if (!targetSection) {
            alert("Section not found");
            return;
        }

        try {
            // Updated to pass raw data and let API helper handle construction
            await createQuiz({
                courseName: selectedCourse,
                sectionId: targetSection.id,
                title: newQuiz.title,
                description: newQuiz.description,
                questions: newQuiz.questions
            });
            setShowQuizModal(false);
            setNewQuiz({
                title: '',
                description: '',
                section: '',
                questions: [{ questionText: '', options: ['', '', '', ''], correctOptionIndex: 0 }]
            });
            alert("Quiz created successfully!");
            fetchContent(selectedCourse);
        } catch (error) {
            console.error(error);
            alert("Failed to create quiz");
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* ... existing header code ... */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Course Content</h1>
                    <p className="text-slate-500 mt-1">Manage videos, quizzes, and live classes.</p>
                </div>
                {/* ... existing header code ... */}
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
                {/* ... existing live link code ... */}
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

            {/* Content Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">Course Content</h2>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm shadow-blue-200"
                        >
                            <Plus size={18} /> Add Video
                        </button>
                        <button
                            onClick={() => setShowQuizModal(true)}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-sm shadow-purple-200"
                        >
                            <Plus size={18} /> Add Quiz
                        </button>
                    </div>
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
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                            {section.videos.length} Videos • {section.quizzes ? section.quizzes.length : 0} Quizzes
                                        </span>
                                    </div>
                                    <div className="divide-y divide-slate-100">
                                        {/* Render Videos */}
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

                                        {/* Render Quizzes */}
                                        {section.quizzes && section.quizzes.map((quiz) => (
                                            <div key={quiz.id} className="p-4 flex items-center justify-between hover:bg-purple-50/30 transition-colors group border-l-4 border-purple-500 pl-3">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-50 text-purple-600">
                                                        <FileQuestion size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-slate-800">{quiz.title}</h4>
                                                        <p className="text-xs text-slate-500 flex items-center gap-2">
                                                            {quiz.questions.length} Questions
                                                        </p>
                                                    </div>
                                                </div>
                                                {/* Add Delete Quiz logic later if needed */}
                                                <button className="p-2 text-slate-300 cursor-not-allowed">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ))}

                                        {section.videos.length === 0 && (!section.quizzes || section.quizzes.length === 0) && (
                                            <div className="p-8 text-center text-slate-400 text-sm">No content in this section yet.</div>
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
                                <p className="text-slate-500 mb-6">This course has no sections or content yet.</p>
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={() => setShowAddModal(true)}
                                        className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline"
                                    >
                                        <Plus size={16} /> Add Video
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Add Video Modal - Existing Code ... */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                        {/* ... Existing Video Modal Content ... */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">Add New Video</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddVideo} className="space-y-4">
                            {/* ... Inputs ... */}
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

            {/* Quiz Modal */}
            {showQuizModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-4xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200 h-[80vh] flex flex-col">
                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <h2 className="text-xl font-bold text-slate-800">Create New Quiz</h2>
                            <button onClick={() => setShowQuizModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateQuiz} className="flex-1 flex flex-col overflow-hidden">
                            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Quiz Title</label>
                                        <input
                                            required
                                            type="text"
                                            value={newQuiz.title}
                                            onChange={e => setNewQuiz({ ...newQuiz, title: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="e.g., Python Basics Quiz"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Section</label>
                                        <input
                                            required
                                            type="text"
                                            list="sections-list-quiz"
                                            value={newQuiz.section}
                                            onChange={e => setNewQuiz({ ...newQuiz, section: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Select Section"
                                        />
                                        <datalist id="sections-list-quiz">
                                            {content.sections?.map(s => <option key={s.id} value={s.title} />)}
                                        </datalist>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-slate-700">Questions</h3>
                                        <button
                                            type="button"
                                            onClick={handleAddQuestion}
                                            className="text-purple-600 text-sm font-bold hover:underline"
                                        >
                                            + Add Question
                                        </button>
                                    </div>

                                    {newQuiz.questions.map((q, qIndex) => (
                                        <div key={qIndex} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative">
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveQuestion(qIndex)}
                                                className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                                            >
                                                <X size={16} />
                                            </button>

                                            <div className="mb-3">
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Question {qIndex + 1}</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={q.questionText}
                                                    onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                    placeholder="Enter question text..."
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                {q.options.map((opt, oIndex) => (
                                                    <div key={oIndex} className="flex items-center gap-2">
                                                        <input
                                                            type="radio"
                                                            name={`correct-${qIndex}`}
                                                            checked={q.correctOptionIndex === oIndex}
                                                            onChange={() => handleCorrectOptionChange(qIndex, oIndex)}
                                                            className="text-purple-600 focus:ring-purple-500"
                                                        />
                                                        <input
                                                            required
                                                            type="text"
                                                            value={opt}
                                                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                            className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                                                            placeholder={`Option ${oIndex + 1}`}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 mt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-600/20"
                                >
                                    Create Quiz
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCourseContent;
