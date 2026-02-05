import React, { useState } from 'react';
import ShinyButton from '../components/ui/ShinyButton';
import { Lock, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/studentApi';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match");
            setStatus('error');
            return;
        }

        if (newPassword.length < 6) {
            setMessage("Password must be at least 6 characters");
            setStatus('error');
            return;
        }

        setStatus('loading');
        setMessage('');

        const res = await resetPassword(token, newPassword);
        if (res.success) {
            setStatus('success');
            setMessage('Your password has been reset successfully!');
            setTimeout(() => navigate('/login'), 3000);
        } else {
            setStatus('error');
            setMessage(res.message);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100 text-center">
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Invalid Link</h2>
                    <p className="text-slate-500 mb-6">This password reset link is invalid or missing.</p>
                    <Link to="/forgot-password" className="text-blue-600 font-bold hover:underline">
                        Request a new link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Reset Password</h1>
                    <p className="text-slate-500 mt-2">Create a new secure password for authentication.</p>
                </div>

                {status === 'success' ? (
                    <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center">
                        <CheckCircle size={32} className="text-green-600 mx-auto mb-3" />
                        <h3 className="font-bold text-green-800 mb-1">Success!</h3>
                        <p className="text-green-700 text-sm mb-4">{message}</p>
                        <p className="text-slate-500 text-xs">Redirecting to login in 3 seconds...</p>
                        <Link to="/login" className="mt-4 block text-sm font-semibold text-green-700 underline">
                            Login Now
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {status === 'error' && (
                            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
                                <AlertCircle size={16} />
                                {message}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
                                <input
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 text-slate-400" size={20} />
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <ShinyButton
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full justify-center bg-slate-900"
                        >
                            {status === 'loading' ? 'Resetting...' : 'Reset Password'}
                        </ShinyButton>

                        <div className="text-center">
                            <Link to="/login" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
                                Back to Login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
