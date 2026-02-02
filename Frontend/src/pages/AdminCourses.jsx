import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit, Search, X, Loader2, BookOpen } from 'lucide-react';
import { getAllCourses, addCourse, deleteCourse } from '../services/studentApi';

const AdminCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        duration: '',
        level: 'Beginner',
        description: '',
        iconName: 'Code',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        borderColor: 'group-hover:border-blue-500/50',
        gradient: 'from-blue-600 to-cyan-500',
        shadow: 'group-hover:shadow-blue-500/20',
        totalFee: '',
        discount: ''
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        const response = await getAllCourses();
        if (response.success) {
            setCourses(response.data);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            const response = await deleteCourse(id);
            if (response.success) {
                fetchCourses();
            } else {
                alert('Failed to delete course');
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await addCourse(formData);
        if (response.success) {
            setIsModalOpen(false);
            fetchCourses();
            setFormData({
                name: '', slug: '', duration: '', level: 'Beginner', description: '',
                iconName: 'Code', color: 'text-blue-600', bgColor: 'bg-blue-100',
                borderColor: 'group-hover:border-blue-500/50', gradient: 'from-blue-600 to-cyan-500',
                shadow: 'group-hover:shadow-blue-500/20', totalFee: '', discount: ''
            });
        } else {
            alert('Failed to add course');
        }
    };

    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Course Management</h1>
                    <p className="text-slate-500">Add, edit, or remove courses</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                >
                    <Plus size={20} />
                    Add New Course
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
            </div>

            {/* Course List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-4 font-semibold text-slate-600 text-sm">Course Name</th>
                                <th className="p-4 font-semibold text-slate-600 text-sm">Level</th>
                                <th className="p-4 font-semibold text-slate-600 text-sm">Duration</th>
                                <th className="p-4 font-semibold text-slate-600 text-sm">Fee</th>
                                <th className="p-4 font-semibold text-slate-600 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">
                                        <Loader2 className="animate-spin inline-block mb-2" />
                                        <p>Loading courses...</p>
                                    </td>
                                </tr>
                            ) : filteredCourses.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">
                                        No courses found.
                                    </td>
                                </tr>
                            ) : (
                                filteredCourses.map((course) => (
                                    <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-medium text-slate-900 flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${course.bgColor} ${course.color}`}>
                                                {course.name.charAt(0)}
                                            </div>
                                            {course.name}
                                        </td>
                                        <td className="p-4 text-slate-600 text-sm">{course.level}</td>
                                        <td className="p-4 text-slate-600 text-sm">{course.duration}</td>
                                        <td className="p-4 text-slate-600 text-sm">₹{course.totalFee}</td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleDelete(course.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Course"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Course Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                <h2 className="text-xl font-bold text-slate-900">Add New Course</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Course Name</label>
                                            <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2 border rounded-lg" placeholder="e.g. Data Science" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Slug (Route)</label>
                                            <input required name="slug" value={formData.slug} onChange={handleInputChange} className="w-full p-2 border rounded-lg" placeholder="e.g. /data-science" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
                                            <input required name="duration" value={formData.duration} onChange={handleInputChange} className="w-full p-2 border rounded-lg" placeholder="e.g. 6 Months" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Level</label>
                                            <select name="level" value={formData.level} onChange={handleInputChange} className="w-full p-2 border rounded-lg">
                                                <option>Beginner</option>
                                                <option>Intermediate</option>
                                                <option>Advanced</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Total Fee (₹)</label>
                                            <input type="number" required name="totalFee" value={formData.totalFee} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Discount (₹)</label>
                                            <input type="number" required name="discount" value={formData.discount} onChange={handleInputChange} className="w-full p-2 border rounded-lg" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                        <textarea required name="description" value={formData.description} onChange={handleInputChange} className="w-full p-2 border rounded-lg h-24" placeholder="Brief description..." />
                                    </div>

                                    {/* Styling Fields - Simplified for Demo, user can expand later */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Icon Name (Lucide)</label>
                                            <input name="iconName" value={formData.iconName} onChange={handleInputChange} className="w-full p-2 border rounded-lg" placeholder="e.g. Code, Database" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Color Class</label>
                                            <input name="color" value={formData.color} onChange={handleInputChange} className="w-full p-2 border rounded-lg" placeholder="e.g. text-blue-600" />
                                        </div>
                                    </div>

                                    <div className="pt-4 flex justify-end gap-3">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Add Course</button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminCourses;
