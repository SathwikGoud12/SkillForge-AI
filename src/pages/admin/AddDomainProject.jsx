import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
    FileText,
    Plus,
    X,
    Save,
    ArrowLeft,
    Rocket,
    Clock,
    Target
} from "lucide-react";
import DomainProjectService from "@/appwrite/DomainProjectService";

const projectService = new DomainProjectService();

const AddDomainProject = () => {
    const { domainId } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [difficulty, setDifficulty] = useState("Advanced");
    const [estimatedHours, setEstimatedHours] = useState(40);
    const [requirements, setRequirements] = useState([""]);
    const [loading, setLoading] = useState(false);

    const addRequirement = () => {
        setRequirements([...requirements, ""]);
    };

    const removeRequirement = (index) => {
        setRequirements(requirements.filter((_, i) => i !== index));
    };

    const updateRequirement = (index, value) => {
        const updated = [...requirements];
        updated[index] = value;
        setRequirements(updated);
    };

    const validateForm = () => {
        if (!title.trim()) {
            toast.error("Please enter project title");
            return false;
        }

        if (!description.trim()) {
            toast.error("Please enter project description");
            return false;
        }

        const validRequirements = requirements.filter(r => r.trim());
        if (validRequirements.length === 0) {
            toast.error("Please add at least one requirement");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            // Filter out empty requirements
            const validRequirements = requirements.filter(r => r.trim());

            const projectData = {
                domainId,
                title: title.trim(),
                description: description.trim(),
                requirements: JSON.stringify(validRequirements),
                difficulty,
                estimatedHours: parseInt(estimatedHours)
            };

            await projectService.createProject(projectData);

            toast.success("Domain project created successfully!");
            navigate(`/dashboard/domains/${domainId}/topics`);
        } catch (error) {
            console.error("Error creating project:", error);
            toast.error("Failed to create project: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                            <Rocket className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">
                                Create Final Domain Project
                            </h1>
                            <p className="text-slate-600">
                                Define the capstone project for this domain
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
                >
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Project Title *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Full-Stack E-Commerce Platform"
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Project Description *
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Detailed description of the project, what students will build, and what they'll learn..."
                            rows={6}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors resize-none"
                        />
                    </div>

                    {/* Difficulty & Estimated Hours */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                <Target className="w-4 h-4 inline mr-1" />
                                Difficulty *
                            </label>
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors"
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                <Clock className="w-4 h-4 inline mr-1" />
                                Estimated Hours
                            </label>
                            <input
                                type="number"
                                value={estimatedHours}
                                onChange={(e) => setEstimatedHours(e.target.value)}
                                min="1"
                                max="500"
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-600 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {/* Requirements */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-semibold text-slate-700">
                                <FileText className="w-4 h-4 inline mr-1" />
                                Project Requirements *
                            </label>
                            <button
                                type="button"
                                onClick={addRequirement}
                                className="flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                            >
                                <Plus className="w-4 h-4" />
                                Add Requirement
                            </button>
                        </div>

                        <div className="space-y-3">
                            {requirements.map((req, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <span className="text-slate-500 font-medium min-w-[30px]">
                                        {index + 1}.
                                    </span>
                                    <input
                                        type="text"
                                        value={req}
                                        onChange={(e) => updateRequirement(index, e.target.value)}
                                        placeholder="e.g., User authentication with JWT"
                                        className="flex-1 px-4 py-2.5 border-2 border-slate-200 rounded-lg focus:border-purple-600 focus:outline-none transition-colors"
                                    />
                                    {requirements.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeRequirement(index)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
                        <h3 className="font-bold text-slate-900 mb-3">Preview</h3>
                        <div className="space-y-2 text-sm">
                            <p><span className="font-semibold">Title:</span> {title || "Not set"}</p>
                            <p><span className="font-semibold">Difficulty:</span> {difficulty}</p>
                            <p><span className="font-semibold">Estimated Time:</span> {estimatedHours} hours</p>
                            <p><span className="font-semibold">Requirements:</span> {requirements.filter(r => r.trim()).length}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 py-3 px-6 border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Create Project
                                </>
                            )}
                        </button>
                    </div>
                </motion.form>
            </div>
        </div>
    );
};

export default AddDomainProject;
