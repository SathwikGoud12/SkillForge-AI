import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import {
    Lock,
    Unlock,
    Rocket,
    CheckCircle2,
    Clock,
    Target,
    ExternalLink,
    Github,
    Send,
    AlertCircle,
    XCircle,
    Loader
} from "lucide-react";
import DomainProjectService from "@/appwrite/DomainProjectService";
import ProjectSubmissionService from "@/appwrite/ProjectSubmissionService";
import DomainProgressService from "@/appwrite/DomainProgressService";

const projectService = new DomainProjectService();
const submissionService = new ProjectSubmissionService();
const domainProgressService = new DomainProgressService();

const DomainFinalProject = ({ domainId, userId }) => {
    const [project, setProject] = useState(null);
    const [domainProgress, setDomainProgress] = useState(null);
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    // Form state
    const [githubUrl, setGithubUrl] = useState("");
    const [liveUrl, setLiveUrl] = useState("");
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadProjectData();
    }, [domainId, userId]);

    const loadProjectData = async () => {
        setLoading(true);
        try {
            // Load domain project
            const projectData = await projectService.getProjectByDomain(domainId);
            setProject(projectData);

            // Load domain progress
            const progress = await domainProgressService.getDomainProgress(userId, domainId);
            setDomainProgress(progress);

            // Load user's submission if exists
            const userSubmission = await submissionService.getUserSubmission(userId, domainId);
            setSubmission(userSubmission);
        } catch (error) {
            console.error("Error loading project data:", error);
        } finally {
            setLoading(false);
        }
    };

    const isUnlocked = domainProgress?.isCompleted === true;
    const canSubmit = isUnlocked && (!submission || submission.status === "rejected");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!githubUrl.trim()) {
            toast.error("GitHub URL is required");
            return;
        }

        if (!description.trim()) {
            toast.error("Project description is required");
            return;
        }

        setSubmitting(true);

        try {
            const submissionData = {
                userId,
                domainId,
                projectId: project.$id,
                githubUrl: githubUrl.trim(),
                liveUrl: liveUrl.trim() || null,
                description: description.trim()
            };

            await submissionService.submitProject(submissionData);

            // Reload submission
            const newSubmission = await submissionService.getUserSubmission(userId, domainId);
            setSubmission(newSubmission);

            // Celebration
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#8b5cf6', '#6366f1', '#10b981']
            });

            toast.success("Project submitted successfully!", {
                description: "Your submission is under review.",
                duration: 5000
            });

            // Reset form and close modal
            setGithubUrl("");
            setLiveUrl("");
            setDescription("");
            setShowSubmitModal(false);
        } catch (error) {
            console.error("Error submitting project:", error);
            toast.error("Failed to submit project: " + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="bg-slate-50 rounded-2xl p-8 text-center">
                <Rocket className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600">No final project available for this domain yet.</p>
            </div>
        );
    }

    const requirements = projectService.parseRequirements(project.requirements);

    return (
        <div className="space-y-6">
            {/* Project Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-8 ${isUnlocked
                        ? "bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200"
                        : "bg-slate-100 border-2 border-slate-300"
                    }`}
            >
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center ${isUnlocked
                                    ? "bg-gradient-to-br from-purple-600 to-indigo-600"
                                    : "bg-slate-400"
                                }`}
                        >
                            {isUnlocked ? (
                                <Unlock className="w-6 h-6 text-white" />
                            ) : (
                                <Lock className="w-6 h-6 text-white" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">{project.title}</h2>
                            <p className="text-slate-600 text-sm">Final Domain Project</p>
                        </div>
                    </div>

                    {/* Status Badge */}
                    {submission && (
                        <div
                            className={`px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 ${submission.status === "approved"
                                    ? "bg-green-100 text-green-700 border-2 border-green-300"
                                    : submission.status === "pending"
                                        ? "bg-yellow-100 text-yellow-700 border-2 border-yellow-300"
                                        : "bg-red-100 text-red-700 border-2 border-red-300"
                                }`}
                        >
                            {submission.status === "approved" && <CheckCircle2 className="w-4 h-4" />}
                            {submission.status === "pending" && <Clock className="w-4 h-4" />}
                            {submission.status === "rejected" && <XCircle className="w-4 h-4" />}
                            {submission.status.toUpperCase()}
                        </div>
                    )}
                </div>

                {/* Lock Message */}
                {!isUnlocked && (
                    <div className="bg-slate-200 rounded-xl p-4 mb-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-slate-900 mb-1">Project Locked</p>
                            <p className="text-slate-700 text-sm">
                                Complete all topics and assessments in this domain to unlock the final project.
                            </p>
                        </div>
                    </div>
                )}

                {/* Project Details */}
                <div className="space-y-4">
                    <p className="text-slate-700 leading-relaxed">{project.description}</p>

                    <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-purple-600" />
                            <span className="font-semibold text-slate-700">{project.difficulty}</span>
                        </div>
                        {project.estimatedHours && (
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-purple-600" />
                                <span className="font-semibold text-slate-700">
                                    ~{project.estimatedHours} hours
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Requirements */}
            {isUnlocked && requirements.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg"
                >
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Project Requirements</h3>
                    <ul className="space-y-2">
                        {requirements.map((req, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <span className="text-slate-700">{req}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            )}

            {/* Submission Status or Submit Button */}
            {isUnlocked && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-6 shadow-lg"
                >
                    {submission ? (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-slate-900">Your Submission</h3>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-semibold text-slate-600 mb-1">GitHub Repository</p>
                                    <a
                                        href={submission.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                                    >
                                        <Github className="w-4 h-4" />
                                        {submission.githubUrl}
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>

                                {submission.liveUrl && (
                                    <div>
                                        <p className="text-sm font-semibold text-slate-600 mb-1">Live Demo</p>
                                        <a
                                            href={submission.liveUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                                        >
                                            {submission.liveUrl}
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                )}

                                <div>
                                    <p className="text-sm font-semibold text-slate-600 mb-1">Description</p>
                                    <p className="text-slate-700">{submission.description}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-slate-600 mb-1">Submitted</p>
                                    <p className="text-slate-700">
                                        {new Date(submission.submittedAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>

                                {submission.reviewNotes && (
                                    <div className="bg-slate-50 rounded-xl p-4">
                                        <p className="text-sm font-semibold text-slate-600 mb-1">Review Feedback</p>
                                        <p className="text-slate-700">{submission.reviewNotes}</p>
                                    </div>
                                )}
                            </div>

                            {submission.status === "rejected" && (
                                <button
                                    onClick={() => setShowSubmitModal(true)}
                                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <Send className="w-5 h-5" />
                                    Resubmit Project
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="text-center space-y-4">
                            <Rocket className="w-16 h-16 text-purple-600 mx-auto" />
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to Submit?</h3>
                                <p className="text-slate-600">
                                    Complete the project and submit your work for review.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowSubmitModal(true)}
                                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 mx-auto"
                            >
                                <Send className="w-5 h-5" />
                                Submit Project
                            </button>
                        </div>
                    )}
                </motion.div>
            )}

            {/* Submit Modal */}
            <AnimatePresence>
                {showSubmitModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowSubmitModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8"
                        >
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Submit Your Project</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        GitHub Repository URL *
                                    </label>
                                    <input
                                        type="url"
                                        value={githubUrl}
                                        onChange={(e) => setGithubUrl(e.target.value)}
                                        placeholder="https://github.com/username/project"
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Live Demo URL (Optional)
                                    </label>
                                    <input
                                        type="url"
                                        value={liveUrl}
                                        onChange={(e) => setLiveUrl(e.target.value)}
                                        placeholder="https://your-project.vercel.app"
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Project Description *
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Describe what you built, technologies used, and any challenges you overcame..."
                                        rows={5}
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors resize-none"
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowSubmitModal(false)}
                                        className="flex-1 py-3 px-6 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader className="w-5 h-5 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Submit
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DomainFinalProject;
