/**
 * AI Assessment Generator Component
 * Generates complete assessments with AI
 */

import { useState, useEffect } from 'react';
import { aiService } from '@/services/ai.service';
import { FileQuestion, Loader2, RefreshCw } from 'lucide-react';

export function AIAssessmentGenerator({ topic, domain, onAssessmentGenerated }) {
    const [loading, setLoading] = useState(false);
    const [assessment, setAssessment] = useState(null);
    const [config, setConfig] = useState({
        questionCount: 10,
        difficulty: 'medium',
        types: ['mcq', 'true-false']
    });

    const generateAssessment = async () => {
        setLoading(true);

        try {
            const result = await aiService.generateAssessment(
                topic.name,
                domain?.name || '',
                config.questionCount,
                config.difficulty,
                config.types
            );

            setAssessment(result);

            // Callback to parent component
            if (onAssessmentGenerated) {
                onAssessmentGenerated(result);
            }
        } catch (err) {
            console.error('Assessment Generation Error:', err);
            alert('Failed to generate assessment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-assessment-generator">
            <div className="generator-header">
                <FileQuestion className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold">AI Assessment Generator</h3>
            </div>

            <div className="generator-config">
                <div className="config-row">
                    <label>Number of Questions</label>
                    <select
                        value={config.questionCount}
                        onChange={(e) => setConfig({ ...config, questionCount: parseInt(e.target.value) })}
                        disabled={loading}
                        className="select-primary"
                    >
                        <option value={5}>5 Questions</option>
                        <option value={10}>10 Questions</option>
                        <option value={15}>15 Questions</option>
                        <option value={20}>20 Questions</option>
                    </select>
                </div>

                <div className="config-row">
                    <label>Difficulty</label>
                    <select
                        value={config.difficulty}
                        onChange={(e) => setConfig({ ...config, difficulty: e.target.value })}
                        disabled={loading}
                        className="select-primary"
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>

                <div className="config-row">
                    <label>Question Types</label>
                    <div className="checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={config.types.includes('mcq')}
                                onChange={(e) => {
                                    const types = e.target.checked
                                        ? [...config.types, 'mcq']
                                        : config.types.filter(t => t !== 'mcq');
                                    setConfig({ ...config, types });
                                }}
                                disabled={loading}
                            />
                            Multiple Choice
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={config.types.includes('true-false')}
                                onChange={(e) => {
                                    const types = e.target.checked
                                        ? [...config.types, 'true-false']
                                        : config.types.filter(t => t !== 'true-false');
                                    setConfig({ ...config, types });
                                }}
                                disabled={loading}
                            />
                            True/False
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={config.types.includes('short-answer')}
                                onChange={(e) => {
                                    const types = e.target.checked
                                        ? [...config.types, 'short-answer']
                                        : config.types.filter(t => t !== 'short-answer');
                                    setConfig({ ...config, types });
                                }}
                                disabled={loading}
                            />
                            Short Answer
                        </label>
                    </div>
                </div>

                <button
                    onClick={generateAssessment}
                    disabled={loading || config.types.length === 0}
                    className="btn-primary flex items-center gap-2 w-full"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Generating Assessment...
                        </>
                    ) : (
                        <>
                            <FileQuestion className="w-5 h-5" />
                            Generate AI Assessment
                        </>
                    )}
                </button>
            </div>

            {assessment && !loading && (
                <div className="assessment-preview">
                    <div className="preview-header">
                        <h4 className="font-semibold">Assessment Preview</h4>
                        <button
                            onClick={generateAssessment}
                            className="btn-secondary-sm flex items-center gap-1"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Regenerate
                        </button>
                    </div>

                    <div className="preview-stats">
                        <div className="stat">
                            <span className="stat-label">Questions:</span>
                            <span className="stat-value">{assessment.totalQuestions}</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Difficulty:</span>
                            <span className="stat-value">{assessment.difficulty}</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Generated:</span>
                            <span className="stat-value">
                                {new Date(assessment.generatedAt).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>

                    <div className="preview-questions">
                        {assessment.assessment.slice(0, 3).map((q, idx) => (
                            <div key={idx} className="question-preview">
                                <p className="question-text">
                                    <strong>Q{idx + 1}:</strong> {q.question}
                                </p>
                                {q.type === 'mcq' && (
                                    <ul className="options-list">
                                        {q.options.map((opt, i) => (
                                            <li key={i} className={opt === q.correctAnswer ? 'correct' : ''}>
                                                {opt}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                        {assessment.assessment.length > 3 && (
                            <p className="text-sm text-gray-500">
                                ... and {assessment.assessment.length - 3} more questions
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
