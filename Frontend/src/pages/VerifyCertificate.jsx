import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    Award, 
    CheckCircle2, 
    XCircle, 
    ShieldCheck, 
    Search, 
    ExternalLink, 
    Building2, 
    Calendar, 
    User, 
    BookOpen,
    ArrowLeft,
    Check
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { verifyCertificateApi } from '../services/studentApi';

const VerifyCertificate = () => {
    const { certificateId: paramCertId } = useParams();
    const navigate = useNavigate();
    const [searchId, setSearchId] = useState(paramCertId || '');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleVerify = async (idToVerify) => {
        const queryId = (idToVerify || searchId || '').trim();
        if (!queryId) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await verifyCertificateApi(queryId);
            if (res.success && res.data) {
                setResult(res.data);
            } else {
                setError(res.message || 'No official certificate record found matching this Credential ID.');
            }
        } catch (err) {
            setError('Unable to verify certificate at this time. Please check the ID or contact support.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (paramCertId) {
            setSearchId(paramCertId);
            handleVerify(paramCertId);
        }
    }, [paramCertId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchId.trim()) {
            navigate(`/verify-certificate/${encodeURIComponent(searchId.trim())}`);
            handleVerify(searchId.trim());
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <SEO 
                title="Verify Official Internship Certificate | TSAR IT INTERNSHIP"
                description="Verify the authenticity of TSAR IT INTERNSHIP certificates and credentials issued under Govt. MSME standards."
            />
            <Header />

            <main className="flex-1 pt-32 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto space-y-8">
                    
                    {/* Header */}
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-wider">
                            <ShieldCheck size={16} />
                            <span>Govt. MSME Credential Registry</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-display">
                            Verify Certificate Authenticity
                        </h1>
                        <p className="text-sm text-slate-600 max-w-lg mx-auto">
                            Enter the unique Certificate Credential ID (e.g. <span className="font-mono font-bold text-slate-800">TSAR-2026-DS-XXXX</span>) to validate student credentials, coursework, and issuance dates.
                        </p>
                    </div>

                    {/* Search Input Box */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200">
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter Certificate ID (e.g. TSAR-2026-DS-88492)..."
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono focus:outline-none focus:border-blue-600 focus:bg-white text-slate-900 uppercase tracking-wider"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="py-3.5 px-8 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                            >
                                {loading ? "Verifying..." : "Verify Now"}
                            </button>
                        </form>
                    </div>

                    {/* Verification Result Area */}
                    {loading && (
                        <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center space-y-3">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                            <p className="text-sm text-slate-600 font-bold">Querying official credential registry...</p>
                        </div>
                    )}

                    {result && (
                        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-emerald-200 shadow-xl relative overflow-hidden animate-fadeIn">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-60 pointer-events-none"></div>

                            <div className="flex items-center gap-3 border-b border-slate-100 pb-6 mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                                    <CheckCircle2 size={32} />
                                </div>
                                <div>
                                    <span className="text-xs font-black text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full uppercase tracking-wider">
                                        Authentic & Verified Credential
                                    </span>
                                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                                        Certificate Verified
                                    </h2>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Student / Recipient</span>
                                    <strong className="text-slate-900 text-base">{result.studentName}</strong>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Credential ID</span>
                                    <span className="font-mono font-bold text-blue-700 text-base">{result.certificateId}</span>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Course / Technical Specialization</span>
                                    <strong className="text-slate-900">{result.courseName}</strong>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Official Issue Date</span>
                                    <strong className="text-slate-900">{result.issueDate}</strong>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Issuing Organization</span>
                                    <strong className="text-slate-900">{result.organization || "TSAR IT Services Pvt Ltd"}</strong>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Government Recognition</span>
                                    <strong className="text-emerald-700">{result.accreditation || "Govt. of India MSME Registered"}</strong>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={16} className="text-teal-600" />
                                    <span>Certified digital record secured by TSAR IT Central Authentication Service</span>
                                </div>
                                <Link to="/" className="text-blue-600 font-bold hover:underline">
                                    Visit TSAR IT INTERNSHIP →
                                </Link>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-white rounded-3xl p-8 border border-red-200 shadow-xl text-center space-y-3 animate-fadeIn">
                            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                                <XCircle size={28} />
                            </div>
                            <h3 className="text-lg font-black text-slate-900">Certificate Not Found</h3>
                            <p className="text-xs text-slate-500 max-w-md mx-auto">{error}</p>
                        </div>
                    )}

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default VerifyCertificate;
