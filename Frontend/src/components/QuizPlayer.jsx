import React, { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const QuizPlayer = ({ quiz, studentId, onComplete }) => {
    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
                <p className="text-slate-500">This quiz has no questions available.</p>
            </div>
        );
    }

    const [currentQuestion, setCurrentQuestion] = useState(0);
    // Initialize answers based on the VALID questions array
    const [answers, setAnswers] = useState(Array(quiz.questions.length).fill(null));
    const [result, setResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const handleOptionSelect = (optionIndex) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = optionIndex;
        setAnswers(newAnswers);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const res = await axios.post(`${API_URL}/quizzes/${quiz.id}/submit`, {
                userId: studentId,
                answers: answers
            });
            setResult(res.data);
            if (onComplete) onComplete(res.data);
        } catch (error) {
            console.error("Quiz submission failed", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (result) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <div className="mb-4 flex justify-center">
                    {result.score / result.totalQuestions >= 0.7 ? (
                        <CheckCircle size={64} className="text-green-500" />
                    ) : (
                        <XCircle size={64} className="text-orange-500" />
                    )}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Quiz Completed!</h2>
                <p className="text-lg text-slate-600 mb-6">You scored <span className="font-bold text-blue-600">{result.score}</span> out of {result.totalQuestions}</p>
                <div className="w-full bg-slate-100 rounded-full h-4 mb-6">
                    <div
                        className={`h-4 rounded-full ${result.score / result.totalQuestions >= 0.7 ? 'bg-green-500' : 'bg-orange-500'}`}
                        style={{ width: `${(result.score / result.totalQuestions) * 100}%` }}
                    ></div>
                </div>
                <button onClick={() => { setResult(null); setCurrentQuestion(0); setAnswers(Array(quiz.questions.length).fill(null)); }} className="text-blue-600 font-semibold hover:underline">
                    Retake Quiz
                </button>
            </div>
        );
    }

    const question = quiz.questions[currentQuestion];

    if (!question) {
        return <div className="text-red-500">Error loading question.</div>;
    }

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">{quiz.title}</h3>
                <span className="text-sm font-medium text-slate-500">Question {currentQuestion + 1} / {quiz.questions.length}</span>
            </div>

            <div className="mb-8">
                <p className="text-lg text-slate-800 font-medium mb-6">{question.questionText}</p>
                <div className="space-y-3">
                    {question.options && question.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleOptionSelect(idx)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${answers[currentQuestion] === idx
                                ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium'
                                : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50 text-slate-600'
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-100">
                <button
                    disabled={currentQuestion === 0}
                    onClick={() => setCurrentQuestion(prev => prev - 1)}
                    className="px-6 py-2 text-slate-600 font-medium disabled:opacity-50 hover:bg-slate-50 rounded-lg transition-colors"
                >
                    Previous
                </button>

                {currentQuestion < quiz.questions.length - 1 ? (
                    <button
                        onClick={() => setCurrentQuestion(prev => prev + 1)}
                        className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                    >
                        Next
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="bg-green-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-sm shadow-green-200 disabled:opacity-70"
                    >
                        {submitting ? 'Submitting...' : 'Submit Quiz'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default QuizPlayer;
