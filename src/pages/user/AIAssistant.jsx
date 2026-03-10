import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bot, Send, Sparkles, BookOpen, Rocket,
    HelpCircle, User, Zap, Code2, BrainCircuit,
    MessageSquare, ChevronRight
} from "lucide-react";
import AppwriteAccount from "@/appwrite/Account.services";
import { aiService } from "@/services/ai.service";

const appwriteAccount = new AppwriteAccount();

const AIAssistant = () => {
    const [messages, setMessages] = useState([
        { role: "assistant", text: "👋 Hello! I'm your AI Mentor. Ask me anything about tech, coding, career paths, or request a mock interview. I'm here to help!" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        appwriteAccount.getAppwriteUser().then(setUser).catch(() => { });
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (text) => {
        const msg = (text || input).trim();
        if (!msg || loading) return;
        setInput("");
        setMessages(prev => [...prev, { role: "user", text: msg }]);
        setLoading(true);
        try {
            const res = await aiService.explainConcept(msg, "General Development", "intermediate");
            setMessages(prev => [...prev, {
                role: "assistant",
                text: res.explanation || "I'm still learning about that, but let's explore it together!"
            }]);
        } catch (e) {
            setMessages(prev => [...prev, {
                role: "assistant",
                text: "⚠️ " + (e.message || "Something went wrong. Please try again!")
            }]);
        } finally {
            setLoading(false);
        }
    };

    const quickActions = [
        { label: "Explain Recursion", icon: Code2, color: "from-violet-500 to-indigo-500" },
        { label: "React vs Next.js", icon: BookOpen, color: "from-blue-500 to-cyan-500" },
        { label: "Mock Interview", icon: HelpCircle, color: "from-rose-500 to-pink-500" },
        { label: "Career Roadmap", icon: Rocket, color: "from-amber-400 to-orange-500" },
        { label: "Explain Promises", icon: BrainCircuit, color: "from-emerald-500 to-teal-500" },
        { label: "System Design Basics", icon: Sparkles, color: "from-purple-500 to-violet-500" },
    ];

    const getInitials = (name) => {
        if (!name) return "U";
        const parts = name.trim().split(" ");
        return parts.length >= 2
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* ── Hero Header ─────────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative rounded-3xl overflow-hidden p-8 text-white"
                    style={{ background: "linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #4f46e5 100%)" }}
                >
                    <div className="absolute inset-0 pointer-events-none"
                        style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.12) 0%, transparent 60%)" }} />
                    {/* floating circles */}
                    <div className="absolute right-8 top-6 w-20 h-20 rounded-full bg-white/5" />
                    <div className="absolute right-16 bottom-4 w-10 h-10 rounded-full bg-white/8" />

                    <div className="relative z-10 flex items-center gap-5">
                        <motion.div
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-3xl flex items-center justify-center flex-shrink-0 shadow-xl"
                        >
                            <Bot className="w-9 h-9 text-white" />
                        </motion.div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                <span className="text-violet-200 text-xs font-bold uppercase tracking-widest">Online · Ready to help</span>
                            </div>
                            <h1 className="text-3xl font-black tracking-tight">AI Learning Mentor</h1>
                            <p className="text-violet-200 mt-1">Ask me anything — code, concepts, career, interviews</p>
                        </div>
                    </div>
                </motion.div>

                {/* ── Quick Action Chips ───────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Quick Prompts</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {quickActions.map((action, i) => (
                            <motion.button
                                key={i}
                                whileHover={{ y: -3, scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleSend(action.label)}
                                disabled={loading}
                                className="flex items-center gap-3 p-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all text-left group disabled:opacity-50"
                            >
                                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                                    <action.icon className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 leading-tight">{action.label}</span>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 ml-auto flex-shrink-0 transition-colors" />
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* ── Chat Container ───────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden flex flex-col"
                    style={{ height: 520 }}
                >
                    {/* Chat title bar */}
                    <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 flex-shrink-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 text-sm">Chat with AI Mentor</p>
                            <p className="text-slate-400 text-xs">{messages.length - 1} messages in this session</p>
                        </div>
                        <div className="ml-auto flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-xs text-slate-400 font-semibold">AI Active</span>
                        </div>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5">
                        <AnimatePresence initial={false}>
                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`flex gap-3 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                        {/* Avatar */}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm text-xs font-black mt-0.5
                                            ${m.role === "user"
                                                ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white"
                                                : "bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600"
                                            }`}
                                        >
                                            {m.role === "user"
                                                ? getInitials(user?.name)
                                                : <Bot className="w-4 h-4" />
                                            }
                                        </div>
                                        {/* Bubble */}
                                        <div className={`px-4 py-3 text-sm leading-relaxed round shadow-sm
                                            ${m.role === "user"
                                                ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white rounded-2xl rounded-tr-sm"
                                                : "bg-slate-50 border border-slate-100 text-slate-800 rounded-2xl rounded-tl-sm"
                                            }`}
                                            style={{ whiteSpace: "pre-wrap" }}
                                        >
                                            {m.text}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Typing indicator */}
                            {loading && (
                                <motion.div
                                    key="typing"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                                            <Bot className="w-4 h-4 text-slate-600" />
                                        </div>
                                        <div className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                                            {[0, 1, 2].map((d) => (
                                                <motion.div
                                                    key={d}
                                                    className="w-2 h-2 bg-violet-400 rounded-full"
                                                    animate={{ y: [0, -6, 0] }}
                                                    transition={{ duration: 0.7, repeat: Infinity, delay: d * 0.15 }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Input area */}
                    <div className="p-4 border-t border-slate-100 flex-shrink-0">
                        <div className="flex items-center gap-3 bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-2.5 focus-within:border-violet-400 transition-colors">
                            <Zap className="w-4 h-4 text-slate-300 flex-shrink-0" />
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                                placeholder="Ask about code, projects, career, interviews…"
                                className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleSend()}
                                disabled={loading || !input.trim()}
                                className="w-9 h-9 bg-gradient-to-br from-violet-500 to-indigo-600 text-white rounded-xl flex items-center justify-center shadow-md disabled:opacity-40 disabled:grayscale transition-all flex-shrink-0"
                            >
                                <Send className="w-4 h-4" />
                            </motion.button>
                        </div>
                        <p className="text-center text-slate-300 text-[10px] mt-2 font-medium">
                            Powered by Gemini AI · Press Enter to send
                        </p>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default AIAssistant;
