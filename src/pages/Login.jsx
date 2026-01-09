import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, User, UserPlus, LogIn, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            {/* Background decoration */}
            {/* Background Image & Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                    alt="Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative z-10">
                <div className="p-8">
                    <Link to="/" className="inline-flex items-center text-slate-500 hover:text-primary transition-colors mb-6 text-sm font-medium">
                        <ArrowLeft size={16} className="mr-1" /> Back to Home
                    </Link>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold font-display text-slate-900 mb-2">
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p className="text-slate-500">
                            {isLogin ? 'Enter your details to access your account' : 'Join us and start your journey today'}
                        </p>
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
                        <button
                            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                            onClick={() => setIsLogin(true)}
                        >
                            Login
                        </button>
                        <button
                            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${!isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                            onClick={() => setIsLogin(false)}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form className="space-y-4">
                        {!isLogin && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User size={18} className="text-slate-400" />
                                        </div>
                                        <input
                                            type="text"
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 placeholder:text-slate-400"
                                            placeholder="Enter your Name"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail size={18} className="text-slate-400" />
                                        </div>
                                        <input
                                            type="email"
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 placeholder:text-slate-400"
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Mobile Number</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone size={18} className="text-slate-400" />
                                        </div>
                                        <input
                                            type="tel"
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 placeholder:text-slate-400"
                                            placeholder="Enter your mobile number"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Enter Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail size={18} className="text-slate-400" />
                                    </div>
                                    <input
                                        type="email"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 placeholder:text-slate-400"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock size={18} className="text-slate-400" />
                                </div>
                                <input
                                    type="password"
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 placeholder:text-slate-400"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {isLogin && (
                            <div className="flex items-center justify-end">
                                <a href="#" className="text-sm font-medium text-primary hover:text-teal-600 transition-colors">
                                    Forgot Password?
                                </a>
                            </div>
                        )}

                        <button
                            type="button" // Change to submit in real app
                            className="w-full bg-secondary hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-orange-500/25 flex items-center justify-center gap-2 mt-2"
                        >
                            {isLogin ? (
                                <>
                                    <LogIn size={20} /> Login Securely
                                </>
                            ) : (
                                <>
                                    <UserPlus size={20} /> Create Account
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer of card */}
                    <div className="mt-8 text-center text-sm text-slate-500">
                        {isLogin ? (
                            <>
                                Don't have an account?{' '}
                                <button onClick={() => setIsLogin(false)} className="text-primary font-bold hover:underline">
                                    Sign Up
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <button onClick={() => setIsLogin(true)} className="text-primary font-bold hover:underline">
                                    Login
                                </button>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;
