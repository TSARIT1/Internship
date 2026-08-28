import React, { useEffect, useState, useRef } from 'react';
import { getMyEnrollments } from '../../services/studentApi';
import { Award, Download, CheckCircle, Clock, ShieldCheck, Sparkles, BookOpen, Eye, Printer, X, ExternalLink } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import CertificateTemplate from '../../components/CertificateTemplate';
import { useNavigate } from 'react-router-dom';
import { formatStudentId } from '../../utils/studentUtils';

const StudentCertificates = () => {
    const navigate = useNavigate();
    const student = JSON.parse(sessionStorage.getItem('student') || '{}');
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState(null);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [selectedCert, setSelectedCert] = useState(null);
    const certificateRef = useRef(null);

    const [certificateData, setCertificateData] = useState({
        studentName: student.name || student.username || 'Student',
        courseName: 'Internship Program',
        date: new Date().toLocaleDateString(),
        certificateId: 'TSAR-2026-DS-001',
        duration: '6 Months'
    });

    useEffect(() => {
        const fetchEnrollments = async () => {
            if (!student.id) {
                setLoading(false);
                return;
            }
            try {
                const res = await getMyEnrollments(student.id);
                if (res.success) {
                    setEnrollments(res.data || []);
                }
            } catch (err) {
                console.error("Failed to load certificates", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEnrollments();
    }, [student.id]);

    const handleDownload = async (item) => {
        setDownloadingId(item.id);
        const certId = item.certificateId || `TSAR-2026-${item.courseName?.substring(0, 2).toUpperCase() || 'IT'}-${item.id}${Math.floor(1000 + Math.random() * 9000)}`;
        
        setCertificateData({
            studentName: student.name || student.username || 'Student',
            courseName: item.courseName,
            date: item.certificateDate || new Date().toISOString().split('T')[0],
            certificateId: certId,
            duration: item.duration || '6 Months'
        });

        await new Promise(resolve => setTimeout(resolve, 600));

        try {
            if (!certificateRef.current) return;
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            const sName = (student?.name || "Student").replace(/\s+/g, '_');
            const cName = (item?.courseName || "Course").replace(/\s+/g, '_');
            pdf.save(`${sName}_${cName}_TSAR_IT_Verified_Certificate.pdf`);
        } catch (error) {
            console.error("Certificate download failed", error);
            alert("Could not generate certificate PDF. Please try again.");
        } finally {
            setDownloadingId(null);
        }
    };

    const openPreview = (item) => {
        const certId = item.certificateId || `TSAR-2026-${item.courseName?.substring(0, 2).toUpperCase() || 'IT'}-${item.id}${Math.floor(1000 + Math.random() * 9000)}`;
        setSelectedCert({
            studentName: student.name || student.username || 'Student',
            courseName: item.courseName,
            date: item.certificateDate || new Date().toISOString().split('T')[0],
            certificateId: certId,
            duration: item.duration || '6 Months',
            rawItem: item
        });
        setCertificateData({
            studentName: student.name || student.username || 'Student',
            courseName: item.courseName,
            date: item.certificateDate || new Date().toISOString().split('T')[0],
            certificateId: certId,
            duration: item.duration || '6 Months'
        });
        setPreviewModalOpen(true);
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Award className="w-8 h-8 text-amber-500" />
                        My Certificates & Credentials
                    </h1>
                    <p className="text-slate-500 mt-1 text-sm">Download, preview, and share your official TSAR IT INTERNSHIP verified certificates.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold rounded-full">
                        <ShieldCheck size={16} />
                        <span>Verified Credential</span>
                    </span>
                </div>
            </div>

            {/* Certificate Cards Grid */}
            {loading ? (
                <div className="p-12 text-center text-slate-400">Loading your credentials...</div>
            ) : enrollments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {enrollments.map((item) => {
                        const isIssued = item.certificateIssued || true; // Demo active for enrolled students
                        const certId = item.certificateId || `TSAR-2026-${item.courseName?.substring(0, 2).toUpperCase() || 'IT'}-${item.id}`;

                        return (
                            <div
                                key={item.id}
                                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                            >
                                <div className="absolute top-0 right-0 w-36 h-36 bg-amber-50 rounded-full -mr-12 -mt-12 opacity-70 pointer-events-none"></div>

                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-700 flex items-center justify-center font-bold shadow-inner">
                                            <Award size={24} />
                                        </div>
                                        <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-800 bg-emerald-100/90 px-3 py-1 rounded-full uppercase tracking-wider">
                                            <CheckCircle size={13} /> {item.certificateIssued ? "Official Certificate Issued" : "Certified Batch"}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-black text-slate-900 mb-1">{item.courseName}</h3>
                                    <p className="text-xs text-slate-500 mb-4">TSAR IT INTERNSHIP • Premier Technical Organization</p>

                                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6 space-y-2 text-xs">
                                        <div className="flex justify-between text-slate-600">
                                            <span>Recipient:</span>
                                            <strong className="text-slate-900">{student.name || student.username || 'Student'}</strong>
                                        </div>
                                        <div className="flex justify-between text-slate-600">
                                            <span>Student ID:</span>
                                            <span className="font-mono font-bold text-slate-700">{formatStudentId(student.id)}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-600">
                                            <span>Certificate ID:</span>
                                            <span className="font-mono font-bold text-blue-700">{certId}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-600">
                                            <span>Issue Date:</span>
                                            <strong>{item.certificateDate || new Date().toISOString().split('T')[0]}</strong>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                                    <button
                                        onClick={() => openPreview(item)}
                                        className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                        <Eye size={15} />
                                        <span>Preview & Print</span>
                                    </button>

                                    <button
                                        onClick={() => handleDownload(item)}
                                        disabled={downloadingId === item.id}
                                        className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                                    >
                                        <Download size={15} />
                                        <span>{downloadingId === item.id ? "Generating PDF..." : "Download Official PDF"}</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
                    <Award className="w-16 h-16 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-slate-900">No Certificates Available Yet</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-6">
                        Enroll in an internship course and complete your learning milestones to earn verifiable certificates.
                    </p>
                    <button
                        onClick={() => navigate('/studentdashboard/courses')}
                        className="px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 shadow-md transition-all cursor-pointer"
                    >
                        Explore Internship Programs
                    </button>
                </div>
            )}

            {/* Certificate Preview Modal */}
            {previewModalOpen && selectedCert && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full p-6 relative max-h-[95vh] overflow-y-auto flex flex-col items-center">
                        <div className="w-full flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                            <div>
                                <h3 className="text-lg font-black text-slate-900">Official Certificate Preview</h3>
                                <p className="text-xs text-slate-500">ID: {selectedCert.certificateId}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleDownload(selectedCert.rawItem || selectedCert)}
                                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                                >
                                    <Download size={14} /> Download PDF
                                </button>
                                <button
                                    onClick={() => setPreviewModalOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Certificate Render container scaled for preview */}
                        <div className="w-full overflow-x-auto flex justify-center py-4 bg-slate-100 rounded-2xl p-4">
                            <div className="transform scale-[0.6] sm:scale-[0.75] md:scale-[0.9] origin-top my-[-60px] sm:my-[-40px]">
                                <CertificateTemplate
                                    studentName={selectedCert.studentName}
                                    courseName={selectedCert.courseName}
                                    date={selectedCert.date}
                                    certificateId={selectedCert.certificateId}
                                    duration={selectedCert.duration}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Hidden Certificate Template for PDF Rendering */}
            <div className="absolute top-0 left-0 -z-50 opacity-0 pointer-events-none" style={{ position: 'fixed', left: '-9999px' }}>
                <CertificateTemplate
                    ref={certificateRef}
                    studentName={certificateData.studentName}
                    courseName={certificateData.courseName}
                    date={certificateData.date}
                    certificateId={certificateData.certificateId}
                    duration={certificateData.duration}
                />
            </div>
        </div>
    );
};

export default StudentCertificates;
