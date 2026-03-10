/**
 * AI Learning Roadmap Component - Premium UI
 * Generates personalized learning paths with beautiful timeline display
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from '@/services/ai.service';
import {
    Map, Loader2, Target, Calendar, TrendingUp,
    CheckCircle2, BookOpen, Lightbulb, ChevronDown,
    ChevronUp, Sparkles, Clock, Zap, ArrowRight, Star
} from 'lucide-react';
import { toast } from 'sonner';

export function AILearningRoadmap({ domain, userProfile }) {
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(false);
    const [expandedPhase, setExpandedPhase] = useState(0); // first phase open by default
    const [config, setConfig] = useState({
        currentLevel: userProfile?.level || 'beginner',
        timeframe: '3 months',
        goals: [],
        weakAreas: []
    });
    const [goalInput, setGoalInput] = useState('');
    const [weakAreaInput, setWeakAreaInput] = useState('');

    const addGoal = () => {
        if (goalInput.trim()) {
            setConfig({ ...config, goals: [...config.goals, goalInput.trim()] });
            setGoalInput('');
        }
    };

    const addWeakArea = () => {
        if (weakAreaInput.trim()) {
            setConfig({ ...config, weakAreas: [...config.weakAreas, weakAreaInput.trim()] });
            setWeakAreaInput('');
        }
    };

    const removeGoal = (index) => {
        setConfig({ ...config, goals: config.goals.filter((_, i) => i !== index) });
    };

    const removeWeakArea = (index) => {
        setConfig({ ...config, weakAreas: config.weakAreas.filter((_, i) => i !== index) });
    };

    const generateRoadmap = async () => {
        if (!domain || !domain.name) {
            toast.error('Please select a domain or set your target role in your profile.');
            return;
        }
        if (config.goals.length === 0) {
            toast.error('Please add at least one learning goal.');
            return;
        }

        setLoading(true);
        toast.info('Generating your personalized roadmap...');

        try {
            const result = await aiService.createRoadmap(
                domain.name,
                config.currentLevel,
                config.goals,
                config.timeframe,
                config.weakAreas
            );
            console.log('Roadmap result:', result);
            setRoadmap(result);
            setExpandedPhase(0);
            toast.success('Your personalized roadmap is ready! 🚀');
        } catch (err) {
            console.error('Roadmap Generation Error:', err);
            toast.error(err.message || 'Failed to generate roadmap. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Parse roadmap.roadmap if it's a raw JSON string (AI sometimes returns markdown code blocks)
    const parseRoadmapString = (raw) => {
        if (!raw) return null;
        if (typeof raw === 'object') return raw; // already parsed
        try {
            // Strip markdown code fences: ```json ... ``` or ``` ... ```
            let cleaned = raw
                .replace(/^```[a-z]*\n?/i, '')
                .replace(/\n?```\s*$/i, '')
                .trim();
            return JSON.parse(cleaned);
        } catch (e) {
            console.warn('Could not parse roadmap string:', e);
            return null;
        }
    };

    // Flexibly extract phases from different possible AI response structures
    const getPhases = () => {
        if (!roadmap) return [];
        // roadmap.roadmap might be a JSON string — parse it first
        const parsed = parseRoadmapString(roadmap?.roadmap);
        if (parsed?.phases) return parsed.phases;
        if (parsed?.roadmap?.phases) return parsed.roadmap.phases;
        // Direct fallbacks
        if (roadmap?.phases) return roadmap.phases;
        return [];
    };

    const getTips = () => {
        if (!roadmap) return [];
        const parsed = parseRoadmapString(roadmap?.roadmap);
        if (parsed?.tips) return parsed.tips;
        if (parsed?.roadmap?.tips) return parsed.roadmap.tips;
        if (roadmap?.tips) return roadmap.tips;
        return [];
    };

    const phases = getPhases();
    const tips = getTips();

    const phaseColors = [
        { bg: 'from-violet-500 to-purple-600', light: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', dot: 'bg-violet-500' },
        { bg: 'from-blue-500 to-cyan-600', light: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', dot: 'bg-blue-500' },
        { bg: 'from-emerald-500 to-teal-600', light: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
        { bg: 'from-orange-500 to-red-500', light: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', dot: 'bg-orange-500' },
    ];

    return (
        <div className="w-full">
            {/* Config Panel */}
            {!roadmap && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {/* Level + Timeframe Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-indigo-200 mb-2">Current Level</label>
                            <select
                                value={config.currentLevel}
                                onChange={(e) => setConfig({ ...config, currentLevel: e.target.value })}
                                className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl focus:border-indigo-400 focus:outline-none font-medium text-white transition-colors backdrop-blur-sm"
                            >
                                <option value="beginner">🌱 Beginner</option>
                                <option value="intermediate">🌿 Intermediate</option>
                                <option value="advanced">🌳 Advanced</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-indigo-200 mb-2">Timeframe</label>
                            <select
                                value={config.timeframe}
                                onChange={(e) => setConfig({ ...config, timeframe: e.target.value })}
                                className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl focus:border-indigo-400 focus:outline-none font-medium text-white transition-colors backdrop-blur-sm"
                            >
                                <option value="1 month">1 Month</option>
                                <option value="3 months">3 Months</option>
                                <option value="6 months">6 Months</option>
                                <option value="1 year">1 Year</option>
                            </select>
                        </div>
                    </div>

                    {/* Learning Goals */}
                    <div>
                        <label className="block text-sm font-bold text-indigo-200 mb-2">
                            <Target className="w-4 h-4 inline mr-1 text-indigo-400" />
                            Learning Goals <span className="text-red-400">*</span>
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={goalInput}
                                onChange={(e) => setGoalInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addGoal()}
                                placeholder="e.g., Build a full-stack app"
                                className="flex-1 px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl focus:border-indigo-400 focus:outline-none transition-colors text-white placeholder-white/40 backdrop-blur-sm"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={addGoal}
                                className="px-5 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                            >
                                Add
                            </motion.button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {config.goals.map((goal, idx) => (
                                <motion.span
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold"
                                >
                                    <Target className="w-3 h-3" />
                                    {goal}
                                    <button onClick={() => removeGoal(idx)} className="ml-1 hover:text-indigo-600 text-indigo-400 font-bold">×</button>
                                </motion.span>
                            ))}
                        </div>
                    </div>

                    {/* Weak Areas */}
                    <div>
                        <label className="block text-sm font-bold text-indigo-200 mb-2">
                            <Zap className="w-4 h-4 inline mr-1 text-amber-400" />
                            Weak Areas <span className="text-white/40 text-xs font-normal">(optional)</span>
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={weakAreaInput}
                                onChange={(e) => setWeakAreaInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addWeakArea()}
                                placeholder="e.g., Async programming"
                                className="flex-1 px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl focus:border-amber-400 focus:outline-none transition-colors text-white placeholder-white/40 backdrop-blur-sm"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={addWeakArea}
                                className="px-5 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-colors"
                            >
                                Add
                            </motion.button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {config.weakAreas.map((area, idx) => (
                                <motion.span
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold"
                                >
                                    {area}
                                    <button onClick={() => removeWeakArea(idx)} className="ml-1 hover:text-amber-600 text-amber-400 font-bold">×</button>
                                </motion.span>
                            ))}
                        </div>
                    </div>

                    {/* Generate Button */}
                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(99,102,241,0.3)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={generateRoadmap}
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl disabled:opacity-60 transition-all"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Creating Your Personalized Roadmap...
                            </>
                        ) : (
                            <>
                                <Map className="w-6 h-6" />
                                Generate My Learning Roadmap
                                <Sparkles className="w-5 h-5" />
                            </>
                        )}
                    </motion.button>
                </motion.div>
            )}

            {/* Roadmap Result */}
            {roadmap && !loading && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                >
                    {/* Summary Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-3">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-bold">
                                <TrendingUp className="w-4 h-4" />
                                Level: {roadmap.currentLevel || config.currentLevel}
                            </span>
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-bold">
                                <Calendar className="w-4 h-4" />
                                Duration: {roadmap.timeframe || config.timeframe}
                            </span>
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-bold">
                                <BookOpen className="w-4 h-4" />
                                {phases.length} Phases
                            </span>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setRoadmap(null)}
                            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors"
                        >
                            Regenerate
                        </motion.button>
                    </div>

                    {/* Phase Timeline */}
                    {phases.length > 0 ? (
                        <div className="space-y-4">
                            {phases.map((phase, idx) => {
                                const color = phaseColors[idx % phaseColors.length];
                                const isOpen = expandedPhase === idx;
                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={`rounded-2xl border-2 ${color.border} overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
                                    >
                                        {/* Phase Header — always visible */}
                                        <button
                                            onClick={() => setExpandedPhase(isOpen ? -1 : idx)}
                                            className={`w-full text-left p-5 flex items-center justify-between ${color.light} transition-colors hover:brightness-95`}
                                        >
                                            <div className="flex items-center gap-4">
                                                {/* Phase number circle */}
                                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color.bg} flex items-center justify-center text-white font-black text-lg shadow-md flex-shrink-0`}>
                                                    {phase.phase || idx + 1}
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-black text-slate-900">
                                                        {phase.title || `Phase ${idx + 1}`}
                                                    </h4>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className={`text-xs font-bold ${color.text} flex items-center gap-1`}>
                                                            <Clock className="w-3 h-3" />
                                                            {phase.duration || 'Duration TBD'}
                                                        </span>
                                                        {phase.topics && (
                                                            <span className="text-xs font-semibold text-slate-500">
                                                                {phase.topics.length} topics
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`${color.text}`}>
                                                {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                            </div>
                                        </button>

                                        {/* Phase Details — collapsible */}
                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-5 bg-white grid grid-cols-1 md:grid-cols-2 gap-5">
                                                        {/* Topics to Cover */}
                                                        {phase.topics && phase.topics.length > 0 && (
                                                            <div>
                                                                <h5 className="flex items-center gap-2 font-black text-slate-800 mb-3 text-sm uppercase tracking-wide">
                                                                    <BookOpen className={`w-4 h-4 ${color.text}`} />
                                                                    Topics to Cover
                                                                </h5>
                                                                <ul className="space-y-2">
                                                                    {phase.topics.map((topic, i) => (
                                                                        <motion.li
                                                                            key={i}
                                                                            initial={{ opacity: 0, x: -10 }}
                                                                            animate={{ opacity: 1, x: 0 }}
                                                                            transition={{ delay: i * 0.05 }}
                                                                            className="flex items-start gap-2 text-slate-700 text-sm"
                                                                        >
                                                                            <div className={`w-2 h-2 rounded-full ${color.dot} mt-1.5 flex-shrink-0`} />
                                                                            {topic}
                                                                        </motion.li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        {/* Objectives */}
                                                        {phase.objectives && phase.objectives.length > 0 && (
                                                            <div>
                                                                <h5 className="flex items-center gap-2 font-black text-slate-800 mb-3 text-sm uppercase tracking-wide">
                                                                    <CheckCircle2 className={`w-4 h-4 ${color.text}`} />
                                                                    What You'll Achieve
                                                                </h5>
                                                                <ul className="space-y-2">
                                                                    {phase.objectives.map((obj, i) => (
                                                                        <motion.li
                                                                            key={i}
                                                                            initial={{ opacity: 0, x: -10 }}
                                                                            animate={{ opacity: 1, x: 0 }}
                                                                            transition={{ delay: i * 0.05 }}
                                                                            className="flex items-start gap-2 text-slate-700 text-sm"
                                                                        >
                                                                            <ArrowRight className={`w-4 h-4 ${color.text} mt-0.5 flex-shrink-0`} />
                                                                            {obj}
                                                                        </motion.li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}

                                                        {/* Resources (if returned) */}
                                                        {phase.resources && phase.resources.length > 0 && (
                                                            <div className="md:col-span-2">
                                                                <h5 className="flex items-center gap-2 font-black text-slate-800 mb-3 text-sm uppercase tracking-wide">
                                                                    <Star className={`w-4 h-4 ${color.text}`} />
                                                                    Recommended Resources
                                                                </h5>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {phase.resources.map((res, i) => (
                                                                        <span key={i} className={`px-3 py-1 ${color.light} ${color.text} rounded-full text-xs font-bold border ${color.border}`}>
                                                                            {res}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Milestone (if returned) */}
                                                        {phase.milestone && (
                                                            <div className="md:col-span-2">
                                                                <div className={`p-4 ${color.light} rounded-xl border ${color.border}`}>
                                                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Phase Milestone</p>
                                                                    <p className={`font-bold ${color.text}`}>{phase.milestone}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Fallback: show raw roadmap text if phases array is empty */
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                            <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono">
                                {JSON.stringify(roadmap, null, 2)}
                            </pre>
                        </div>
                    )}

                    {/* Tips Section */}
                    {tips.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200"
                        >
                            <h3 className="flex items-center gap-2 text-lg font-black text-amber-900 mb-4">
                                <Lightbulb className="w-5 h-5 text-amber-500" />
                                Pro Tips for Success
                            </h3>
                            <ul className="space-y-3">
                                {tips.map((tip, idx) => (
                                    <motion.li
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.08 }}
                                        className="flex items-start gap-3 text-amber-800 text-sm"
                                    >
                                        <span className="w-6 h-6 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                                            {idx + 1}
                                        </span>
                                        {tip}
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
