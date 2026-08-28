import React, { useState } from 'react';
import { Lock, Save } from 'lucide-react';
import { changePassword } from '../services/studentApi';

const AdminProfile = () => {
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const adminUser = JSON.parse(sessionStorage.getItem('adminUser') || '{}');

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage({ type: 'error', text: "New passwords don't match" });
            return;
        }

        if (passwords.newPassword.length < 6) {
            setMessage({ type: 'error', text: "Password must be at least 6 characters" });
            return;
        }

        if (!adminUser.id) {
            setMessage({ type: 'error', text: "Admin session error. Please relogin." });
            return;
        }

        setLoading(true);
        try {
            const res = await changePassword(adminUser.id, {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });

            if (res && res.success) {
                setMessage({ type: 'success', text: 'Password updated successfully' });
                setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setMessage({ type: 'error', text: res?.message || 'Failed to update password' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An unexpected error occurred' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-12 max-w-4xl mx-auto">
            <header className="mb-12">
                <h1 className="text-3xl font-bold text-slate-900 font-display">Profile Settings</h1>
                <p className="text-slate-500">Manage your account preferences</p>
            </header>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
                        {adminUser.username ? adminUser.username[0].toUpperCase() : 'A'}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{adminUser.username || 'Admin'}</h2>
                        <p className="text-slate-500">{adminUser.email || 'tsaritservices@gmail.com'}</p>
                    </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Lock size={20} className="text-blue-600" />
                    Change Password
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Current Password</label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={passwords.currentPassword}
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwords.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : <><Save size={18} /> Update Password</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminProfile;
