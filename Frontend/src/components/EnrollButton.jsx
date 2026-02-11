import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { applyForInternship, checkEnrollmentStatus } from '../services/studentApi';
import useCoursePricing from '../hooks/usePricing';
import { loadRazorpay } from '../utils/razorpay';

const EnrollButton = ({ className, children, course }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { finalFee, loading: pricingLoading } = useCoursePricing(course);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [checkingEnrollment, setCheckingEnrollment] = useState(true);

    React.useEffect(() => {
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

    const handleEnroll = async () => {
        const token = sessionStorage.getItem('token');
        const student = JSON.parse(sessionStorage.getItem('student') || 'null');

        // Check for token, student existence, and ensure student is not an empty object
        if (!token || !student || !student.id) {
            if (course) {
                sessionStorage.setItem('pendingEnrollment', course);
            }
            sessionStorage.setItem('redirectAfterLogin', '/enroll-success');
            navigate('/login');
        } else {
            // Profile Validation
            if (!student.phone || !/^\d{10}$/.test(student.phone)) {
                alert("Please complete your profile with a valid 10-digit phone number before enrolling.");
                navigate('/studentdashboard/profile');
                return;
            }
            if (!student.name && !student.username) {
                alert("Please complete your profile with your name.");
                navigate('/studentdashboard/profile');
                return;
            }

            if (course) {
                // Payment Flow
                setLoading(true);

                // Double check enrollment just in case
                if (isEnrolled) {
                    alert("You are already enrolled!");
                    setLoading(false);
                    return;
                }


                const res = await loadRazorpay();

                if (!res) {
                    alert('Razorpay SDK failed to load. Are you online?');
                    setLoading(false);
                    return;
                }

                // Get student info for prefill
                let student = {};
                try {
                    student = JSON.parse(sessionStorage.getItem('student') || '{}');
                } catch (e) { console.error(e); }

                const apiKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
                if (!apiKey) {
                    alert("Razorpay Key ID is missing. Please check your .env file and restart the server.");
                    setLoading(false);
                    return;
                }

                const options = {
                    key: apiKey,  // Key from .env
                    amount: (finalFee || 5000) * 100, // Amount is in currency subunits. Default 5000 INR if loading fails
                    currency: "INR",
                    name: "TSAR IT Services",
                    description: `Enrollment for ${course}`,
                    image: "https://example.com/your_logo", // You can replace this with your logo URL
                    handler: async function (response) {
                        // Payment Successful, proceed to enroll
                        try {
                            // In a real app, verify signature on backend here
                            // await verifyPayment(response); 

                            if (student.id) {
                                const updateRes = await applyForInternship(student.id, course, response);
                                if (updateRes.success) {
                                    sessionStorage.setItem('student', JSON.stringify(updateRes.data));
                                    // Optional: Save transaction ID to student record
                                } else {
                                    alert(updateRes.message || "Enrollment failed. You might already be enrolled.");
                                    setLoading(false);
                                    return;
                                }
                            }
                            navigate('/enroll-success');
                        } catch (err) {
                            console.error("Enrollment error", err);
                            // improved error message
                            const msg = err.response?.data || err.message || "Enrollment failed after payment.";
                            alert(`Error: ${msg}`);
                        } finally {
                            setLoading(false);
                        }
                    },
                    prefill: {
                        name: student.name || "Student Name",
                        email: student.email || "student@example.com",
                        contact: student.phone || "9999999999"
                    },
                    notes: {
                        address: "Razorpay Corporate Office"
                    },
                    theme: {
                        color: "#2563EB"
                    }
                };

                const paymentObject = new window.Razorpay(options);
                paymentObject.open();

                // Note: setLoading(false) isn't called immediately here because we wait for user action in modal
                // Ideally we handle modal close event to stop loading, but Razorpay JS doesn't expose a clean 'close' promise easily without handlers.
                // For this implementation, the loading spinner might stay until modal opens.
                // To fix "stuck" loading if they close modal:
                paymentObject.on('payment.failed', function (response) {
                    alert(response.error.description);
                    setLoading(false);
                });

            } else {
                navigate('/studentdashboard');
            }
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
        <button
            onClick={handleEnroll}
            disabled={loading || checkingEnrollment}
            className={className || "bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-orange-600/30 flex items-center gap-2"}
        >
            {loading ? "Processing..." : (children || <>Enroll Now <ArrowRight size={20} /></>)}
        </button>
    );
};

export default EnrollButton;
