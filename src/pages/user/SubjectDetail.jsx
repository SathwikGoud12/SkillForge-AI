import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate, useParams } from "react-router";
import {
    FileText,
    Video,
    BookOpen,
    ArrowLeft,
    MessageCircleQuestion,
    Download,
    Eye
} from "lucide-react";

const SubjectDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { subjectId } = useParams();
    const subject = location.state?.subject;

    const [activeTab, setActiveTab] = useState("pdfs");

    // Mock data
    const pdfVault = [
        { id: 1, title: "Unit 1 - Introduction", size: "2.5 MB", downloads: 245 },
        { id: 2, title: "Unit 2 - Advanced Concepts", size: "3.1 MB", downloads: 198 },
        { id: 3, title: "Unit 3 - Practical Applications", size: "4.2 MB", downloads: 312 },
        { id: 4, title: "Previous Year Papers", size: "1.8 MB", downloads: 567 },
        { id: 5, title: "Quick Revision Notes", size: "1.2 MB", downloads: 423 }
    ];

    const videos = [
        { id: 1, title: "Lecture 1 - Fundamentals", duration: "45:30", views: 1234 },
        { id: 2, title: "Lecture 2 - Deep Dive", duration: "52:15", views: 987 },
        { id: 3, title: "Lecture 3 - Case Studies", duration: "38:45", views: 756 },
        { id: 4, title: "Practical Session 1", duration: "1:15:20", views: 654 },
        { id: 5, title: "Exam Preparation Tips", duration: "28:10", views: 1567 }
    ];

    const myNotes = [
        { id: 1, title: "Chapter 1 Summary", date: "2 days ago" },
        { id: 2, title: "Important Formulas", date: "5 days ago" },
        { id: 3, title: "Key Concepts", date: "1 week ago" }
    ];

    const tabs = [
        { id: "pdfs", label: "PDF Vault", icon: FileText },
        { id: "videos", label: "Videos", icon: Video },
        { id: "notes", label: "My Notes", icon: BookOpen }
    ];

    const handleDoubtClick = () => {
        navigate(`/user/study-materials/doubt-session/${subjectId}`, {
            state: { subject }
        });
    };

    return (
        <div className="min-h-screen p-8 bg-gradient-to-br from-slate-50 via-white to-slate-100">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Subjects
                    </button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900 mb-2">
                                {subject?.Subjects || "Subject Details"}
                            </h1>
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                                    {subject?.Year}
                                </span>
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-semibold">
                                    {subject?.Branch}
                                </span>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
                                    {subject?.Semester}
                                </span>
                            </div>
                        </div>

                        {/* Have a Doubt Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleDoubtClick}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                        >
                            <MessageCircleQuestion className="w-5 h-5" />
                            Have a Doubt?
                        </motion.button>
                    </div>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 overflow-hidden"
                >
                    {/* Tab Headers */}
                    <div className="flex border-b border-slate-200">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-all ${activeTab === tab.id
                                            ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
                                            : "text-slate-600 hover:bg-slate-50"
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {/* PDF Vault */}
                        {activeTab === "pdfs" && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                {pdfVault.map((pdf, index) => (
                                    <motion.div
                                        key={pdf.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                                                <FileText className="w-6 h-6 text-red-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                    {pdf.title}
                                                </h3>
                                                <p className="text-sm text-slate-600">
                                                    {pdf.size} • {pdf.downloads} downloads
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
                                                <Eye className="w-5 h-5 text-slate-600" />
                                            </button>
                                            <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors">
                                                <Download className="w-5 h-5 text-slate-600" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {/* Videos */}
                        {activeTab === "videos" && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                {videos.map((video, index) => (
                                    <motion.div
                                        key={video.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-slate-50 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                                    >
                                        <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                            <Video className="w-16 h-16 text-white opacity-50" />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                                {video.title}
                                            </h3>
                                            <div className="flex items-center justify-between text-sm text-slate-600">
                                                <span>{video.duration}</span>
                                                <span>{video.views} views</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {/* My Notes */}
                        {activeTab === "notes" && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                {myNotes.map((note, index) => (
                                    <motion.div
                                        key={note.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                        className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                                <BookOpen className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                    {note.title}
                                                </h3>
                                                <p className="text-sm text-slate-600">{note.date}</p>
                                            </div>
                                        </div>
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                            Open
                                        </button>
                                    </motion.div>
                                ))}

                                <button className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-all">
                                    + Create New Note
                                </button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default SubjectDetail;
