import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const EnrollButton = ({ className, children }) => {
    const navigate = useNavigate();

    const handleEnroll = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            localStorage.setItem('redirectAfterLogin', '/enroll-success');
            navigate('/login');
        } else {
            navigate('/enroll-success');
        }
    };

    return (
        <button
            onClick={handleEnroll}
            className={className || "bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-orange-600/30 flex items-center gap-2"}
        >
            {children || <>Enroll Now <ArrowRight size={20} /></>}
        </button>
    );
};

export default EnrollButton;
