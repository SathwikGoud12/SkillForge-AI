import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import confetti from "canvas-confetti";
import {
    BookOpen,
    Code,
    Award,
    Zap,
    Home,
    TrendingUp,
    Settings,
    LogOut,
    ChevronRight,
    Play,
    Check,
    Copy,
    ExternalLink,
    MessageSquare,
    Sparkles,
    Clock,
    Target,
    Layers,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Rocket,
    Brain,
    FileText,
    HelpCircle,
    ArrowRight,
    ArrowLeft,
    Trophy,
    Lock,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import AppwriteAccount from "@/appwrite/Account.services";
import UserTopicProgressService from "@/appwrite/UserTopicProgressService";
import TopicServices from "@/appwrite/TopicServices";
import AssessmentService from "@/appwrite/AssessmentSevice";
import AssessmentAttemptService from "@/appwrite/AssessmentAttemptService";
import DomainProgressService from "@/appwrite/DomainProgressService";
import ProjectService from "@/appwrite/ProjectService";
import NotesServices from "@/appwrite/NotesServices";
import InterviewQuestionService from "@/appwrite/InterviewQuestionsServices";
import DomainService from "@/appwrite/domainServices";
import { AITopicNotes, AIConceptExplainer, AIAssessmentGenerator } from "@/components/ai";

// Helper function to safely parse questions
const getQuestionCount = (assessment) => {
    try {
        // Try to parse as JSON (new format)
        const questions = JSON.parse(assessment.question || "[]");
        return Array.isArray(questions) ? questions.length : 0;
    } catch (error) {
        // If parsing fails, it's old format (single question as text)
        // Return 1 if question exists, 0 otherwise
        return assessment.question ? 1 : 0;
    }
};

const appWriteAccount = new AppwriteAccount();
const progressService = new UserTopicProgressService();
const topicService = new TopicServices();
const assessmentService = new AssessmentService();
const attemptService = new AssessmentAttemptService();
const domainProgressService = new DomainProgressService();
const projectService = new ProjectService();
const notesService = new NotesServices();
const questionsService = new InterviewQuestionService();
const domainService = new DomainService();

const UserTopicDetails = () => {
    const { domainId, topicId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("notes");
    const [activeNav, setActiveNav] = useState("overview");
    const [expandedAnswers, setExpandedAnswers] = useState({});
    const [copiedCode, setCopiedCode] = useState(null);
    const [isAIOpen, setIsAIOpen] = useState(false);

    // Completion Flow State
    const [user, setUser] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [nextTopicId, setNextTopicId] = useState(null);

    // Topic & Domain info
    const [topicInfo, setTopicInfo] = useState(null);
    const [domainInfo, setDomainInfo] = useState(null);

    // Notes State
    const [realNotes, setRealNotes] = useState([]);

    // Questions State
    const [realQuestions, setRealQuestions] = useState([]);

    // Assessment State
    const [realAssessments, setRealAssessments] = useState([]);
    const [assessmentStatus, setAssessmentStatus] = useState({});

    // Projects State
    const [realProjects, setRealProjects] = useState([]);

    useEffect(() => {
        const init = async () => {
            try {
                // Fetch topic and domain info in parallel
                const [topicRes, domainRes] = await Promise.all([
                    topicService.getTopicById(topicId),
                    domainService.getDomainById(domainId)
                ]);

                setTopicInfo(topicRes);
                setDomainInfo(domainRes);

                // Load initial content in parallel
                const contentPromises = [
                    loadNotes(),
                    loadQuestions()
                ];

                const currentUser = await appWriteAccount.getAppwriteUser();
                if (currentUser) {
                    setUser(currentUser);
                    // Check progress, assessments and projects as well
                    contentPromises.push(progressService.getProgress(currentUser.$id, topicId).then(p => {
                        if (p?.completed) setIsCompleted(true);
                    }));
                    contentPromises.push(loadAssessments(currentUser.$id));
                    contentPromises.push(loadProjects());
                }

                // Wait for all content to load
                await Promise.all(contentPromises);

                // Find next topic
                const topicsRes = await topicService.getTopicsByDomain(domainId);
                const topics = topicsRes.rows || [];
                const currentIndex = topics.findIndex(t => t.$id === topicId);
                if (currentIndex !== -1 && currentIndex < topics.length - 1) {
                    setNextTopicId(topics[currentIndex + 1].$id);
                }
            } catch (error) {
                console.error("Error initializing topic details:", error);
            }
        };
        init();
    }, [domainId, topicId]);

    // Load notes from Appwrite
    const loadNotes = async () => {
        try {
            const notesRes = await notesService.noteListRows(topicId);
            setRealNotes(notesRes.rows || []);
        } catch (error) {
            console.error("Error loading notes:", error);
        }
    };

    // Load interview questions from Appwrite
    const loadQuestions = async () => {
        try {
            const questionsRes = await questionsService.getQuestionsByTopic(topicId);
            setRealQuestions(questionsRes.rows || []);
        } catch (error) {
            console.error("Error loading questions:", error);
        }
    };

    // Load assessments and check their status
    const loadAssessments = async (userId) => {
        try {
            const assessmentsRes = await assessmentService.getAssessmentsByTopic(topicId);
            const assessments = assessmentsRes.rows || [];

            // Sort by difficulty: Beginner -> Intermediate -> Advanced
            const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
            const sortedAssessments = assessments.sort((a, b) => {
                return (difficultyOrder[a.difficulty] || 999) - (difficultyOrder[b.difficulty] || 999);
            });

            setRealAssessments(sortedAssessments);

            // Check status for each assessment
            const statusMap = {};
            let previousPassed = true; // Beginner is always unlocked

            for (let i = 0; i < sortedAssessments.length; i++) {
                const assess = sortedAssessments[i];
                const attempts = await attemptService.getUserAttempts(userId, assess.$id);
                const hasPassed = attempts.some(att => att.passed);
                const bestAttempt = attempts.length > 0
                    ? attempts.reduce((best, curr) => curr.score > best.score ? curr : best)
                    : null;

                // Lock logic: 
                // - Beginner: always unlocked
                // - Intermediate: unlocked only if Beginner is passed
                // - Advanced: unlocked only if Intermediate is passed
                let isLocked = false;
                if (i > 0) {
                    isLocked = !previousPassed;
                }

                statusMap[assess.$id] = {
                    attempts: attempts.length,
                    passed: hasPassed,
                    bestScore: bestAttempt?.score || 0,
                    locked: isLocked,
                    difficulty: assess.difficulty,
                };

                // Update previousPassed for next iteration
                if (hasPassed) {
                    previousPassed = true;
                } else {
                    previousPassed = false;
                }
            }

            setAssessmentStatus(statusMap);
        } catch (error) {
            console.error("Error loading assessments:", error);
        }
    };

    // Load projects for this topic
    const loadProjects = async () => {
        try {
            const projectsRes = await projectService.getProjectsByTopic(topicId);
            const projects = projectsRes.rows || [];
            setRealProjects(projects);
        } catch (error) {
            console.error("Error loading projects:", error);
        }
    };

    const handleCompleteTopic = async () => {
        if (!user) return;
        setIsCompleting(true);

        try {
            // 1. Update DB
            await progressService.upsertProgress({
                userId: user.$id,
                topicId: topicId,
                domainId: domainId,
                completed: true,
                progress: 100,
            });

            // 2. Check and Update Domain Completion
            try {
                // Get all topics in this domain
                const topicsRes = await topicService.getTopicsByDomain(domainId);
                const allTopics = topicsRes.rows || [];
                const totalTopics = allTopics.length;

                // Count how many topics the user has completed in parallel
                const progressResults = await Promise.all(
                    allTopics.map(topic => progressService.getProgress(user.$id, topic.$id))
                );
                const completedCount = progressResults.filter(p => p?.completed).length;

                // Update domain progress
                const domainResult = await domainProgressService.checkAndUpdateDomainCompletion(
                    user.$id,
                    domainId,
                    completedCount,
                    totalTopics
                );

                // Show special celebration if domain was just completed
                if (domainResult.wasJustCompleted) {
                    setTimeout(() => {
                        toast.success("🎉 Domain Completed!", {
                            description: "You've completed all topics in this domain!",
                            duration: 6000,
                        });

                        // Extra confetti for domain completion
                        confetti({
                            particleCount: 300,
                            spread: 120,
                            origin: { y: 0.6 },
                            colors: ['#8b5cf6', '#6366f1', '#10b981', '#f59e0b', '#ef4444']
                        });
                    }, 2000);
                }
            } catch (domainError) {
                console.error("Error updating domain progress:", domainError);
            }

            // 3. UI Updates
            setIsCompleted(true);

            // 4. Celebration for Topic
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.8 },
                colors: ['#8b5cf6', '#6366f1', '#10b981', '#f59e0b']
            });

            toast.success("Topic Completed!", {
                description: "Great job! You've mastered this topic.",
                icon: <Trophy className="w-5 h-5 text-yellow-500" />,
                duration: 4000,
            });

            // 5. Show Modal
            setTimeout(() => {
                setShowCompletionModal(true);
            }, 1000);

        } catch (error) {
            console.error("Completion error:", error);
            toast.error("Failed to mark as completed");
        } finally {
            setIsCompleting(false);
        }
    };


    const tabs = [
        { id: "notes", label: "Notes", icon: FileText },
        { id: "questions", label: "Questions", icon: HelpCircle },
        { id: "assessments", label: "Assessments", icon: Award },
        { id: "projects", label: "Projects", icon: Rocket },
    ];

    // ── AI Panel State ────────────────────────────────────────────────────────
    const [aiMode, setAiMode] = useState("chat"); // chat | notes | questions
    const [aiInput, setAiInput] = useState("");
    const [aiMessages, setAiMessages] = useState([
        { role: "assistant", text: `👋 Hi! I'm your AI tutor for **${topicInfo?.title || "this topic"}**. Ask me anything, or use the quick actions below!` }
    ]);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiNotes, setAiNotes] = useState("");
    const [aiQs, setAiQs] = useState([]);

    // Update welcome message when topic loads
    useEffect(() => {
        if (topicInfo?.title) {
            setAiMessages([{ role: "assistant", text: `👋 Hi! I'm your AI tutor for **${topicInfo.title}**. Ask me anything, or use the quick actions below!` }]);
        }
    }, [topicInfo]);

    const sendAIMessage = async () => {
        if (!aiInput.trim() || aiLoading) return;
        const userMsg = aiInput.trim();
        setAiInput("");
        setAiMessages(prev => [...prev, { role: "user", text: userMsg }]);
        setAiLoading(true);
        try {
            const { aiService } = await import("@/services/ai.service");
            const res = await aiService.explainConcept(userMsg, topicInfo?.title || "", "intermediate");
            setAiMessages(prev => [...prev, { role: "assistant", text: res.explanation || "Here's what I know about that..." }]);
        } catch (e) {
            setAiMessages(prev => [...prev, { role: "assistant", text: "⚠️ " + (e.message || "Failed to get AI response. Please try again.") }]);
        } finally {
            setAiLoading(false);
        }
    };

    const generateAINotes = async () => {
        setAiLoading(true);
        setAiNotes("");
        try {
            const { aiService } = await import("@/services/ai.service");
            const res = await aiService.generateNotes(topicInfo?.title || "", domainInfo?.title || "", "intermediate");
            setAiNotes(res.notes || "No notes returned.");
        } catch (e) {
            setAiNotes("⚠️ " + (e.message || "Failed to generate notes."));
        } finally {
            setAiLoading(false);
        }
    };

    const generateAIQuestions = async () => {
        setAiLoading(true);
        setAiQs([]);
        try {
            const { aiService } = await import("@/services/ai.service");
            const res = await aiService.generateQuestions(topicInfo?.title || "", 5, "medium", "mixed");
            setAiQs(res.questions || []);
        } catch (e) {
            setAiQs([{ question: "⚠️ " + (e.message || "Failed to generate questions."), type: "error" }]);
        } finally {
            setAiLoading(false);
        }
    };

    const copyCode = (code, id) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(id);
        toast.success("Code copied!");
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const toggleAnswer = (id) => {
        setExpandedAnswers((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty?.toLowerCase()) {
            case "easy":
            case "beginner":
                return "bg-green-100 text-green-700 border-green-300";
            case "medium":
            case "intermediate":
                return "bg-yellow-100 text-yellow-700 border-yellow-300";
            case "hard":
            case "advanced":
                return "bg-red-100 text-red-700 border-red-300";
            default:
                return "bg-gray-100 text-gray-700 border-gray-300";
        }
    };

    return (
        <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'Inter', sans-serif" }}>
            <Toaster position="top-right" />

            {/* ── COMPACT HEADER ───────────────────────────────────────────── */}
            <div className="bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-700 text-white shadow-lg">
                <div className="px-6 py-4">
                    <div className="flex items-center gap-3 mb-1">
                        <button
                            onClick={() => navigate(`/user/domains/${domainId}/topics`)}
                            className="text-purple-200 hover:text-white text-sm flex items-center gap-1 transition-colors"
                        >
                            <ChevronRight className="w-3 h-3 rotate-180" />
                            Back
                        </button>
                        <span className="text-purple-300 text-xs">›</span>
                        <span className="text-purple-200 text-xs font-medium uppercase tracking-wider">{domainInfo?.title || "..."}</span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <h1 className="text-2xl font-bold leading-tight truncate">{topicInfo?.title || "Loading..."}</h1>
                            <p className="text-purple-200 text-sm mt-0.5 line-clamp-1">{topicInfo?.description || ""}</p>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                            <div className="flex gap-2 mr-2">
                                <div className="text-center bg-white/10 rounded-xl px-3 py-1.5 border border-white/10">
                                    <p className="text-lg font-bold">{realNotes.length}</p>
                                    <p className="text-purple-200 text-[10px] uppercase tracking-wider font-semibold">Notes</p>
                                </div>
                                <div className="text-center bg-white/10 rounded-xl px-3 py-1.5 border border-white/10">
                                    <p className="text-lg font-bold">{realQuestions.length}</p>
                                    <p className="text-purple-200 text-[10px] uppercase tracking-wider font-semibold">Questions</p>
                                </div>
                                <div className="text-center bg-white/10 rounded-xl px-3 py-1.5 border border-white/10">
                                    <p className="text-lg font-bold">{realAssessments.length}</p>
                                    <p className="text-purple-200 text-[10px] uppercase tracking-wider font-semibold">Quizzes</p>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isCompleted || isCompleting}
                                onClick={handleCompleteTopic}
                                className={`px-6 py-3 rounded-2xl font-black text-sm transition-all flex items-center gap-3 shadow-2xl relative overflow-hidden group ${isCompleted
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default"
                                    : "bg-white text-violet-700 hover:shadow-white/20"
                                    }`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/0 via-violet-600/5 to-violet-600/0 group-hover:translate-x-full transition-transform duration-1000 -translate-x-full" />
                                {isCompleting ? (
                                    <div className="w-5 h-5 border-3 border-violet-700/30 border-t-violet-700 rounded-full animate-spin" />
                                ) : isCompleted ? (
                                    <><div className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-emerald-400" /></div> Mastered</>
                                ) : (
                                    <><CheckCircle2 className="w-5 h-5 text-violet-500" /> Mark as Mastery</>
                                )}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Tabs inside header */}
                <div className="flex gap-0 px-4 border-t border-white/10">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all duration-200 ${activeTab === tab.id
                                ? "text-white border-b-2 border-white"
                                : "text-purple-200 hover:text-white border-b-2 border-transparent"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── MAIN LAYOUT: Content + AI Panel side by side ─────────────── */}
            <div className="max-w-5xl mx-auto w-full px-6 py-8 pb-32">

                <div className="w-full">
                    <AnimatePresence mode="wait">

                        {/* NOTES TAB */}
                        {activeTab === "notes" && (
                            <motion.div
                                key="notes"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                {realNotes.length === 0 ? (
                                    <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
                                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-500 font-medium">No notes yet</p>
                                        <p className="text-slate-400 text-sm mt-1">Click the Sparkles icon below to generate study notes instantly!</p>
                                    </div>
                                ) : (
                                    realNotes.map((note, idx) => (
                                        <motion.div
                                            key={note.$id}
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.06 }}
                                            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
                                        >
                                            {/* Note accent */}
                                            <div className="h-1 bg-gradient-to-r from-violet-500 to-indigo-500" />
                                            <div className="p-5">
                                                <div className="flex items-start justify-between gap-3 mb-3">
                                                    <h3 className="text-lg font-bold text-slate-900">{note.title}</h3>
                                                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-lg flex-shrink-0">#{idx + 1}</span>
                                                </div>
                                                <p className="text-slate-600 leading-relaxed text-sm mb-4">{note.explanation}</p>

                                                {note.codeExample && (
                                                    <div className="relative group rounded-xl overflow-hidden">
                                                        <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
                                                            <div className="flex gap-1.5">
                                                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                                                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                                                <div className="w-3 h-3 rounded-full bg-green-400" />
                                                            </div>
                                                            <button
                                                                onClick={() => copyCode(note.codeExample, note.$id)}
                                                                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                                                            >
                                                                {copiedCode === note.$id ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                                                                {copiedCode === note.$id ? "Copied!" : "Copy"}
                                                            </button>
                                                        </div>
                                                        <SyntaxHighlighter
                                                            language="javascript"
                                                            style={vscDarkPlus}
                                                            customStyle={{ margin: 0, borderRadius: 0, fontSize: "13px", padding: "16px" }}
                                                        >
                                                            {note.codeExample}
                                                        </SyntaxHighlighter>
                                                    </div>
                                                )}

                                                {note.youtubeUrl && (
                                                    <a
                                                        href={note.youtubeUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-4 inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-semibold"
                                                    >
                                                        <Play className="w-4 h-4" />
                                                        Watch Video
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                    </a>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </motion.div>
                        )}

                        {/* QUESTIONS TAB */}
                        {activeTab === "questions" && (
                            <motion.div
                                key="questions"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="space-y-3"
                            >
                                {realQuestions.length === 0 ? (
                                    <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
                                        <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-500 font-medium">No interview questions yet</p>
                                        <p className="text-slate-400 text-sm mt-1">Click the Sparkles icon below to generate practice questions!</p>
                                    </div>
                                ) : (
                                    realQuestions.map((q, idx) => (
                                        <motion.div
                                            key={q.$id}
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
                                        >
                                            <div className="p-4">
                                                <div className="flex items-start gap-3 mb-3">
                                                    <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center">{idx + 1}</span>
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <p className="text-slate-900 font-semibold text-sm leading-snug">{q.question}</p>
                                                            <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold border ${getDifficultyColor(q.difficulty)}`}>
                                                                {q.difficulty}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => toggleAnswer(q.$id)}
                                                    className="ml-10 flex items-center gap-1.5 text-xs text-violet-600 hover:text-violet-800 font-semibold transition-colors"
                                                >
                                                    {expandedAnswers[q.$id] ? "Hide Answer" : "Show Answer"}
                                                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expandedAnswers[q.$id] ? "rotate-90" : ""}`} />
                                                </button>

                                                <AnimatePresence>
                                                    {expandedAnswers[q.$id] && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden ml-10 mt-2"
                                                        >
                                                            <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-lg">
                                                                <p className="text-slate-700 text-sm leading-relaxed">{q.answer}</p>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </motion.div>
                        )}

                        {/* ASSESSMENTS TAB */}
                        {activeTab === "assessments" && (
                            <motion.div
                                key="assessments"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                            >
                                {realAssessments.length === 0 ? (
                                    <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-slate-200">
                                        <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-500 font-medium">No assessments yet</p>
                                        <p className="text-slate-400 text-sm mt-1">Assessments will appear here once added.</p>
                                    </div>
                                ) : (
                                    realAssessments.map((assessment, idx) => {
                                        const status = assessmentStatus[assessment.$id] || {};
                                        const isLocked = status.locked || false;
                                        const hasPassed = status.passed || false;
                                        const attempts = status.attempts || 0;
                                        const bestScore = status.bestScore || 0;

                                        return (
                                            <motion.div
                                                key={assessment.$id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: idx * 0.08 }}
                                                className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${isLocked ? "opacity-60 border-slate-200" : hasPassed ? "border-emerald-200" : "border-violet-200 hover:shadow-md"
                                                    }`}
                                            >
                                                <div className={`h-1.5 ${hasPassed ? "bg-gradient-to-r from-emerald-400 to-green-500" : isLocked ? "bg-slate-300" : "bg-gradient-to-r from-violet-500 to-indigo-600"}`} />
                                                <div className="p-5">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${hasPassed ? "bg-emerald-100" : isLocked ? "bg-slate-100" : "bg-violet-100"}`}>
                                                            {hasPassed ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : isLocked ? <Lock className="w-5 h-5 text-slate-400" /> : <Award className="w-5 h-5 text-violet-600" />}
                                                        </div>
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(assessment.difficulty)}`}>{assessment.difficulty}</span>
                                                    </div>

                                                    <h3 className="text-base font-bold text-slate-900 mb-2">{assessment.title}</h3>

                                                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                                                        <span className="flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5" />{getQuestionCount(assessment)} Qs</span>
                                                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{assessment.duration} min</span>
                                                        {attempts > 0 && <span className="flex items-center gap-1"><Target className="w-3.5 h-3.5" />{attempts} attempts</span>}
                                                    </div>

                                                    {hasPassed && bestScore > 0 && (
                                                        <div className="bg-emerald-50 rounded-lg px-3 py-2 mb-3 border border-emerald-100">
                                                            <p className="text-emerald-700 font-bold text-lg">Best: {bestScore}%</p>
                                                        </div>
                                                    )}

                                                    {isLocked && (
                                                        <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                                                            <Lock className="w-3 h-3" /> Complete previous level first
                                                        </p>
                                                    )}

                                                    <button
                                                        disabled={isLocked}
                                                        onClick={() => !isLocked && navigate(`/user/domains/${domainId}/topics/${topicId}/assessment/${assessment.$id}`)}
                                                        className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${isLocked ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                                            : hasPassed ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                                                : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-lg"
                                                            }`}
                                                    >
                                                        {isLocked ? <><Lock className="w-4 h-4" /> Locked</> : hasPassed ? <>Retake <Play className="w-3.5 h-3.5" /></> : <>Start Assessment <Play className="w-3.5 h-3.5" /></>}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                )}
                            </motion.div>
                        )}

                        {/* PROJECTS TAB */}
                        {activeTab === "projects" && (
                            <motion.div
                                key="projects"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                            >
                                {realProjects.length === 0 ? (
                                    <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-slate-200">
                                        <Rocket className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-500 font-medium">No projects yet</p>
                                        <p className="text-slate-400 text-sm mt-1">Practice projects will appear here soon!</p>
                                    </div>
                                ) : (
                                    realProjects.map((project, idx) => {
                                        const techStack = typeof project.techStack === "string"
                                            ? project.techStack.split(",").map(t => t.trim())
                                            : (Array.isArray(project.techStack) ? project.techStack : []);

                                        return (
                                            <motion.div
                                                key={project.$id}
                                                initial={{ opacity: 0, y: 16 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.08 }}
                                                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                                            >
                                                <div className="h-1.5 bg-gradient-to-r from-cyan-400 to-blue-600" />
                                                <div className="p-5">
                                                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
                                                        <Rocket className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <h3 className="text-base font-bold text-slate-900 mb-2">{project.title}</h3>
                                                    <p className="text-slate-600 text-sm leading-relaxed mb-3">{project.description}</p>
                                                    {techStack.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                                            {techStack.map((tech, i) => (
                                                                <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-100">
                                                                    {tech}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <div className="flex gap-2">
                                                        {project.githubUrl && (
                                                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                                                                className="flex-1 py-2 px-3 bg-slate-900 text-white rounded-lg font-semibold text-xs hover:bg-slate-800 transition-colors text-center">
                                                                GitHub
                                                            </a>
                                                        )}
                                                        {project.liveUrl && (
                                                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                                                                className="flex-1 py-2 px-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold text-xs text-center">
                                                                Live Demo
                                                            </a>
                                                        )}
                                                        {!project.githubUrl && !project.liveUrl && (
                                                            <span className="text-xs text-slate-400 italic">Links coming soon</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                )}
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>

            </div>

            {/* ── FLOATING AI TOGGLE ─────────────────────────────────────────── */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAIOpen(true)}
                className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-700 text-white rounded-full shadow-2xl flex items-center justify-center z-50 group border-4 border-white"
            >
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity animate-ping" />
                <Sparkles className="w-8 h-8" />
                <div className="absolute -top-1 -right-1 bg-emerald-400 w-4 h-4 rounded-full border-2 border-white" />
            </motion.button>

            {/* ── AI FEATURES DIALOG ─────────────────────────────────────────── */}
            <AnimatePresence>
                {isAIOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAIOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative bg-white w-full max-w-4xl max-h-[85vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
                        >
                            {/* Dialog Header - Premium Gradient */}
                            <div className="bg-gradient-to-r from-slate-900 via-violet-900 to-indigo-950 text-white p-8 border-b border-white/10 flex flex-col gap-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl shadow-violet-500/20 relative group">
                                            <div className="absolute inset-0 bg-white/20 rounded-2xl blur group-hover:blur-md transition-all" />
                                            <Sparkles className="w-8 h-8 text-white relative z-10" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black tracking-tight">AI Learning Suite</h3>
                                            <p className="text-violet-200/70 text-sm font-medium">Personalized mentor for <span className="text-white font-bold">{topicInfo?.title || "your journey"}</span></p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex gap-1 bg-black/40 backdrop-blur-xl rounded-2xl p-1.5 border border-white/10 overflow-x-auto scrollbar-none">
                                            {[
                                                { id: "chat", label: "Mentor Chat", icon: MessageSquare },
                                                { id: "notes", label: "Study Guide", icon: BookOpen },
                                                { id: "questions", label: "Knowledge Check", icon: HelpCircle },
                                            ].map(m => (
                                                <button
                                                    key={m.id}
                                                    onClick={() => setAiMode(m.id)}
                                                    className={`flex items-center gap-2.5 px-6 py-3 text-sm font-black rounded-xl transition-all duration-300 whitespace-nowrap ${aiMode === m.id
                                                        ? "bg-white text-slate-900 shadow-[0_0_20px_rgba(255,255,255,0.3)] transform scale-105"
                                                        : "text-white/40 hover:text-white/80 hover:bg-white/5"
                                                        }`}
                                                >
                                                    <m.icon className={`w-4 h-4 ${aiMode === m.id ? "text-violet-600" : ""}`} />
                                                    {m.label}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => setIsAIOpen(false)}
                                            className="w-12 h-12 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-2xl flex items-center justify-center transition-all group border border-white/10"
                                        >
                                            <XCircle className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
                                        </button>
                                    </div>
                                </div>

                                {/* Breadcrumb inside Modal */}
                                <div className="flex items-center gap-2 group">
                                    <button
                                        onClick={() => navigate(`/user/domains/${domainId}/topics`)}
                                        className="flex items-center gap-2 text-xs font-bold text-white/90 bg-white/10 px-4 py-2 rounded-xl border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all active:scale-95 shadow-lg shadow-black/5"
                                    >
                                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                        <span>Return to Topic List</span>
                                    </button>
                                    <div className="h-4 w-px bg-white/30 mx-1" />
                                    <span className="text-[10px] uppercase tracking-widest font-black text-white/50 bg-black/40 px-3 py-1 rounded-md border border-white/10">
                                        {domainInfo?.title || "Curriculum"}
                                    </span>
                                </div>
                            </div>

                            {/* Dialog Content */}
                            <div className="flex-1 overflow-y-auto bg-slate-50">
                                {aiMode === "chat" && (
                                    <div className="h-[550px] flex flex-col">
                                        <div className="flex-1 p-8 space-y-4 overflow-y-auto">
                                            {aiMessages.map((msg, i) => (
                                                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                                    {msg.role === "assistant" && (
                                                        <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                                                            <Sparkles className="w-5 h-5 text-violet-600" />
                                                        </div>
                                                    )}
                                                    <div className={`max-w-[70%] px-5 py-4 rounded-2xl text-base leading-relaxed ${msg.role === "user"
                                                        ? "bg-violet-600 text-white rounded-br-md shadow-lg"
                                                        : "bg-white text-slate-800 rounded-bl-md shadow-sm border border-slate-200"
                                                        }`}>
                                                        {msg.text}
                                                    </div>
                                                </div>
                                            ))}
                                            {aiLoading && (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                                        <Sparkles className="w-5 h-5 text-violet-600 animate-spin" />
                                                    </div>
                                                    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex gap-1">
                                                        <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                                        <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                                        <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-8 pt-0">
                                            <div className="flex gap-4 mb-4 overflow-x-auto pb-2 scrollbar-none">
                                                {[
                                                    `Explain "${topicInfo?.title || "this topic"}" simply`,
                                                    "What are common pitfalls?",
                                                    "Give me a real-world case study",
                                                ].map((prompt, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => { setAiInput(prompt); sendAIMessage(); }}
                                                        className="text-xs font-bold text-violet-700 bg-white hover:bg-violet-50 border border-violet-100 rounded-xl px-5 py-2.5 transition-all shadow-sm whitespace-nowrap"
                                                    >
                                                        {prompt}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="relative">
                                                <textarea
                                                    rows="2"
                                                    value={aiInput}
                                                    onChange={e => setAiInput(e.target.value)}
                                                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendAIMessage(); } }}
                                                    placeholder="Ask me anything about this topic..."
                                                    disabled={aiLoading}
                                                    className="w-full text-base px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-violet-500/20 bg-white placeholder-slate-400 shadow-sm resize-none"
                                                />
                                                <button
                                                    onClick={sendAIMessage}
                                                    disabled={aiLoading || !aiInput.trim()}
                                                    className="absolute right-4 bottom-4 p-3 bg-violet-600 text-white rounded-xl disabled:opacity-50 hover:bg-violet-700 shadow-lg transition-all"
                                                >
                                                    <MessageSquare className="w-6 h-6" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {aiMode === "notes" && (
                                    <div className="p-10">
                                        {!aiNotes && !aiLoading && (
                                            <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
                                                <div className="w-24 h-24 bg-violet-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                                    <BookOpen className="w-12 h-12 text-violet-600" />
                                                </div>
                                                <h4 className="text-2xl font-bold text-slate-900 mb-2">Smart Study Notes</h4>
                                                <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">I'll analyze the topic and create a comprehensive guide with explanations and code examples.</p>
                                                <button
                                                    onClick={generateAINotes}
                                                    className="px-10 py-5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 mx-auto"
                                                >
                                                    <Sparkles className="w-6 h-6" />
                                                    Generate Notes Now
                                                </button>
                                            </div>
                                        )}
                                        {aiLoading && (
                                            <div className="text-center py-24">
                                                <div className="w-20 h-20 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin mx-auto mb-6" />
                                                <p className="text-slate-900 font-bold text-xl">Curating your masterclass...</p>
                                                <p className="text-slate-500">This should only take a few seconds</p>
                                            </div>
                                        )}
                                        {aiNotes && !aiLoading && (
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                                        <Sparkles className="w-6 h-6 text-violet-600" /> AI Master Notes
                                                    </h4>
                                                    <button onClick={generateAINotes} className="px-4 py-2 bg-violet-50 text-violet-700 rounded-xl font-bold hover:bg-violet-100 transition-all">Regenerate</button>
                                                </div>
                                                <div className="prose prose-lg prose-slate max-w-none text-slate-700 bg-white rounded-3xl p-10 border border-slate-200 shadow-sm leading-relaxed">
                                                    <div className="whitespace-pre-wrap">{aiNotes}</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {aiMode === "questions" && (
                                    <div className="p-10">
                                        {aiQs.length === 0 && !aiLoading && (
                                            <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
                                                <div className="w-24 h-24 bg-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                                    <HelpCircle className="w-12 h-12 text-indigo-600" />
                                                </div>
                                                <h4 className="text-2xl font-bold text-slate-900 mb-2">Knowledge Pulse Check</h4>
                                                <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">Test your understanding with 5 personalized questions matching your current skill level.</p>
                                                <button
                                                    onClick={generateAIQuestions}
                                                    className="px-10 py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 mx-auto"
                                                >
                                                    <Sparkles className="w-6 h-6" />
                                                    Start AI Quiz
                                                </button>
                                            </div>
                                        )}
                                        {aiLoading && (
                                            <div className="text-center py-24">
                                                <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6" />
                                                <p className="text-slate-900 font-bold text-xl">Brainstorming questions...</p>
                                            </div>
                                        )}
                                        {aiQs.length > 0 && !aiLoading && (
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                                        <Sparkles className="w-6 h-6 text-indigo-600" /> AI Knowledge Check
                                                    </h4>
                                                    <button onClick={generateAIQuestions} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100 transition-all">Regenerate</button>
                                                </div>
                                                <div className="grid grid-cols-1 gap-4">
                                                    {aiQs.map((q, i) => (
                                                        <div key={i} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm transition-all hover:border-indigo-200">
                                                            <p className="text-lg font-bold text-slate-900 mb-4">Question {i + 1}: {q.question || q}</p>
                                                            {q.options && (
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                                                    {q.options.map((opt, j) => (
                                                                        <div key={j} className="text-base text-slate-700 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 flex items-center gap-4">
                                                                            <span className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-xl text-center text-sm font-black flex-shrink-0 flex items-center justify-center">
                                                                                {String.fromCharCode(65 + j)}
                                                                            </span>
                                                                            {opt}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                            {q.answer && (
                                                                <div className="text-base text-emerald-800 bg-emerald-50 rounded-2xl px-6 py-4 border border-emerald-100 font-medium">
                                                                    <span className="font-black mr-2">✓ ANSWER:</span> {q.answer}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── COMPLETION MODAL ──────────────────────────────────────────── */}
            <AnimatePresence>
                {showCompletionModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowCompletionModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                            className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center overflow-hidden z-10">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-violet-600 to-indigo-600 opacity-10" />
                            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-500/30">
                                <Trophy className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Topic Completed! 🎉</h2>
                            <p className="text-slate-500 mb-6 text-sm">Excellent work! You've mastered this topic.</p>
                            <div className="space-y-2">
                                {nextTopicId ? (
                                    <button onClick={() => { setShowCompletionModal(false); navigate(`/user/domains/${domainId}/topics/${nextTopicId}`); }}
                                        className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                                        Start Next Topic <ArrowRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button onClick={() => navigate('/user/domains')}
                                        className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">
                                        Back to Domains
                                    </button>
                                )}
                                <button onClick={() => setShowCompletionModal(false)}
                                    className="w-full py-2.5 text-slate-500 hover:text-slate-800 font-semibold text-sm">Stay Here</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default UserTopicDetails;
