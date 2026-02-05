import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';

import { loginStudent } from '../services/studentApi';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Using loginStudent service which calls backend
            const response = await loginStudent(email, password);

            if (response.success) {
                // Token is already saved by loginStudent in localStorage 'token'
                // We also set 'adminToken' for any legacy admin components if they exist, but generally 'token' is key
                localStorage.setItem('adminToken', localStorage.getItem('token'));
                localStorage.setItem('isAdmin', 'true');
                navigate('/admin/dashboard');
            } else {
                setError(response.message || 'Invalid credentials');
            }
        } catch (err) {
            setError('Login failed. Please check backend.');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.05] pointer-events-none" />

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-blue-600/30">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 font-display">Admin Login</h1>
                    <p className="text-slate-500">Secure access to the dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="admin@company.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end mt-2">
                        <a href="/forgot-password" className="text-xs font-bold text-blue-600 hover:underline">Forgot Password?</a>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-blue-600/20 flex items-center justify-center gap-2"
                    >
                        Sign In <ArrowRight size={20} />
                    </button>

                    <div className="text-center">
                        <p className="text-xs text-slate-400 mt-4">Demo credentials: admin@tsarit.com / admin123</p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
