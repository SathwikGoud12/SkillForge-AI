import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, Download, CheckCircle2, Calendar, Hash, Loader } from "lucide-react";
import { toast } from "sonner";
import CertificateService from "@/appwrite/CertificateService";
import AppwriteAccount from "@/appwrite/Account.services";
import Certificate from "@/components/Certificate";

const certificateService = new CertificateService();
const account = new AppwriteAccount();

const MyCertificates = () => {
    const [certificates, setcertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        loadCertificates();
    }, []);

    const loadCertificates = async () => {
        setLoading(true);
        try {
            const currentUser = await account.getAppwriteUser();
            setUser(currentUser);

            const userCertificates = await certificateService.getUserCertificates(currentUser.$id);
            setcertificates(userCertificates);
        } catch (error) {
            console.error("Error loading certificates:", error);
            toast.error("Failed to load certificates");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (certificate) => {
        // Trigger print dialog
        window.print();
        toast.success("Certificate ready to download");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                            <Award className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">My Certificates</h1>
                            <p className="text-slate-600">Your verified achievements</p>
                        </div>
                    </div>
                </motion.div>

                {/* Stats */}
                {certificates.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
                    >
                        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 mb-1">Total Certificates</p>
                                    <p className="text-3xl font-bold text-blue-600">{certificates.length}</p>
                                </div>
                                <Award className="w-10 h-10 text-blue-600 opacity-20" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 mb-1">Verified Domains</p>
                                    <p className="text-3xl font-bold text-green-600">{certificates.length}</p>
                                </div>
                                <CheckCircle2 className="w-10 h-10 text-green-600 opacity-20" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 mb-1">Latest Certificate</p>
                                    <p className="text-sm font-semibold text-purple-600">
                                        {certificateService.formatCertificateDate(certificates[0].issuedAt)}
                                    </p>
                                </div>
                                <Calendar className="w-10 h-10 text-purple-600 opacity-20" />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Certificates Grid */}
                {certificates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {certificates.map((cert, index) => (
                            <motion.div
                                key={cert.$id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                            >
                                <Certificate certificate={cert} onDownload={handleDownload} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-lg p-12 text-center"
                    >
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mx-auto mb-6">
                            <Award className="w-12 h-12 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">No Certificates Yet</h2>
                        <p className="text-slate-600 mb-6 max-w-md mx-auto">
                            Complete a domain to earn your first certificate. Finish all topics, pass assessments,
                            and submit your final project to get verified!
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Complete topics</span>
                            <span className="text-slate-300">→</span>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Pass assessments</span>
                            <span className="text-slate-300">→</span>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Get verified</span>
                            <span className="text-slate-300">→</span>
                            <Award className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-600 font-semibold">Earn certificate</span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .certificate-print,
                    .certificate-print * {
                        visibility: visible;
                    }
                    .certificate-print {
                        position: absolute;
                        left: 0;
                        top: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default MyCertificates;
