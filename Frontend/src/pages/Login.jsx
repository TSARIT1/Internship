
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ShinyButton from '../components/ui/ShinyButton';
import { ArrowLeft, Mail, Lock, User, UserPlus, LogIn, Phone, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { loginStudent, enrollStudent, applyForInternship } from '../services/studentApi';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    // const [course, setCourse] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // React.useEffect(() => {
    //     const pending = localStorage.getItem('pendingEnrollment');
    //     if (pending) {
    //         setCourse(pending);
    //     }
    // }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Frontend-only Auth Simulation
            // We are using the API for "real" authentication if available, but enforcing the storage requirements.

            let response;
            if (isLogin) {
                response = await loginStudent(email, password);
            } else {
                if (password !== confirmPassword) {
                    setError("Passwords do not match!");
                    setLoading(false);
                    return;
                }
                const studentData = {
                    name,
                    email,
                    phone,
                    password,
                    // course: course || 'General' // Removed course
                };
                response = await enrollStudent(studentData);
            }

            if (response.success) {
                if (!isLogin) {
                    setIsLogin(true);
                    setError('');
                    alert("Account created successfully! Please login with your credentials.");
                    setLoading(false);
                    return;
                }

                // 1. Set Auth State per requirements
                // Token is already set by loginStudent API call now
                localStorage.setItem('student', JSON.stringify(response.data));
                localStorage.setItem('student', JSON.stringify(response.data));

                // Clear potential admin session
                localStorage.removeItem('adminToken');
                localStorage.removeItem('isAdmin');

                // 2. Process Pending Enrollment & Redirect
                const pendingCourse = localStorage.getItem('pendingEnrollment');
                if (pendingCourse && isLogin) {
                    const updateRes = await applyForInternship(response.data.id, pendingCourse);
                    if (updateRes.success) {
                        localStorage.setItem('student', JSON.stringify(updateRes.data));
                    }
                    localStorage.removeItem('pendingEnrollment');
                    navigate('/enroll-success');
                    return;
                }
                localStorage.removeItem('pendingEnrollment');

                const redirectPath = localStorage.getItem('redirectAfterLogin');
                if (redirectPath) {
                    localStorage.removeItem('redirectAfterLogin');
                    navigate(redirectPath);
                } else {
                    navigate('/studentdashboard');
                }
            } else {
                setError(response.message || "Authentication failed");
            }

        } catch (err) {
            setError(err.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // const courses = [
    //     "Data Science",
    //     "Machine Learning",
    //     "AI",
    //     "MERN Stack",
    //     "DevOps",
    //     "Java Full Stack",
    //     "Python Programming",
    //     "AWS Cloud Computing",
    //     "Cyber Security"
    // ];

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            {/* Background decoration */}
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
                            type="button"
                            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                            onClick={() => { setIsLogin(true); setError(''); }}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${!isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                            onClick={() => { setIsLogin(false); setError(''); }}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
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
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
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
                                            required
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
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
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 placeholder:text-slate-400"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock size={18} className="text-slate-400" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 placeholder:text-slate-400"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="text-red-500 text-sm p-2 bg-red-50 rounded-lg text-center font-medium">
                                {error}
                            </div>
                        )}

                        {isLogin && (
                            <div className="flex items-center justify-end">
                                <a href="#" className="text-sm font-medium text-primary hover:text-teal-600 transition-colors">
                                    Forgot Password?
                                </a>
                            </div>
                        )}

                        <ShinyButton
                            type="submit"
                            disabled={loading}
                            continuous={true}
                            className="w-full justify-center !py-4 !text-lg bg-gradient-to-r from-orange-400 to-orange-600 shadow-orange-500/30 hover:shadow-orange-500/50"
                        >
                            {loading ? (
                                <span className="animate-pulse flex items-center gap-2">
                                    Processing...
                                </span>
                            ) : isLogin ? (
                                <>
                                    <LogIn size={20} /> Login Securely
                                </>
                            ) : (
                                <>
                                    <UserPlus size={20} /> Create Account
                                </>
                            )}
                        </ShinyButton>
                    </form>

                    {/* Footer of card */}
                    <div className="mt-8 text-center text-sm text-slate-500">
                        {isLogin ? (
                            <>
                                Don't have an account?{' '}
                                <button onClick={() => { setIsLogin(false); setError(''); }} className="text-primary font-bold hover:underline">
                                    Sign Up
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <button onClick={() => { setIsLogin(true); setError(''); }} className="text-primary font-bold hover:underline">
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
