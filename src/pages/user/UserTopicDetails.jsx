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


// Dummy Data
const TOPIC_DATA = {
    title: "React.js",
    subtitle: "A JavaScript library for building user interfaces",
    domain: "MERN Stack",
    totalTopics: 12,
    completionPercent: 65,
    notes: [
        {
            id: 1,
            title: "Introduction to React",
            content: "React is a declarative, efficient, and flexible JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called components.",
            code: `import React from 'react';

function Welcome() {
  return <h1>Hello, React!</h1>;
}

export default Welcome;`,
            videoUrl: "https://youtube.com/watch?v=example",
        },
        {
            id: 2,
            title: "useState Hook",
            content: "useState is a Hook that lets you add React state to function components. It returns a pair: the current state value and a function that lets you update it.",
            code: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}`,
            videoUrl: "https://youtube.com/watch?v=example",
        },
        {
            id: 3,
            title: "useEffect Hook",
            content: "useEffect is a Hook for performing side effects in function components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount combined.",
            code: `import { useEffect, useState } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);
  }, []); // Empty array means run once
  
  return <div>{data?.title}</div>;
}`,
            videoUrl: "https://youtube.com/watch?v=example",
        },
    ],
    questions: [
        {
            id: 1,
            question: "What is the Virtual DOM in React?",
            answer: "The Virtual DOM is a lightweight copy of the actual DOM. React uses it to optimize updates by comparing the virtual DOM with the real DOM and only updating what has changed. This process is called reconciliation and makes React fast and efficient.",
            difficulty: "Easy",
        },
        {
            id: 2,
            question: "Explain the difference between props and state",
            answer: "Props are read-only data passed from parent to child components, while state is mutable data managed within a component. Props are used for component configuration, state is used for data that changes over time. Props flow down (unidirectional), state is local to the component.",
            difficulty: "Medium",
        },
        {
            id: 3,
            question: "What are React Hooks and why were they introduced?",
            answer: "React Hooks are functions that let you use state and other React features in functional components. They were introduced to solve problems like: reusing stateful logic between components, complex components becoming hard to understand, and confusion with classes and 'this' keyword. Hooks like useState, useEffect, useContext make functional components more powerful.",
            difficulty: "Medium",
        },
        {
            id: 4,
            question: "Explain React's reconciliation algorithm",
            answer: "Reconciliation is the process React uses to update the DOM efficiently. When state changes, React creates a new virtual DOM tree, compares it with the previous one (diffing), and calculates the minimal set of changes needed. It uses keys to identify elements and optimize list rendering. This makes updates fast even for complex UIs.",
            difficulty: "Hard",
        },
    ],
    assessments: [
        {
            id: 1,
            title: "React Fundamentals Quiz",
            questions: 15,
            duration: "20 min",
            difficulty: "Beginner",
            completed: true,
            score: 87,
        },
        {
            id: 2,
            title: "Hooks Deep Dive Assessment",
            questions: 20,
            duration: "30 min",
            difficulty: "Intermediate",
            completed: false,
        },
        {
            id: 3,
            title: "Advanced React Patterns",
            questions: 25,
            duration: "45 min",
            difficulty: "Advanced",
            completed: false,
        },
    ],
    projects: [
        {
            id: 1,
            title: "Todo App with Hooks",
            description: "Build a fully functional todo application using useState and useEffect",
            techStack: ["React", "CSS", "LocalStorage"],
            difficulty: "Beginner",
            completed: true,
        },
        {
            id: 2,
            title: "Weather Dashboard",
            description: "Create a weather app that fetches data from an API and displays it beautifully",
            techStack: ["React", "API", "Tailwind"],
            difficulty: "Intermediate",
            completed: false,
        },
        {
            id: 3,
            title: "E-commerce Product Page",
            description: "Build a complete product page with cart functionality and state management",
            techStack: ["React", "Context API", "Redux"],
            difficulty: "Advanced",
            completed: false,
        },
    ],
};

const appWriteAccount = new AppwriteAccount();
const progressService = new UserTopicProgressService();
const topicService = new TopicServices();
const assessmentService = new AssessmentService();
const attemptService = new AssessmentAttemptService();
const domainProgressService = new DomainProgressService();
const projectService = new ProjectService();

const UserTopicDetails = () => {
    const { domainId, topicId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("notes");
    const [activeNav, setActiveNav] = useState("overview");
    const [expandedAnswers, setExpandedAnswers] = useState({});
    const [copiedCode, setCopiedCode] = useState(null);
    const [showAI, setShowAI] = useState(false);

    // Completion Flow State
    const [user, setUser] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [nextTopicId, setNextTopicId] = useState(null);

    // Assessment State
    const [realAssessments, setRealAssessments] = useState([]);
    const [assessmentStatus, setAssessmentStatus] = useState({});

    // Projects State
    const [realProjects, setRealProjects] = useState([]);

    useEffect(() => {
        const init = async () => {
            try {
                const currentUser = await appWriteAccount.getAppwriteUser();
                if (currentUser) {
                    setUser(currentUser);
                    // Check if already completed
                    const progress = await progressService.getProgress(currentUser.$id, topicId);
                    if (progress?.completed) {
                        setIsCompleted(true);
                    }

                    // Load real assessments for this topic
                    await loadAssessments(currentUser.$id);

                    // Load real projects for this topic
                    await loadProjects();
                }

                // Find next topic in domain
                const topicsRes = await topicService.getTopicsByDomain(domainId);
                const topics = topicsRes.rows || [];
                // Sort topics if needed, assuming order is returned or sortable field
                const currentIndex = topics.findIndex(t => t.$id === topicId); // Assuming topicId matches $id in DB
                // If using dummy data for topics list, we might need a different approach, 
                // but let's assume we can fetch real topics. 
                // If currently relying on pure dummy TOPIC_DATA for the list, I'll implement a mock "next" for now 
                // or try to find a next ID from real data if available.

                // Fallback for dummy structure if Real DB returns nothing useful yet
                if (currentIndex !== -1 && currentIndex < topics.length - 1) {
                    setNextTopicId(topics[currentIndex + 1].$id);
                }
            } catch (error) {
                console.error("Error initializing topic details:", error);
            }
        };
        init();
    }, [domainId, topicId]);

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
            console.log("🔍 Loading projects for topicId:", topicId);
            const projectsRes = await projectService.getProjectsByTopic(topicId);
            console.log("📦 Projects response:", projectsRes);
            const projects = projectsRes.rows || [];
            console.log("✅ Projects found:", projects.length, projects);
            setRealProjects(projects);
        } catch (error) {
            console.error("❌ Error loading projects:", error);
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

                // Count how many topics the user has completed
                let completedCount = 0;
                for (const topic of allTopics) {
                    const topicProgress = await progressService.getProgress(user.$id, topic.$id);
                    if (topicProgress?.completed) {
                        completedCount++;
                    }
                }

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
                // Don't fail topic completion if domain update fails
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

    const sidebarItems = [
        { id: "overview", label: "Overview", icon: Home },
        { id: "domains", label: "Domains", icon: Layers },
        { id: "progress", label: "Progress", icon: TrendingUp },
        { id: "ai", label: "AI Assistant", icon: Brain },
        { id: "settings", label: "Settings", icon: Settings },
    ];

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            <Toaster position="top-right" />



            {/* MAIN CONTENT */}
            <main className="flex-1">
                {/* HERO HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="sticky top-0 z-40 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white shadow-xl"
                >
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

                    <div className="relative max-w-7xl mx-auto px-8 py-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <motion.p
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-purple-200 text-sm font-medium mb-2 flex items-center gap-2"
                                >
                                    <Code className="w-4 h-4" />
                                    {TOPIC_DATA.domain}
                                </motion.p>
                                <motion.h1
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-5xl font-bold mb-2"
                                >
                                    {TOPIC_DATA.title}
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-purple-100 text-lg"
                                >
                                    {TOPIC_DATA.subtitle}
                                </motion.p>
                            </div>

                            <div className="flex gap-6">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-center bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20"
                                >
                                    <p className="text-3xl font-bold">{TOPIC_DATA.totalTopics}</p>
                                    <p className="text-purple-200 text-sm">Topics</p>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-center bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20"
                                >
                                    <p className="text-3xl font-bold">{TOPIC_DATA.completionPercent}%</p>
                                    <p className="text-purple-200 text-sm">Complete</p>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* TAB NAVIGATION */}
                <div className="sticky top-[168px] z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
                    <div className="max-w-7xl mx-auto px-8">
                        <div className="flex gap-1 relative">
                            {tabs.map((tab) => (
                                <motion.button
                                    key={tab.id}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative px-6 py-4 font-semibold transition-all duration-200 flex items-center gap-2 ${activeTab === tab.id
                                        ? "text-purple-600"
                                        : "text-slate-600 hover:text-slate-900"
                                        }`}
                                >
                                    <tab.icon className="w-5 h-5" />
                                    <span>{tab.label}</span>
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-full"
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* TAB CONTENT */}
                <div className="max-w-7xl mx-auto px-8 py-8">
                    <AnimatePresence mode="wait">
                        {/* NOTES TAB */}
                        {activeTab === "notes" && (
                            <motion.div
                                key="notes"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-6"
                            >
                                {TOPIC_DATA.notes.map((note, idx) => (
                                    <motion.div
                                        key={note.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow"
                                    >
                                        <div className="p-6">
                                            <h3 className="text-2xl font-bold text-slate-900 mb-3">
                                                {note.title}
                                            </h3>
                                            <p className="text-slate-600 leading-relaxed mb-6">
                                                {note.content}
                                            </p>

                                            {/* Code Block */}
                                            <div className="relative group">
                                                <div className="absolute top-3 right-3 z-10">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => copyCode(note.code, note.id)}
                                                        className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                                                    >
                                                        {copiedCode === note.id ? (
                                                            <Check className="w-4 h-4" />
                                                        ) : (
                                                            <Copy className="w-4 h-4" />
                                                        )}
                                                    </motion.button>
                                                </div>
                                                <SyntaxHighlighter
                                                    language="javascript"
                                                    style={vscDarkPlus}
                                                    customStyle={{
                                                        borderRadius: "12px",
                                                        padding: "20px",
                                                        fontSize: "14px",
                                                    }}
                                                >
                                                    {note.code}
                                                </SyntaxHighlighter>
                                            </div>

                                            {/* Watch Video CTA */}
                                            <motion.a
                                                whileHover={{ scale: 1.02, x: 4 }}
                                                whileTap={{ scale: 0.98 }}
                                                href={note.videoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-4 inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold"
                                            >
                                                <Play className="w-5 h-5" />
                                                Watch related video
                                                <ExternalLink className="w-4 h-4" />
                                            </motion.a>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {/* QUESTIONS TAB */}
                        {activeTab === "questions" && (
                            <motion.div
                                key="questions"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                {TOPIC_DATA.questions.map((q, idx) => (
                                    <motion.div
                                        key={q.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.08 }}
                                        className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <h3 className="text-xl font-bold text-slate-900 flex-1">
                                                    {q.question}
                                                </h3>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(
                                                        q.difficulty
                                                    )}`}
                                                >
                                                    {q.difficulty}
                                                </span>
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => toggleAnswer(q.id)}
                                                className="mb-4 flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold"
                                            >
                                                {expandedAnswers[q.id] ? "Hide Answer" : "View Answer"}
                                                <ChevronRight
                                                    className={`w-4 h-4 transition-transform ${expandedAnswers[q.id] ? "rotate-90" : ""
                                                        }`}
                                                />
                                            </motion.button>

                                            <AnimatePresence>
                                                {expandedAnswers[q.id] && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
                                                            <p className="text-slate-700 leading-relaxed">
                                                                {q.answer}
                                                            </p>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}

                        {/* ASSESSMENTS TAB */}
                        {activeTab === "assessments" && (
                            <motion.div
                                key="assessments"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {realAssessments.length === 0 ? (
                                    <div className="col-span-full text-center py-12">
                                        <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-500 font-medium">No assessments available yet</p>
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
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: idx * 0.1 }}
                                                whileHover={!isLocked ? { y: -8, scale: 1.02 } : {}}
                                                className={`bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden transition-all ${isLocked ? "opacity-60" : "hover:shadow-xl"
                                                    }`}
                                            >
                                                <div className={`h-2 ${hasPassed
                                                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                                    : isLocked
                                                        ? "bg-gradient-to-r from-slate-400 to-slate-500"
                                                        : "bg-gradient-to-r from-purple-600 to-indigo-600"
                                                    }`}></div>
                                                <div className="p-6 relative">
                                                    {/* Lock Overlay */}
                                                    {isLocked && (
                                                        <div className="absolute top-4 right-4 z-10">
                                                            <div className="bg-slate-100 p-2 rounded-lg border-2 border-slate-300">
                                                                <Lock className="w-5 h-5 text-slate-600" />
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center justify-between mb-4">
                                                        <Award className={`w-10 h-10 ${hasPassed ? "text-green-600" :
                                                            isLocked ? "text-slate-400" :
                                                                "text-purple-600"
                                                            }`} />
                                                        {hasPassed && (
                                                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                                                        )}
                                                    </div>

                                                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                                                        {assessment.title}
                                                    </h3>

                                                    <div className="space-y-2 mb-4">
                                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                                            <HelpCircle className="w-4 h-4" />
                                                            <span>{getQuestionCount(assessment)} questions</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                                            <Clock className="w-4 h-4" />
                                                            <span>{assessment.duration} min</span>
                                                        </div>
                                                        <span
                                                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(
                                                                assessment.difficulty
                                                            )}`}
                                                        >
                                                            {assessment.difficulty}
                                                        </span>
                                                    </div>

                                                    {/* Score Display */}
                                                    {hasPassed && bestScore > 0 && (
                                                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                                                            <p className="text-green-700 font-bold text-2xl">
                                                                Best: {bestScore}%
                                                            </p>
                                                            <p className="text-green-600 text-xs mt-1">
                                                                {attempts} attempt{attempts !== 1 ? 's' : ''}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Locked Message */}
                                                    {isLocked && (
                                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4">
                                                            <p className="text-slate-600 text-sm font-medium flex items-center gap-2">
                                                                <Lock className="w-4 h-4" />
                                                                Complete previous level first
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Action Button */}
                                                    <motion.button
                                                        whileHover={!isLocked ? { scale: 1.05 } : {}}
                                                        whileTap={!isLocked ? { scale: 0.95 } : {}}
                                                        disabled={isLocked}
                                                        onClick={() => {
                                                            if (!isLocked) {
                                                                navigate(`/user/domains/${domainId}/topics/${topicId}/assessment/${assessment.$id}`);
                                                            }
                                                        }}
                                                        className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${isLocked
                                                            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                                            : hasPassed
                                                                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                                                : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-xl"
                                                            }`}
                                                    >
                                                        {isLocked ? (
                                                            <>
                                                                <Lock className="w-4 h-4" />
                                                                Locked
                                                            </>
                                                        ) : hasPassed ? (
                                                            <>
                                                                Retake
                                                                <Play className="w-4 h-4" />
                                                            </>
                                                        ) : (
                                                            <>
                                                                Start Assessment
                                                                <Play className="w-4 h-4" />
                                                            </>
                                                        )}
                                                    </motion.button>
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
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {realProjects.length === 0 ? (
                                    <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                                        <Rocket className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-600 text-lg font-medium">No projects available yet</p>
                                        <p className="text-slate-500 text-sm mt-2">Check back soon for practice projects!</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {realProjects.map((project, idx) => {
                                            // Parse techStack if it's a string
                                            let techStackArray = [];
                                            try {
                                                techStackArray = typeof project.techStack === 'string'
                                                    ? project.techStack.split(',').map(t => t.trim())
                                                    : (Array.isArray(project.techStack) ? project.techStack : []);
                                            } catch (e) {
                                                techStackArray = [];
                                            }

                                            return (
                                                <motion.div
                                                    key={project.$id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    whileHover={{ y: -8, scale: 1.02 }}
                                                    className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all"
                                                >
                                                    <div className="h-2 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
                                                    <div className="p-6">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <Rocket className="w-10 h-10 text-blue-600" />
                                                        </div>

                                                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                                                            {project.title}
                                                        </h3>
                                                        <p className="text-slate-600 text-sm mb-4">
                                                            {project.description}
                                                        </p>

                                                        {techStackArray.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 mb-4">
                                                                {techStackArray.map((tech, i) => (
                                                                    <span
                                                                        key={i}
                                                                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold"
                                                                    >
                                                                        {tech}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}

                                                        <div className="flex gap-2 mt-4">
                                                            {project.githubUrl && (
                                                                <a
                                                                    href={project.githubUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex-1 py-2 px-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors text-center text-sm"
                                                                >
                                                                    GitHub
                                                                </a>
                                                            )}
                                                            {project.liveUrl && (
                                                                <a
                                                                    href={project.liveUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex-1 py-2 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all text-center text-sm"
                                                                >
                                                                    Live Demo
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence >
                </div >
                {/* COMPLETION ACTION BAR */}
                < div className="h-24" /> {/* Spacer */}
                < motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    className="fixed bottom-0 left-64 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 p-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-40 flex justify-between items-center"
                >
                    <div className="flex items-center gap-4 px-4">
                        <div className="hidden md:block">
                            <p className="text-sm font-semibold text-slate-900">
                                {isCompleted ? "Topic Completed" : "Ready to move on?"}
                            </p>
                            <p className="text-xs text-slate-500">
                                {isCompleted
                                    ? "Great job! You've mastered this topic."
                                    : "Mark this topic as complete to track your progress"
                                }
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 px-4">
                        <button
                            onClick={() => navigate('/user/domains')}
                            className="text-slate-500 hover:text-slate-900 font-medium text-sm transition-colors"
                        >
                            Back to Topics
                        </button>
                        <button
                            disabled={isCompleted || isCompleting}
                            onClick={handleCompleteTopic}
                            className={`
                                relative overflow-hidden px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2
                                ${isCompleted
                                    ? "bg-green-100 text-green-700 cursor-default"
                                    : "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5"
                                }
                            `}
                        >
                            {isCompleting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : isCompleted ? (
                                <>
                                    Completed
                                    <CheckCircle2 className="w-5 h-5" />
                                </>
                            ) : (
                                <>
                                    Mark as Completed
                                    <CheckCircle2 className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                </motion.div >

                {/* COMPLETION MODAL */}
                < AnimatePresence >
                    {showCompletionModal && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowCompletionModal(false)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center overflow-hidden"
                            >
                                {/* Background decoration */}
                                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 opacity-10" />
                                <div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-20" />
                                <div className="absolute bottom-[-50px] right-[-50px] w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20" />

                                <div className="relative">
                                    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/30">
                                        <Trophy className="w-10 h-10 text-white" />
                                    </div>

                                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Topic Completed!</h2>
                                    <p className="text-slate-600 mb-8">
                                        You're making excellent progress. Ready to tackle the next challenge?
                                    </p>

                                    <div className="space-y-3">
                                        {nextTopicId ? (
                                            <button
                                                onClick={() => {
                                                    setShowCompletionModal(false);
                                                    navigate(`/user/domains/${domainId}/topics/${nextTopicId}`);
                                                }}
                                                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group"
                                            >
                                                Start Next Topic
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => navigate('/user/domains')}
                                                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
                                            >
                                                Back to Domains
                                            </button>
                                        )}

                                        <button
                                            onClick={() => setShowCompletionModal(false)}
                                            className="w-full py-3 text-slate-500 hover:text-slate-900 font-semibold transition-colors"
                                        >
                                            Stay Here
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence >
            </main >

            {/* AI ASSISTANT PANEL */}
            < AnimatePresence >
                {showAI && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAI(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ x: 400, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 400, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col"
                        >
                            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <Brain className="w-6 h-6" />
                                        <h3 className="text-xl font-bold">AI Assistant</h3>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setShowAI(false)}
                                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                    >
                                        <XCircle className="w-5 h-5" />
                                    </motion.button>
                                </div>
                                <p className="text-purple-100 text-sm">
                                    Ask me anything about {TOPIC_DATA.title}
                                </p>
                            </div>

                            <div className="flex-1 p-6 overflow-y-auto">
                                <div className="space-y-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02, x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full text-left p-4 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200 transition-colors"
                                    >
                                        <p className="font-semibold text-purple-900 mb-1">
                                            Explain this concept
                                        </p>
                                        <p className="text-sm text-purple-700">
                                            Get a detailed explanation
                                        </p>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02, x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full text-left p-4 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors"
                                    >
                                        <p className="font-semibold text-blue-900 mb-1">
                                            Generate interview questions
                                        </p>
                                        <p className="text-sm text-blue-700">
                                            Practice for your interview
                                        </p>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02, x: 4 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full text-left p-4 bg-green-50 hover:bg-green-100 rounded-xl border border-green-200 transition-colors"
                                    >
                                        <p className="font-semibold text-green-900 mb-1">
                                            Give project ideas
                                        </p>
                                        <p className="text-sm text-green-700">
                                            Build something amazing
                                        </p>
                                    </motion.button>
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-200">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Ask me anything..."
                                        className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg"
                                    >
                                        <MessageSquare className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence >

            {/* FLOATING AI BUTTON */}
            {
                !showAI && (
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowAI(true)}
                        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center z-40"
                    >
                        <Brain className="w-8 h-8" />
                    </motion.button>
                )
            }
        </div >
    );
};

export default UserTopicDetails;
