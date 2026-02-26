import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import confetti from "canvas-confetti";
import {
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Trophy,
    ArrowRight,
    ArrowLeft,
    Flag,
    Brain,
    Target,
} from "lucide-react";
import AppwriteAccount from "@/appwrite/Account.services";
import AssessmentService from "@/appwrite/AssessmentSevice";
import AssessmentAttemptService from "@/appwrite/AssessmentAttemptService";
import UserTopicProgressService from "@/appwrite/UserTopicProgressService";

const appwriteAccount = new AppwriteAccount();
const assessmentService = new AssessmentService();
const attemptService = new AssessmentAttemptService();
const progressService = new UserTopicProgressService();

const AssessmentAttempt = () => {
    const { domainId, topicId, assessmentId } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [assessment, setAssessment] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState(null);
    const [attemptCount, setAttemptCount] = useState(0);

    // Initialize assessment
    useEffect(() => {
        const init = async () => {
            try {
                const currentUser = await appwriteAccount.getAppwriteUser();
                if (!currentUser) {
                    window.location.href = "/"; // No session, go to landing page
                    return;
                }
                setUser(currentUser);

                // Fetch assessment details
                const assessmentData = await assessmentService.getAssessmentById(assessmentId);
                setAssessment(assessmentData);

                // Parse questions from assessment (stored in 'question' field)
                try {
                    const parsedQuestions = JSON.parse(assessmentData.question || "[]");

                    // Validate that it's an array
                    if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
                        throw new Error("Invalid assessment format: No questions found");
                    }

                    setQuestions(parsedQuestions);
                } catch (parseError) {
                    console.error("Error parsing questions:", parseError);
                    toast.error("This assessment uses an old format. Please contact admin to update it.");
                    navigate(-1);
                    return;
                }

                // Set timer (convert minutes to seconds)
                const durationInSeconds = parseInt(assessmentData.duration) * 60;
                setTimeRemaining(durationInSeconds);

                // Get attempt count
                const count = await attemptService.getAttemptCount(currentUser.$id, assessmentId);
                setAttemptCount(count + 1);
            } catch (error) {
                console.error("Error initializing assessment:", error);
                toast.error("Failed to load assessment");
                navigate(-1);
            }
        };

        init();
    }, [assessmentId, navigate]);

    // Timer countdown
    useEffect(() => {
        if (timeRemaining <= 0 || showResult) return;

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining, showResult]);

    // Format time as MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    // Handle answer selection
    const handleAnswerSelect = (questionId, selectedOption) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: selectedOption,
        }));
    };

    // Navigate questions
    const goToNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const goToPreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    // Calculate score and evaluate
    const evaluateAnswers = () => {
        let correctCount = 0;
        questions.forEach((q) => {
            if (answers[q.id] === q.correctAnswer) {
                correctCount++;
            }
        });

        const score = Math.round((correctCount / questions.length) * 100);
        const passingScore = assessment.passingScore || 70;
        const passed = score >= passingScore;

        return { score, passed, correctCount, totalQuestions: questions.length };
    };

    // Submit assessment
    const handleSubmit = async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            const evaluation = evaluateAnswers();

            // Save attempt to database
            const attemptData = {
                userId: user.$id,
                assessmentId: assessmentId,
                topicId: topicId,
                domainId: domainId,
                answers: JSON.stringify(answers),
                score: evaluation.score,
                passed: evaluation.passed,
                attemptNumber: attemptCount,
                completedAt: new Date().toISOString(),
            };

            await attemptService.createAttempt(attemptData);

            // Update topic progress if passed
            if (evaluation.passed) {
                // Check if this unlocks topic completion
                await updateTopicProgress();
            }

            setResult(evaluation);
            setShowResult(true);

            // Celebration if passed
            if (evaluation.passed) {
                confetti({
                    particleCount: 200,
                    spread: 100,
                    origin: { y: 0.6 },
                    colors: ["#10b981", "#34d399", "#6ee7b7"],
                });
            }
        } catch (error) {
            console.error("Error submitting assessment:", error);
            toast.error("Failed to submit assessment");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Update topic progress based on assessment results
    const updateTopicProgress = async () => {
        try {
            // Get all assessments for this topic
            const topicAssessments = await assessmentService.getAssessmentsByTopic(topicId);
            const allAssessments = topicAssessments.rows || [];

            // Check which assessments are passed
            let passedCount = 0;
            for (const assess of allAssessments) {
                const hasPassed = await attemptService.hasPassed(user.$id, assess.$id);
                if (hasPassed) passedCount++;
            }

            // Calculate progress percentage
            const progressPercent = Math.round((passedCount / allAssessments.length) * 100);

            // Topic is completed if all required assessments are passed
            const isCompleted = passedCount === allAssessments.length;

            // Update progress
            await progressService.upsertProgress({
                userId: user.$id,
                topicId: topicId,
                domainId: domainId,
                progress: progressPercent,
                completed: isCompleted,
            });
        } catch (error) {
            console.error("Error updating topic progress:", error);
        }
    };

    const currentQuestion = questions[currentQuestionIndex];
    const answeredCount = Object.keys(answers).length;
    const progressPercent = (answeredCount / questions.length) * 100;

    if (!assessment || !currentQuestion) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading assessment...</p>
                </div>
            </div>
        );
    }

    if (showResult) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
                <Toaster position="top-right" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full"
                >
                    <div className="text-center">
                        {/* Result Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${result.passed
                                ? "bg-gradient-to-br from-green-400 to-emerald-600"
                                : "bg-gradient-to-br from-red-400 to-rose-600"
                                }`}
                        >
                            {result.passed ? (
                                <Trophy className="w-12 h-12 text-white" />
                            ) : (
                                <Target className="w-12 h-12 text-white" />
                            )}
                        </motion.div>

                        {/* Result Status */}
                        <h2 className="text-4xl font-bold text-slate-900 mb-2">
                            {result.passed ? "Congratulations!" : "Keep Practicing!"}
                        </h2>
                        <p className="text-slate-600 mb-8">
                            {result.passed
                                ? "You've successfully passed this assessment!"
                                : "Don't give up! Review the material and try again."}
                        </p>

                        {/* Score Display */}
                        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 mb-6">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <p className="text-slate-600 text-sm mb-1">Score</p>
                                    <p className="text-3xl font-bold text-purple-600">{result.score}%</p>
                                </div>
                                <div>
                                    <p className="text-slate-600 text-sm mb-1">Correct</p>
                                    <p className="text-3xl font-bold text-green-600">
                                        {result.correctCount}/{result.totalQuestions}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-600 text-sm mb-1">Attempt</p>
                                    <p className="text-3xl font-bold text-indigo-600">#{attemptCount}</p>
                                </div>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div
                            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold mb-8 ${result.passed
                                ? "bg-green-100 text-green-700 border-2 border-green-300"
                                : "bg-red-100 text-red-700 border-2 border-red-300"
                                }`}
                        >
                            {result.passed ? (
                                <>
                                    <CheckCircle2 className="w-5 h-5" />
                                    PASSED
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-5 h-5" />
                                    FAILED
                                </>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            {!result.passed && (
                                <button
                                    onClick={() => window.location.reload()}
                                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    Retry Assessment
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            )}
                            <button
                                onClick={() => navigate(`/user/domains/${domainId}/topics/${topicId}`)}
                                className="w-full py-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                            >
                                Back to Topic
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-5xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">{assessment.title}</h1>
                            <p className="text-sm text-slate-600">
                                Question {currentQuestionIndex + 1} of {questions.length}
                            </p>
                        </div>

                        {/* Timer */}
                        <div
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold ${timeRemaining < 60
                                ? "bg-red-100 text-red-700 animate-pulse"
                                : "bg-purple-100 text-purple-700"
                                }`}
                        >
                            <Clock className="w-5 h-5" />
                            {formatTime(timeRemaining)}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            className="h-full bg-gradient-to-r from-purple-600 to-indigo-600"
                        />
                    </div>
                </div>
            </div>

            {/* Question Content */}
            <div className="max-w-5xl mx-auto px-6 py-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestionIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white rounded-2xl shadow-lg p-8 mb-6"
                    >
                        {/* Question */}
                        <div className="mb-6">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                                    {currentQuestionIndex + 1}
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 flex-1">
                                    {currentQuestion.question}
                                </h2>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="space-y-3">
                            {currentQuestion.options.map((option, idx) => {
                                const optionKey = String.fromCharCode(65 + idx); // A, B, C, D
                                const isSelected = answers[currentQuestion.id] === optionKey;

                                return (
                                    <motion.button
                                        key={idx}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => handleAnswerSelect(currentQuestion.id, optionKey)}
                                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${isSelected
                                            ? "border-purple-600 bg-purple-50"
                                            : "border-slate-200 hover:border-purple-300 bg-white"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${isSelected
                                                    ? "border-purple-600 bg-purple-600 text-white"
                                                    : "border-slate-300 text-slate-600"
                                                    }`}
                                            >
                                                {optionKey}
                                            </div>
                                            <span className="text-slate-700 font-medium">{option}</span>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between gap-4">
                    <button
                        onClick={goToPreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Previous
                    </button>

                    <div className="flex items-center gap-2">
                        {questions.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentQuestionIndex(idx)}
                                className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all ${idx === currentQuestionIndex
                                    ? "bg-purple-600 text-white"
                                    : answers[questions[idx].id]
                                        ? "bg-green-100 text-green-700 border-2 border-green-300"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>

                    {currentQuestionIndex === questions.length - 1 ? (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg disabled:opacity-50 transition-all"
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                            <Flag className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            onClick={goToNextQuestion}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg transition-all"
                        >
                            Next
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssessmentAttempt;
