/**
 * AI Learning Roadmap Component
 * Generates personalized learning paths
 */

import { useState } from 'react';
import { aiService } from '@/services/ai.service';
import { Map, Loader2, Target, Calendar, TrendingUp } from 'lucide-react';
import { toast, Toaster } from 'sonner';

export function AILearningRoadmap({ domain, userProfile }) {
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(false);
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
        // Validation: Check if domain exists and has a name
        if (!domain || !domain.name) {
            toast.error('Please select a domain or set your target role in your profile to generate a roadmap.');
            return;
        }

        // Validation: Check if at least one goal is added
        if (config.goals.length === 0) {
            toast.error('Please add at least one learning goal to generate a personalized roadmap.');
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

            setRoadmap(result);
            toast.success('Your personalized roadmap is ready! 🚀');
        } catch (err) {
            console.error('Roadmap Generation Error:', err);
            const errorMessage = err.message || 'Failed to generate roadmap. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-roadmap">
            <Toaster position="top-right" richColors />
            <div className="roadmap-header">
                <Map className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold">AI Learning Roadmap</h2>
            </div>

            <div className="roadmap-config">
                <div className="config-section">
                    <label>Current Level</label>
                    <select
                        value={config.currentLevel}
                        onChange={(e) => setConfig({ ...config, currentLevel: e.target.value })}
                        className="select-primary"
                    >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>

                <div className="config-section">
                    <label>Timeframe</label>
                    <select
                        value={config.timeframe}
                        onChange={(e) => setConfig({ ...config, timeframe: e.target.value })}
                        className="select-primary"
                    >
                        <option value="1 month">1 Month</option>
                        <option value="3 months">3 Months</option>
                        <option value="6 months">6 Months</option>
                        <option value="1 year">1 Year</option>
                    </select>
                </div>

                <div className="config-section">
                    <label>Learning Goals</label>
                    <div className="input-with-button">
                        <input
                            type="text"
                            value={goalInput}
                            onChange={(e) => setGoalInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                            placeholder="e.g., Build a full-stack app"
                            className="input-primary"
                        />
                        <button onClick={addGoal} className="btn-secondary-sm">
                            Add
                        </button>
                    </div>
                    <div className="tags-list">
                        {config.goals.map((goal, idx) => (
                            <span key={idx} className="tag">
                                <Target className="w-3 h-3" />
                                {goal}
                                <button onClick={() => removeGoal(idx)} className="tag-remove">×</button>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="config-section">
                    <label>Weak Areas (Optional)</label>
                    <div className="input-with-button">
                        <input
                            type="text"
                            value={weakAreaInput}
                            onChange={(e) => setWeakAreaInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addWeakArea()}
                            placeholder="e.g., Async programming"
                            className="input-primary"
                        />
                        <button onClick={addWeakArea} className="btn-secondary-sm">
                            Add
                        </button>
                    </div>
                    <div className="tags-list">
                        {config.weakAreas.map((area, idx) => (
                            <span key={idx} className="tag tag-warning">
                                {area}
                                <button onClick={() => removeWeakArea(idx)} className="tag-remove">×</button>
                            </span>
                        ))}
                    </div>
                </div>

                <button
                    onClick={generateRoadmap}
                    disabled={loading}
                    className="btn-primary flex items-center gap-2 w-full"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Creating Your Roadmap...
                        </>
                    ) : (
                        <>
                            <Map className="w-5 h-5" />
                            Generate Personalized Roadmap
                        </>
                    )}
                </button>
            </div>

            {roadmap && !loading && (
                <div className="roadmap-result">
                    <div className="roadmap-meta">
                        <div className="meta-item">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <span>Level: {roadmap.currentLevel}</span>
                        </div>
                        <div className="meta-item">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <span>Duration: {roadmap.timeframe}</span>
                        </div>
                    </div>

                    {roadmap.roadmap.phases && (
                        <div className="roadmap-phases">
                            <h3 className="text-lg font-bold mb-4">Learning Phases</h3>
                            {roadmap.roadmap.phases.map((phase, idx) => (
                                <div key={idx} className="phase-card">
                                    <div className="phase-header">
                                        <span className="phase-number">Phase {phase.phase}</span>
                                        <h4 className="phase-title">{phase.title}</h4>
                                        <span className="phase-duration">{phase.duration}</span>
                                    </div>

                                    <div className="phase-content">
                                        <div className="phase-section">
                                            <h5>Topics to Cover</h5>
                                            <ul>
                                                {phase.topics.map((topic, i) => (
                                                    <li key={i}>{topic}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="phase-section">
                                            <h5>Objectives</h5>
                                            <ul>
                                                {phase.objectives.map((obj, i) => (
                                                    <li key={i}>{obj}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {roadmap.roadmap.tips && (
                        <div className="roadmap-tips">
                            <h3 className="text-lg font-bold mb-3">💡 Tips for Success</h3>
                            <ul>
                                {roadmap.roadmap.tips.map((tip, idx) => (
                                    <li key={idx}>{tip}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
