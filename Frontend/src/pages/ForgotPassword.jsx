import React, { useState, useRef, useEffect } from 'react';
import ShinyButton from '../components/ui/ShinyButton';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Lock, ShieldCheck, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, verifyOtp, resetPassword } from '../services/studentApi';

const StepIndicator = ({ step }) => (
    <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
                <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step >= s
                            ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/30'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                >
                    {step > s ? '✓' : s}
                </div>
                {s < 3 && (
                    <div
                        className={`w-12 h-1 rounded-full transition-all duration-300 ${step > s ? 'bg-orange-400' : 'bg-slate-200'
                            }`}
                    />
                )}
            </React.Fragment>
        ))}
    </div>
);

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [resendTimer, setResendTimer] = useState(0);

    const otpRefs = useRef([]);

    // Resend timer countdown
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    // Auto-hide popup after 4 seconds
    useEffect(() => {
        if (showPopup) {
            const timer = setTimeout(() => setShowPopup(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [showPopup]);

    const showErrorPopup = (msg) => {
        setPopupMessage(msg);
        setShowPopup(true);
    };

    // Step 1: Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        const res = await forgotPassword(email);
        if (res.success) {
            setStatus('idle');
            setStep(2);
            setResendTimer(60);
        } else {
            setStatus('idle');
            showErrorPopup(res.message || 'This mail id is not registered');
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            showErrorPopup('Please enter the complete 6-digit OTP');
            return;
        }

        setStatus('loading');
        const res = await verifyOtp(email, otpString);
        if (res.success) {
            setResetToken(res.resetToken);
            setStatus('idle');
            setStep(3);
        } else {
            setStatus('idle');
            showErrorPopup(res.message || 'Invalid or expired OTP');
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            showErrorPopup('Passwords do not match');
            return;
        }
        if (newPassword.length < 6) {
            showErrorPopup('Password must be at least 6 characters');
            return;
        }

        setStatus('loading');
        const res = await resetPassword(resetToken, newPassword);
        if (res.success) {
            setStatus('success');
            setMessage('Your password has been reset successfully!');
            setTimeout(() => navigate('/login'), 3000);
        } else {
            setStatus('idle');
            showErrorPopup(res.message || 'Failed to reset password');
        }
    };

    // Resend OTP
    const handleResendOtp = async () => {
        if (resendTimer > 0) return;
        setStatus('loading');
        const res = await forgotPassword(email);
        if (res.success) {
            setResendTimer(60);
            setOtp(['', '', '', '', '', '']);
            setStatus('idle');
            setMessage('OTP resent to your email');
            setTimeout(() => setMessage(''), 3000);
        } else {
            setStatus('idle');
            showErrorPopup(res.message);
        }
    };

    // OTP input handlers
    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return; // Only digits
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1); // Only last digit
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (paste.length === 6) {
            const newOtp = paste.split('');
            setOtp(newOtp);
            otpRefs.current[5]?.focus();
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                    alt="Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>
            </div>

            {/* Popup Error Toast */}
            {showPopup && (
                <div
                    className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-bounce-in"
                    style={{ animation: 'slideDown 0.4s ease-out' }}
                >
                    <div className="flex items-center gap-3 bg-red-600 text-white px-6 py-4 rounded-xl shadow-2xl shadow-red-500/30 min-w-[320px]">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                            <AlertCircle size={22} />
                        </div>
                        <p className="font-semibold text-sm flex-1">{popupMessage}</p>
                        <button
                            onClick={() => setShowPopup(false)}
                            className="text-white/80 hover:text-white transition-colors flex-shrink-0"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative z-10">
                <div className="p-8">
                    <Link
                        to="/login"
                        className="inline-flex items-center text-slate-500 hover:text-primary transition-colors mb-6 text-sm font-medium"
                    >
                        <ArrowLeft size={16} className="mr-1" /> Back to Login
                    </Link>

                    <StepIndicator step={step} />

                    {/* Success State */}
                    {status === 'success' ? (
                        <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center">
                            <CheckCircle size={48} className="text-green-600 mx-auto mb-3" />
                            <h3 className="font-bold text-green-800 text-lg mb-1">Password Reset!</h3>
                            <p className="text-green-700 text-sm mb-4">{message}</p>
                            <p className="text-slate-500 text-xs">Redirecting to login in 3 seconds...</p>
                            <Link
                                to="/login"
                                className="mt-4 block text-sm font-semibold text-green-700 underline"
                            >
                                Login Now
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Step 1: Email */}
                            {step === 1 && (
                                <>
                                    <div className="text-center mb-6">
                                        <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Mail size={32} />
                                        </div>
                                        <h1 className="text-2xl font-bold text-slate-900">Forgot Password?</h1>
                                        <p className="text-slate-500 mt-2 text-sm">
                                            Enter your registered email and we'll send you a verification OTP.
                                        </p>
                                    </div>

                                    <form onSubmit={handleSendOtp} className="space-y-5">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Mail size={18} className="text-slate-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-900 placeholder:text-slate-400"
                                                    placeholder="Enter your registered email"
                                                />
                                            </div>
                                        </div>

                                        <ShinyButton
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="w-full justify-center !py-3.5 bg-gradient-to-r from-orange-400 to-orange-600 shadow-orange-500/30"
                                        >
                                            {status === 'loading' ? (
                                                <span className="animate-pulse">Sending OTP...</span>
                                            ) : (
                                                'Send OTP'
                                            )}
                                        </ShinyButton>
                                    </form>
                                </>
                            )}

                            {/* Step 2: OTP Verification */}
                            {step === 2 && (
                                <>
                                    <div className="text-center mb-6">
                                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <ShieldCheck size={32} />
                                        </div>
                                        <h1 className="text-2xl font-bold text-slate-900">Verify OTP</h1>
                                        <p className="text-slate-500 mt-2 text-sm">
                                            We've sent a 6-digit code to <strong className="text-slate-700">{email}</strong>
                                        </p>
                                    </div>

                                    {message && (
                                        <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg text-center mb-4 font-medium">
                                            {message}
                                        </div>
                                    )}

                                    <form onSubmit={handleVerifyOtp} className="space-y-5">
                                        <div className="flex justify-center gap-2">
                                            {otp.map((digit, index) => (
                                                <input
                                                    key={index}
                                                    ref={(el) => (otpRefs.current[index] = el)}
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                    onPaste={index === 0 ? handleOtpPaste : undefined}
                                                    className="w-12 h-14 text-center text-xl font-bold bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all text-slate-900"
                                                />
                                            ))}
                                        </div>

                                        <ShinyButton
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="w-full justify-center !py-3.5 bg-gradient-to-r from-orange-400 to-orange-600 shadow-orange-500/30"
                                        >
                                            {status === 'loading' ? (
                                                <span className="animate-pulse">Verifying...</span>
                                            ) : (
                                                'Verify OTP'
                                            )}
                                        </ShinyButton>

                                        <div className="text-center text-sm text-slate-500">
                                            Didn't receive the code?{' '}
                                            {resendTimer > 0 ? (
                                                <span className="text-slate-400">Resend in {resendTimer}s</span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={handleResendOtp}
                                                    className="text-orange-600 font-bold hover:underline"
                                                >
                                                    Resend OTP
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </>
                            )}

                            {/* Step 3: New Password */}
                            {step === 3 && (
                                <>
                                    <div className="text-center mb-6">
                                        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Lock size={32} />
                                        </div>
                                        <h1 className="text-2xl font-bold text-slate-900">Set New Password</h1>
                                        <p className="text-slate-500 mt-2 text-sm">
                                            Create a new secure password for your account.
                                        </p>
                                    </div>

                                    <form onSubmit={handleResetPassword} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock size={18} className="text-slate-400" />
                                                </div>
                                                <input
                                                    type="password"
                                                    required
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-900 placeholder:text-slate-400"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                                Confirm Password
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Lock size={18} className="text-slate-400" />
                                                </div>
                                                <input
                                                    type="password"
                                                    required
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-900 placeholder:text-slate-400"
                                                    placeholder="••••••••"
                                                />
                                            </div>
                                        </div>

                                        <ShinyButton
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="w-full justify-center !py-3.5 bg-gradient-to-r from-orange-400 to-orange-600 shadow-orange-500/30"
                                        >
                                            {status === 'loading' ? (
                                                <span className="animate-pulse">Resetting...</span>
                                            ) : (
                                                'Reset Password'
                                            )}
                                        </ShinyButton>
                                    </form>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* CSS for popup animation */}
            <style>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -20px);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, 0);
                    }
                }
            `}</style>
        </div>
    );
};

export default ForgotPassword;
