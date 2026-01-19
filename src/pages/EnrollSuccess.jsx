import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const EnrollSuccess = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center border border-slate-100"
            >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
                </div>

                <h1 className="text-2xl font-bold text-slate-900 mb-2">Enrollment Successful!</h1>
                <p className="text-slate-500 mb-8">
                    You have successfully enrolled in the course. Welcome aboard!
                </p>

                <div className="space-y-3">
                    <Link
                        to="/studentdashboard"
                        className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-blue-500/20"
                    >
                        Go to Dashboard
                    </Link>
                    <Link
                        to="/studentdashboard/courses"
                        className="block w-full bg-white text-slate-700 font-bold py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                        Browse More Courses
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default EnrollSuccess;
