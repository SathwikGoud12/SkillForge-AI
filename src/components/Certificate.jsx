import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Award, Download, CheckCircle2, Calendar, Hash } from "lucide-react";
import { toast } from "sonner";

const Certificate = ({ certificate, onDownload }) => {
    const certificateRef = useRef(null);

    const handleDownload = () => {
        if (onDownload) {
            onDownload(certificate);
        } else {
            // Default: Print as PDF
            window.print();
            toast.success("Certificate ready to print/save as PDF");
        }
    };

    const formattedDate = new Date(certificate.issuedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="certificate-container">
            {/* Certificate Card (Preview) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-slate-200 hover:shadow-xl transition-shadow"
            >
                {/* Header Strip */}
                <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

                {/* Certificate Preview */}
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                                <Award className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">{certificate.domainName}</h3>
                                <p className="text-sm text-slate-600">Certificate of Completion</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified
                        </div>
                    </div>

                    <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Calendar className="w-4 h-4" />
                            <span>Issued on {formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Hash className="w-4 h-4" />
                            <span className="font-mono">{certificate.certificateId}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleDownload}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                        <Download className="w-5 h-5" />
                        Download Certificate
                    </button>
                </div>
            </motion.div>

            {/* Printable Certificate (Hidden, for PDF) */}
            <div className="hidden print:block">
                <div ref={certificateRef} className="certificate-print">
                    <div className="w-[210mm] h-[297mm] mx-auto bg-white p-16 relative">
                        {/* Decorative Border */}
                        <div className="absolute inset-8 border-4 border-blue-600 rounded-lg"></div>
                        <div className="absolute inset-10 border border-blue-300 rounded-lg"></div>

                        {/* Content */}
                        <div className="relative h-full flex flex-col items-center justify-center text-center">
                            {/* Logo/Title */}
                            <div className="mb-8">
                                <h1 className="text-5xl font-bold text-slate-900 mb-2">SkillForge AI</h1>
                                <p className="text-lg text-slate-600">Learn & Build</p>
                            </div>

                            {/* Certificate Title */}
                            <div className="mb-12">
                                <h2 className="text-3xl font-serif text-slate-700 mb-4">Certificate of Completion</h2>
                                <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto"></div>
                            </div>

                            {/* Recipient */}
                            <div className="mb-12">
                                <p className="text-lg text-slate-600 mb-3">This is to certify that</p>
                                <h3 className="text-4xl font-bold text-slate-900 mb-3">{certificate.userName}</h3>
                                <p className="text-lg text-slate-600 mb-6">has successfully completed</p>
                                <h4 className="text-3xl font-semibold text-blue-600">{certificate.domainName}</h4>
                            </div>

                            {/* Verification Statement */}
                            <div className="mb-12 max-w-2xl">
                                <p className="text-slate-600 leading-relaxed">
                                    This certificate verifies that the recipient has demonstrated proficiency
                                    by completing all topics, assessments, and projects in this domain with
                                    verified excellence.
                                </p>
                            </div>

                            {/* Footer Info */}
                            <div className="flex items-center justify-between w-full max-w-2xl mt-auto">
                                <div className="text-left">
                                    <p className="text-sm text-slate-600 mb-1">Issue Date</p>
                                    <p className="font-semibold text-slate-900">{formattedDate}</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mb-2 mx-auto">
                                        <Award className="w-8 h-8 text-white" />
                                    </div>
                                    <p className="text-xs text-slate-500">Verified Certificate</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-slate-600 mb-1">Certificate ID</p>
                                    <p className="font-mono text-sm font-semibold text-slate-900">{certificate.certificateId}</p>
                                </div>
                            </div>

                            {/* Verification URL */}
                            <div className="mt-8">
                                <p className="text-xs text-slate-500">
                                    Verify this certificate at: skillforge.ai/verify/{certificate.certificateId}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Certificate;
