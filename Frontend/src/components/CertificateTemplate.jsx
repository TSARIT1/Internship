import React, { forwardRef } from 'react';
import { ShieldCheck, Award, CheckCircle2, QrCode } from 'lucide-react';

const CertificateTemplate = forwardRef(({ 
    studentName = 'Student Name', 
    courseName = 'Data Science & Artificial Intelligence', 
    date = '2026-08-28', 
    duration = '6 Months', 
    certificateId = 'TSAR-2026-DS-88492' 
}, ref) => {
    return (
        <div 
            ref={ref} 
            className="w-[1050px] h-[740px] bg-gradient-to-br from-slate-50 via-white to-amber-50/30 text-slate-900 relative p-8 select-none overflow-hidden font-sans border-[12px] border-slate-900 shadow-2xl"
            style={{ boxSizing: 'border-box' }}
        >
            {/* Inner Double Gold/Blue Border */}
            <div className="w-full h-full border-4 border-amber-600/60 p-6 relative flex flex-col justify-between bg-white/80 backdrop-blur-xs">
                
                {/* Decorative Corner Ornaments */}
                <div className="absolute top-2 left-2 w-12 h-12 border-t-4 border-l-4 border-amber-600"></div>
                <div className="absolute top-2 right-2 w-12 h-12 border-t-4 border-r-4 border-amber-600"></div>
                <div className="absolute bottom-2 left-2 w-12 h-12 border-b-4 border-l-4 border-amber-600"></div>
                <div className="absolute bottom-2 right-2 w-12 h-12 border-b-4 border-r-4 border-amber-600"></div>

                {/* Background Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                    <span className="text-[180px] font-black tracking-widest text-slate-950 font-serif">TSAR IT</span>
                </div>

                {/* Header Section */}
                <div className="flex items-center justify-between border-b-2 border-slate-200/80 pb-4 relative z-10">
                    {/* Brand Logo & Organization */}
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-teal-500 flex items-center justify-center text-white font-black text-2xl shadow-md">
                            TS
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 leading-tight font-serif">
                                TSAR <span className="text-blue-600">IT</span> INTERNSHIP
                            </h2>
                            <p className="text-[10px] uppercase font-extrabold tracking-widest text-slate-500">
                                Govt. of India MSME Registered Technical Organization
                            </p>
                        </div>
                    </div>

                    {/* Certificate Badge */}
                    <div className="text-right">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/80 border border-amber-300 rounded-full text-amber-900 text-xs font-black uppercase tracking-wider">
                            <ShieldCheck size={14} className="text-amber-700" />
                            <span>ISO 9001:2015 & MSME Certified</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono mt-1 font-bold">
                            Credential ID: <span className="text-blue-700">{certificateId}</span>
                        </p>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="text-center my-auto py-2 relative z-10">
                    <div className="inline-block mb-1">
                        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-[0.25em] font-serif border-b-2 border-amber-500 pb-1">
                            Certificate of Technical Internship
                        </h1>
                        <p className="text-xs uppercase font-extrabold text-amber-700 tracking-widest mt-1">
                            Excellence & Industry Capstone Mastery
                        </p>
                    </div>

                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-4">
                        This is to proudly certify that
                    </p>

                    {/* Recipient Name */}
                    <div className="my-2">
                        <h3 className="text-4xl font-black text-slate-900 font-serif tracking-wide border-b-2 border-dashed border-slate-300 inline-block px-8 py-1">
                            {studentName}
                        </h3>
                    </div>

                    {/* Description & Course */}
                    <div className="max-w-2xl mx-auto text-slate-700 text-sm leading-relaxed mt-2 space-y-1">
                        <p>
                            has successfully completed the intensive technical training and enterprise internship program in
                        </p>
                        <p className="text-xl font-black text-blue-700 font-serif">
                            {courseName}
                        </p>
                        <p className="text-xs text-slate-500">
                            covering enterprise production architecture, live industry capstone projects, code review sprints, and practical evaluations over a period of <strong>{duration}</strong>.
                        </p>
                    </div>
                </div>

                {/* Footer / Signatures / Seals */}
                <div className="flex items-end justify-between border-t-2 border-slate-200/80 pt-4 relative z-10">
                    
                    {/* Left: Issue Date & Verification */}
                    <div className="text-left space-y-1">
                        <div className="text-xs text-slate-600">
                            <span className="font-bold">Issue Date:</span> {date}
                        </div>
                        <div className="text-xs text-slate-600">
                            <span className="font-bold">Accreditation:</span> MSME Reg. No. UDYAM-AP-03
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                            Verify online: internship.tsaritservices.com/verify-certificate/{certificateId}
                        </div>
                    </div>

                    {/* Center: Gold Foil Official Stamp / Seal */}
                    <div className="flex flex-col items-center justify-center">
                        <div className="w-24 h-24 rounded-full border-4 border-amber-600 bg-gradient-to-br from-amber-500 via-yellow-400 to-amber-600 p-1 shadow-lg shadow-amber-500/20 flex items-center justify-center text-center transform rotate-[-8deg]">
                            <div className="w-full h-full rounded-full border-2 border-dashed border-amber-900 flex flex-col items-center justify-center text-slate-950 px-1">
                                <Award size={18} className="text-slate-950 mb-0.5" />
                                <span className="text-[7px] font-black uppercase tracking-widest leading-none">TSAR IT</span>
                                <span className="text-[9px] font-black uppercase tracking-wider leading-tight">OFFICIAL SEAL</span>
                                <span className="text-[6px] font-extrabold uppercase tracking-widest">VERIFIED 2026</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Authorized Signatures */}
                    <div className="flex items-center gap-8">
                        {/* Signature 1 */}
                        <div className="text-center">
                            <div className="h-10 w-28 flex items-end justify-center mb-1">
                                <svg viewBox="0 0 140 40" className="w-full h-full text-slate-800" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M10,25 Q35,5 60,30 T110,15 T130,28" />
                                </svg>
                            </div>
                            <div className="w-32 h-[1.5px] bg-slate-400 mb-1"></div>
                            <p className="text-xs font-black text-slate-900">Dr. Rakesh K.</p>
                            <p className="text-[9px] font-bold text-slate-500 uppercase">Head of Academics</p>
                        </div>

                        {/* Signature 2 */}
                        <div className="text-center">
                            <div className="h-10 w-28 flex items-end justify-center mb-1">
                                <svg viewBox="0 0 140 40" className="w-full h-full text-blue-900" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M15,30 Q45,2 75,32 T120,8 T135,22" />
                                </svg>
                            </div>
                            <div className="w-32 h-[1.5px] bg-slate-400 mb-1"></div>
                            <p className="text-xs font-black text-slate-900">Director</p>
                            <p className="text-[9px] font-bold text-slate-500 uppercase">TSAR IT Pvt Ltd</p>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
});

CertificateTemplate.displayName = "CertificateTemplate";

export default CertificateTemplate;
