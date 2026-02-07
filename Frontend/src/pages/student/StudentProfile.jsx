import React, { useState, useEffect } from 'react';
import ShinyButton from '../../components/ui/ShinyButton';
import { User, Mail, Phone, Lock, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { updateStudentProfile, changePassword, uploadFile } from '../../services/studentApi';

const StudentProfile = () => {
    const [student, setStudent] = useState({});

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: '' }

    // Profile Form Data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    // Password Form Data
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const storedStudent = JSON.parse(localStorage.getItem('student') || '{}');
        setStudent(storedStudent);
        setFormData({
            name: storedStudent.name || storedStudent.username || '',
            email: storedStudent.email || '',
            phone: storedStudent.phone || ''
        });
    }, []);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await updateStudentProfile(student.id, {
                name: formData.name,
                phone: formData.phone
            });

            if (res.success) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                // Update local student state
                const updated = { ...student, name: formData.name, phone: formData.phone };
                setStudent(updated);
            } else {
                setMessage({ type: 'error', text: res.message || 'Failed to update profile.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'An unexpected error occurred.' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match.' });
            setLoading(false);
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
            setLoading(false);
            return;
        }

        try {
            const res = await changePassword(student.id, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            if (res.success) {
                setMessage({ type: 'success', text: 'Password changed successfully!' });
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setMessage({ type: 'error', text: res.message || 'Failed to change password.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'An unexpected error occurred.' });
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        setMessage(null);

        try {
            const res = await uploadFile(file);
            if (res.success) {
                // Determine the URL. ensure backend returns full URL or path
                // If backend returns { fileName: "...", fileUrl: "..." }
                const imageUrl = res.data.fileUrl || res.data; 
                
                // Update profile with new image URL
                // Note: We need to ensure backend User entity has profilePicture field 
                // and updateStudentProfile supports it. 
                // For now, we update local state and try to save it.
                
                const updatedStudent = { ...student, profilePicture: imageUrl };
                setStudent(updatedStudent);
                localStorage.setItem('student', JSON.stringify(updatedStudent));

                // Attempt to save to backend (might need backend update)
                await updateStudentProfile(student.id, { ...formData, profilePicture: imageUrl });
                
                setMessage({ type: 'success', text: 'Profile picture updated!' });
            } else {
                setMessage({ type: 'error', text: 'Failed to upload image.' });
            }
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Image upload failed.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
                <p className="text-slate-500 mt-1">Manage your account settings and preferences.</p>
            </header>

            {/* Notification */}
            {message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <p className="font-medium">{message.text}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Profile Card */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
                        <div className="relative w-24 h-24 mx-auto mb-4 group cursor-pointer">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-200 overflow-hidden">
                                {student.profilePicture ? (
                                    <img src={student.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    student.name ? student.name.charAt(0).toUpperCase() : <User />
                                )}
                            </div>

                            {/* Overlay for upload */}
                            <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-xs font-bold">
                                Change
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-1">{student.name}</h2>
                        <p className="text-slate-500 text-sm mb-4">{student.email}</p>
                        <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wide">
                            Student Account
                        </div>
                    </div>
                </div>

                {/* Right Column: Forms */}
                <div className="md:col-span-2 space-y-8">
                    {/* Personal Details Form */}
                    <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <User size={20} className="text-blue-600" />
                            Personal Details
                        </h3>
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                                        placeholder="Your Name"
                                    />
                                    <User size={18} className="absolute left-3 top-3.5 text-slate-400" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={formData.email}
                                        readOnly
                                        className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                                    />
                                    <Mail size={18} className="absolute left-3 top-3.5 text-slate-400" />
                                </div>
                                <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                                        placeholder="Your Phone Number"
                                    />
                                    <Phone size={18} className="absolute left-3 top-3.5 text-slate-400" />
                                </div>
                            </div>
                            <div className="pt-2">
                                <ShinyButton
                                    type="submit"
                                    disabled={loading}
                                    className="w-full sm:w-auto bg-slate-900 justify-center"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </ShinyButton>
                            </div>
                        </form>
                    </div>

                    {/* Change Password Form */}
                    <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Lock size={20} className="text-blue-600" />
                            Security
                        </h3>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div className="pt-2">
                                <ShinyButton
                                    type="submit"
                                    disabled={loading}
                                    className="w-full sm:w-auto bg-white !text-slate-900 border border-slate-200 hover:bg-slate-50 justify-center"
                                >
                                    {loading ? 'Updating...' : 'Update Password'}
                                </ShinyButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
