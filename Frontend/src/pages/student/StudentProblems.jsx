
import React, { useEffect, useState } from 'react';
import { getProblems } from '../../services/problemApi';
import { Link } from 'react-router-dom';
import { Code, ArrowRight, CheckCircle, Clock, Zap } from 'lucide-react';

const StudentProblems = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProblems();
    }, []);

    const loadProblems = async () => {
        try {
            const response = await getProblems();
            if (response.success) {
                // Optionally filter: only show problems NOT linked to a hackathon?
                // Or show all. Let's show all for now, but mark them.
                setProblems(response.data || []);
            }
        } catch (error) {
            console.error("Failed to load problems", error);
        } finally {
            setLoading(false);
        }
    };

    const getDifficultyColor = (diff) => {
        switch (diff) {
            case 'Easy': return 'text-green-600 bg-green-100 border-green-200';
            case 'Medium': return 'text-amber-600 bg-amber-100 border-amber-200';
            case 'Hard': return 'text-red-600 bg-red-100 border-red-200';
            default: return 'text-slate-600 bg-slate-100 border-slate-200';
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                    <Code className="text-blue-600" size={32} />
                    Coding Practice
                </h1>
                <p className="text-slate-500 mt-2">Sharpen your skills with our collection of programming challenges.</p>
            </div>

            {loading ? (
                <div className="text-center py-12 text-slate-500">Loading problems...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {problems.length > 0 ? (
                        problems.map(problem => (
                            <div key={problem.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all group">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(problem.difficulty)}`}>
                                            {problem.difficulty}
                                        </span>
                                        {/* Placeholder for status if we track solved problems later */}
                                        {/* <CheckCircle size={18} className="text-slate-200" /> */}
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                        {problem.title}
                                    </h3>

                                    <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                                        {problem.description?.substring(0, 100)}...
                                    </p>

                                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-6">
                                        <div className="flex items-center gap-1">
                                            <Clock size={14} />
                                            <span>{problem.timeLimit}s</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Zap size={14} />
                                            <span>{problem.memoryLimit}MB</span>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/student/problem/${problem.id}`}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-50 text-slate-700 font-bold hover:bg-blue-600 hover:text-white transition-all"
                                    >
                                        Solve Challenge <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed text-slate-400">
                            <Code size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No practice problems available yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentProblems;
