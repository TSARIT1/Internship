import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { applyForInternship } from '../services/studentApi';

const EnrollButton = ({ className, children, course }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleEnroll = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            if (course) {
                localStorage.setItem('pendingEnrollment', course);
            }
            localStorage.setItem('redirectAfterLogin', '/enroll-success');
            navigate('/login');
        } else {
            if (course) {
                setLoading(true);
                try {
                    const student = JSON.parse(localStorage.getItem('student') || '{}');
                    if (student.id) {
                        const updateRes = await applyForInternship(student.id, course);
                        if (updateRes.success) {
                            localStorage.setItem('student', JSON.stringify(updateRes.data));
                        }
                    }
                    navigate('/enroll-success');
                } catch (err) {
                    console.error("Enrollment error", err);
                    navigate('/enroll-success');
                } finally {
                    setLoading(false);
                }
            } else {
                navigate('/enroll-success');
            }
        }
    };

    return (
        <button
            onClick={handleEnroll}
            disabled={loading}
            className={className || "bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-orange-600/30 flex items-center gap-2"}
        >
            {loading ? "Processing..." : (children || <>Enroll Now <ArrowRight size={20} /></>)}
        </button>
    );
};

export default EnrollButton;
