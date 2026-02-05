import React, { useState } from 'react';
import ShinyButton from '../components/ui/ShinyButton';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/studentApi';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        const res = await forgotPassword(email);
        if (res.success) {
            setStatus('success');
            setMessage(res.message || 'Check your email for the reset link.');
        } else {
            setStatus('error');
            setMessage(res.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                <Link to="/login" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
                    <ArrowLeft size={16} className="mr-1" /> Back to Login
                </Link>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Forgot Password?</h1>
                    <p className="text-slate-500 mt-2">Enter your email and we'll send you instructions to reset your password.</p>
                </div>

                {status === 'success' ? (
                    <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center">
                        <CheckCircle size={32} className="text-green-600 mx-auto mb-3" />
                        <h3 className="font-bold text-green-800 mb-1">Email Sent!</h3>
                        <p className="text-green-700 text-sm mb-4">{message}</p>
                        <p className="text-slate-500 text-xs">Didn't receive it? Check spam or try again.</p>
                        <button
                            onClick={() => setStatus('idle')}
                            className="mt-4 text-sm font-semibold text-green-700 underline"
                        >
                            Try another email
                        </button>
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
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 text-slate-400" size={20} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="Enter your registered email"
                                />
                            </div>
                        </div>

                        <ShinyButton
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full justify-center bg-slate-900"
                        >
                            {status === 'loading' ? 'Sending Link...' : 'Send Reset Link'}
                        </ShinyButton>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
