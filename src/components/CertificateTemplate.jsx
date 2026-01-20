import React, { forwardRef } from 'react';


const CertificateTemplate = forwardRef(({ studentName, courseName, date, duration }, ref) => {
    return (
        <div ref={ref} className="w-[800px] h-[600px] relative bg-white overflow-hidden shadow-2xl flex flex-col text-slate-900 border-[10px] border-slate-900">

            {/* Top Section - Dark Header */}
            <div className="h-1/3 bg-slate-900 flex justify-between items-start p-12">
                <div className="border-l-4 border-white pl-6">
                    <h1 className="text-4xl font-bold text-white tracking-widest uppercase mb-2">Certificate</h1>
                    <h2 className="text-2xl font-semibold text-white/90 uppercase tracking-wide">Of Excellence</h2>
                    <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest">This certificate is awarded to</p>
                </div>

                {/* Company Logo - White Version or as is if image allows */}
                <div className="bg-white p-2 rounded-lg">
                    <img src="/tsar-logo.jpg" alt="TSAR IT PVT LTD" className="h-16 object-contain" />
                </div>
            </div>

            {/* Main Body */}
            <div className="flex-1 p-12 relative">
                <div className="mt-4">
                    <h3 className="text-4xl font-bold text-slate-800 font-serif mb-6">{studentName}</h3>

                    <div className="text-gray-600 mb-8 space-y-1">
                        <p>In recognition of the completion of the tutorial: <span className="font-bold text-slate-900">{courseName}</span></p>
                        <p>Following are the learning items, which are covered in this tutorial</p>
                    </div>

                    <div className="flex items-center gap-6 text-sm font-semibold text-slate-700 mb-12">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            </div>
                            <span>Video Tutorials</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-red-600/10 flex items-center justify-center text-red-600">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
                            </div>
                            <span>Modules Setup</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
                    <div>
                        {/* Signature Mock */}
                        <div className="mb-2">
                            <div className="h-12 w-32 relative">
                                <div className="absolute inset-0 flex items-end">
                                    <svg viewBox="0 0 150 60" className="w-full h-full text-slate-800" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M10,50 Q40,10 60,40 T120,20" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <p className="font-bold text-slate-800">Admin</p>
                        <p className="text-xs text-slate-500 font-bold flex items-center gap-1">
                            Co-founder <span className="text-blue-600">TSAR IT PVT LTD</span>
                        </p>
                    </div>

                    <div className="flex flex-col items-end">
                        <p className="text-slate-600 font-medium mb-4">{date}</p>
                        {/* Seal Stamp */}
                        <div className="w-24 h-24 border-4 border-blue-600 rounded-full flex items-center justify-center relative transform rotate-[-15deg]">
                            <div className="absolute inset-1 border border-blue-600 rounded-full"></div>
                            <div className="text-center">
                                <p className="text-[8px] font-bold text-blue-600 tracking-widest uppercase">Certificate of</p>
                                <p className="text-xs font-bold text-blue-800 uppercase">Excellence</p>
                                <div className="w-full h-[1px] bg-blue-600 my-1"></div>
                                <p className="text-[8px] font-bold text-blue-600 tracking-widest uppercase">By TSAR IT</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

CertificateTemplate.displayName = "CertificateTemplate";

export default CertificateTemplate;
