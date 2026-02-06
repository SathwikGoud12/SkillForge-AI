import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router";
import {
    ArrowLeft,
    Users,
    Copy,
    Share2,
    Video,
    Mic,
    MicOff,
    VideoOff,
    PhoneOff,
    MessageSquare,
    Bot,
    Check
} from "lucide-react";
import { toast } from "sonner";

const DoubtClearingSession = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const subject = location.state?.subject;

    const [sessionStarted, setSessionStarted] = useState(false);
    const [micEnabled, setMicEnabled] = useState(true);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [notes, setNotes] = useState("");
    const [copied, setCopied] = useState(false);

    // Mock meeting link
    const meetingLink = `https://skillforge.ai/meet/${Math.random().toString(36).substr(2, 9)}`;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(meetingLink);
        setCopied(true);
        toast.success("Meeting link copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShareWhatsApp = () => {
        const message = `Join my doubt clearing session for ${subject?.Subjects || "Subject"}!\n\n${meetingLink}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
    };

    const handleStartSession = () => {
        setSessionStarted(true);
        toast.success("Session started!");
    };

    const handleEndSession = () => {
        setSessionStarted(false);
        toast.info("Session ended");
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
                        Back to Subject
                    </button>

                    <h1 className="text-4xl font-bold text-slate-900 mb-2">
                        Doubt Clearing Session
                    </h1>
                    <p className="text-slate-600">
                        {subject?.Subjects || "Subject"} - Collaborative Learning
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Video Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Video Display */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-900 rounded-2xl overflow-hidden aspect-video relative"
                        >
                            {sessionStarted ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-900">
                                    <div className="text-center">
                                        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                                            <Video className="w-12 h-12 text-white" />
                                        </div>
                                        <p className="text-white text-xl font-semibold">Session Active</p>
                                        <p className="text-white/70 text-sm mt-2">Video feed will appear here</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                                            <VideoOff className="w-12 h-12 text-slate-600" />
                                        </div>
                                        <p className="text-slate-400 text-xl font-semibold">Session Not Started</p>
                                        <p className="text-slate-500 text-sm mt-2">Click "Start Session" to begin</p>
                                    </div>
                                </div>
                            )}

                            {/* Session Status Badge */}
                            {sessionStarted && (
                                <div className="absolute top-4 left-4 px-4 py-2 bg-red-600 text-white rounded-full flex items-center gap-2 animate-pulse">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                    <span className="text-sm font-semibold">LIVE</span>
                                </div>
                            )}
                        </motion.div>

                        {/* Controls */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200"
                        >
                            <div className="flex items-center justify-center gap-4">
                                {/* Mic Toggle */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setMicEnabled(!micEnabled)}
                                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${micEnabled
                                            ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                            : "bg-red-100 hover:bg-red-200 text-red-600"
                                        }`}
                                >
                                    {micEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                                </motion.button>

                                {/* Video Toggle */}
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setVideoEnabled(!videoEnabled)}
                                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${videoEnabled
                                            ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                                            : "bg-red-100 hover:bg-red-200 text-red-600"
                                        }`}
                                >
                                    {videoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                                </motion.button>

                                {/* Start/End Session */}
                                {!sessionStarted ? (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleStartSession}
                                        className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                                    >
                                        Start Session
                                    </motion.button>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleEndSession}
                                        className="px-8 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                                    >
                                        <PhoneOff className="w-5 h-5" />
                                        End Session
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>

                        {/* Quick Notes */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-blue-600" />
                                    Quick Notes
                                </h3>
                                <span className="text-xs text-slate-500 px-3 py-1 bg-slate-100 rounded-full">
                                    Manual Typing
                                </span>
                            </div>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Type your notes here during the session..."
                                className="w-full h-40 p-4 border-2 border-slate-200 rounded-xl resize-none focus:border-blue-500 focus:outline-none transition-colors"
                            />
                            <div className="mt-2 flex items-center justify-between">
                                <p className="text-sm text-slate-500">{notes.length} characters</p>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    Save Notes
                                </button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Invite Friends */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200"
                        >
                            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-600" />
                                Invite Friends
                            </h3>

                            <div className="space-y-3">
                                {/* Meeting Link */}
                                <div>
                                    <label className="text-sm font-semibold text-slate-700 mb-2 block">
                                        Meeting Link
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={meetingLink}
                                            readOnly
                                            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600"
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleCopyLink}
                                            className={`p-2 rounded-lg transition-all ${copied
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                                                }`}
                                        >
                                            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Share via WhatsApp */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleShareWhatsApp}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                                >
                                    <Share2 className="w-5 h-5" />
                                    Share via WhatsApp
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* AI Listening Status */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg border-2 border-purple-200"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">AI Assistant</h3>
                                    <p className="text-sm text-slate-600">
                                        {sessionStarted ? "Listening..." : "Standby"}
                                    </p>
                                </div>
                            </div>

                            {sessionStarted && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm text-slate-700">Auto-capturing conversation</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm text-slate-700">Generating smart notes</span>
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 p-3 bg-white/50 rounded-lg">
                                <p className="text-xs text-slate-600 italic">
                                    💡 AI will automatically capture key points from your discussion
                                </p>
                            </div>
                        </motion.div>

                        {/* Participants (Mock) */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-slate-200"
                        >
                            <h3 className="text-lg font-bold text-slate-900 mb-4">
                                Participants ({sessionStarted ? 1 : 0})
                            </h3>
                            {sessionStarted ? (
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                                        You
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">You (Host)</p>
                                        <p className="text-xs text-green-600">● Active</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 text-center py-4">
                                    No participants yet
                                </p>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoubtClearingSession;
