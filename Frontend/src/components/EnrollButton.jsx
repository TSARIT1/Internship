import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Globe, CreditCard, X, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { applyForInternship, checkEnrollmentStatus } from '../services/studentApi';
import useCoursePricing from '../hooks/usePricing';
import { loadRazorpay } from '../utils/razorpay';
import { loadPayPalSdk } from '../utils/paypal';

const PAYPAL_CLIENT_ID = 'Aa-aNx86Z7v_VTBCrO_7T-jaXU2jELDV6c3K0fBU1JUNIRpHfNE_uGWbhUMFly6-LLrpBJC2SRc6MUsQ';

const EnrollButton = ({ className, children, course }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { finalFee, totalFee, discount, loading: pricingLoading } = useCoursePricing(course);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [checkingEnrollment, setCheckingEnrollment] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState('razorpay'); // 'razorpay' or 'paypal'
    const [paypalReady, setPaypalReady] = useState(false);
    const paypalContainerRef = useRef(null);

    useEffect(() => {
        const checkStatus = async () => {
            if (!course) {
                setCheckingEnrollment(false);
                return;
            }
            const student = JSON.parse(sessionStorage.getItem('student') || '{}');
            if (student.id) {
                try {
                    const res = await checkEnrollmentStatus(student.id, course);
                    if (res.success && res.enrolled) {
                        setIsEnrolled(true);
                    }
                } catch (e) {
                    console.error("Failed to check enrollment status", e);
                }
            }
            setCheckingEnrollment(false);
        };
        checkStatus();
    }, [course]);

    // Calculate fees
    const inrFee = finalFee || 5000;
    // Approximate conversion for international checkout (e.g. 5000 INR ~ $59 USD, minimum $1.00)
    const usdFee = Math.max(1, Math.round((inrFee / 85) * 100) / 100);

    const handleInitialClick = () => {
        if (course) {
            navigate(`/enroll?course=${encodeURIComponent(course)}`);
        } else {
            navigate('/enroll');
        }
    };

    // Initialize PayPal Buttons when PayPal method is selected in modal
    useEffect(() => {
        if (showModal && selectedMethod === 'paypal' && paypalContainerRef.current) {
            let isCancelled = false;
            paypalContainerRef.current.innerHTML = '';
            setPaypalReady(false);

            loadPayPalSdk(PAYPAL_CLIENT_ID, 'USD')
                .then((paypal) => {
                    if (isCancelled || !paypal || !paypalContainerRef.current) return;
                    setPaypalReady(true);

                    paypal.Buttons({
                        style: {
                            layout: 'vertical',
                            color: 'gold',
                            shape: 'rect',
                            label: 'paypal',
                            height: 44
                        },
                        createOrder: (data, actions) => {
                            return actions.order.create({
                                purchase_units: [{
                                    description: `TSAR IT Enrollment - ${course}`,
                                    amount: {
                                        currency_code: 'USD',
                                        value: usdFee.toFixed(2)
                                    }
                                }]
                            });
                        },
                        onApprove: async (data, actions) => {
                            setLoading(true);
                            try {
                                const details = await actions.order.capture();
                                const student = JSON.parse(sessionStorage.getItem('student') || '{}');
                                const transactionId = details.id || data.orderID;

                                const payload = {
                                    razorpay_payment_id: transactionId,
                                    paymentMethod: 'PAYPAL',
                                    payerEmail: details.payer?.email_address,
                                    amountPaid: usdFee,
                                    currency: 'USD'
                                };

                                const updateRes = await applyForInternship(student.id, course, payload);
                                if (updateRes.success) {
                                    sessionStorage.setItem('student', JSON.stringify(updateRes.data));
                                    setShowModal(false);
                                    navigate('/enroll-success');
                                } else {
                                    alert(updateRes.message || "Enrollment failed after PayPal payment. Please contact support.");
                                }
                            } catch (err) {
                                console.error("PayPal enrollment error", err);
                                alert("PayPal transaction completed, but enrollment confirmation encountered an issue. Support notified.");
                            } finally {
                                setLoading(false);
                            }
                        },
                        onError: (err) => {
                            console.error("PayPal checkout error:", err);
                            alert("PayPal checkout could not be completed. Please try again or use Razorpay.");
                        }
                    }).render(paypalContainerRef.current);
                })
                .catch((err) => {
                    console.error("Failed to load PayPal SDK", err);
                });

            return () => {
                isCancelled = true;
            };
        }
    }, [showModal, selectedMethod, course, usdFee, navigate]);

    // Handle Razorpay Payment
    const handleRazorpayPayment = async () => {
        setLoading(true);
        try {
            const res = await loadRazorpay();
            if (!res) {
                alert('Razorpay SDK failed to load. Please check your internet connection.');
                setLoading(false);
                return;
            }

            const student = JSON.parse(sessionStorage.getItem('student') || '{}');
            const apiKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TTc7Hc65XaxuNm';

            const options = {
                key: apiKey,
                amount: inrFee * 100,
                currency: "INR",
                name: "TSAR IT Services",
                description: `Enrollment for ${course}`,
                image: "/tsar-logo.jpg",
                handler: async function (response) {
                    try {
                        if (student.id) {
                            const updateRes = await applyForInternship(student.id, course, response);
                            if (updateRes.success) {
                                sessionStorage.setItem('student', JSON.stringify(updateRes.data));
                                setShowModal(false);
                                navigate('/enroll-success');
                            } else {
                                alert(updateRes.message || "Enrollment failed. You might already be enrolled.");
                            }
                        }
                    } catch (err) {
                        console.error("Enrollment error", err);
                        const msg = err.response?.data || err.message || "Enrollment failed after payment.";
                        alert(`Error: ${msg}`);
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: student.name || student.username || "Student Name",
                    email: student.email || "student@example.com",
                    contact: student.phone || "9999999999"
                },
                theme: {
                    color: "#2563EB"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

            paymentObject.on('payment.failed', function (response) {
                alert(response.error?.description || "Payment failed or was cancelled.");
                setLoading(false);
            });
        } catch (e) {
            console.error("Razorpay error", e);
            setLoading(false);
        }
    };

    if (isEnrolled && !loading) {
        return (
            <button
                disabled
                className={className?.replace("bg-blue-600", "bg-green-600").replace("bg-orange-600", "bg-green-600").replace("hover:bg-blue-700", "").replace("hover:bg-orange-700", "") + " opacity-80 cursor-not-allowed"}
            >
                Already Enrolled
            </button>
        );
    }

    return (
        <>
            <button
                onClick={handleInitialClick}
                disabled={loading || checkingEnrollment}
                className={className || "bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-orange-600/30 flex items-center gap-2 cursor-pointer"}
            >
                {loading ? "Processing..." : (children || <>Enroll Now <ArrowRight size={20} /></>)}
            </button>

            {/* Payment Gateway Selector Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
                    <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden font-sans">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 p-6 text-white relative">
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-5 right-5 text-white/80 hover:text-white p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-extrabold uppercase tracking-wider mb-2">
                                Secure Checkout & Enrollment
                            </span>
                            <h3 className="text-xl sm:text-2xl font-black">{course}</h3>
                            <p className="text-xs sm:text-sm text-blue-100 mt-1">Select your preferred payment gateway below</p>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-5">
                            {/* Pricing Summary */}
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-center justify-between">
                                <div>
                                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Total Payable Fee</span>
                                    <span className="text-2xl font-black text-slate-900">₹{inrFee.toLocaleString()}</span>
                                    <span className="text-xs text-slate-500 font-medium ml-2">/ ${usdFee} USD</span>
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                                        <CheckCircle size={13} /> 100% Verified Batch
                                    </span>
                                </div>
                            </div>

                            {/* Payment Options Selection */}
                            <div className="space-y-3">
                                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                                    Choose Payment Method:
                                </label>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {/* Razorpay Option */}
                                    <div
                                        onClick={() => setSelectedMethod('razorpay')}
                                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedMethod === 'razorpay'
                                                ? 'border-blue-600 bg-blue-50/60 shadow-md shadow-blue-500/10'
                                                : 'border-slate-200 hover:border-slate-300 bg-white'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                                                <CreditCard size={17} className="text-blue-600" />
                                                Razorpay (India)
                                            </span>
                                            {selectedMethod === 'razorpay' && (
                                                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-slate-500 leading-tight">
                                            UPI, Google Pay, PhonePe, Cards, NetBanking (INR)
                                        </p>
                                        <div className="mt-2 text-xs font-bold text-blue-700">₹{inrFee.toLocaleString()} INR</div>
                                    </div>

                                    {/* PayPal Option */}
                                    <div
                                        onClick={() => setSelectedMethod('paypal')}
                                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedMethod === 'paypal'
                                                ? 'border-indigo-600 bg-indigo-50/60 shadow-md shadow-indigo-500/10'
                                                : 'border-slate-200 hover:border-slate-300 bg-white'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                                                <Globe size={17} className="text-indigo-600" />
                                                PayPal (Global)
                                            </span>
                                            {selectedMethod === 'paypal' && (
                                                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-slate-500 leading-tight">
                                            International Cards, PayPal Balance, Multi-Currency
                                        </p>
                                        <div className="mt-2 text-xs font-bold text-indigo-700">${usdFee} USD</div>
                                    </div>
                                </div>
                            </div>

                            {/* Action / Checkout Area */}
                            <div className="pt-2">
                                {selectedMethod === 'razorpay' ? (
                                    <button
                                        onClick={handleRazorpayPayment}
                                        disabled={loading}
                                        className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                                    >
                                        {loading ? "Processing Payment..." : `Proceed to Pay ₹${inrFee.toLocaleString()} via Razorpay`}
                                    </button>
                                ) : (
                                    <div className="space-y-3">
                                        <div ref={paypalContainerRef} className="min-h-[50px] flex items-center justify-center">
                                            {!paypalReady && (
                                                <div className="py-3 text-xs text-slate-500 flex items-center gap-2">
                                                    <span className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
                                                    Loading PayPal International Checkout...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer Guarantee */}
                            <div className="flex items-center justify-center gap-4 pt-2 text-[11px] text-slate-500 border-t border-slate-100">
                                <span className="flex items-center gap-1">
                                    <ShieldCheck size={14} className="text-emerald-600" /> 256-Bit SSL Encrypted
                                </span>
                                <span>•</span>
                                <span>Instant LMS Access</span>
                                <span>•</span>
                                <span>ISO 9001:2015 Quality Verified</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EnrollButton;
