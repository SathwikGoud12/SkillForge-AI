/**
 * AI Concept Explainer Component
 * Provides simple explanations for complex concepts
 */

import { useState } from 'react';
import { aiService } from '@/services/ai.service';
import { MessageCircle, Loader2, Send } from 'lucide-react';

export function AIConceptExplainer({ defaultConcept = '', topicContext = '' }) {
    const [concept, setConcept] = useState(defaultConcept);
    const [explanation, setExplanation] = useState('');
    const [loading, setLoading] = useState(false);
    const [level, setLevel] = useState('beginner');

    const handleExplain = async (e) => {
        e.preventDefault();

        if (!concept.trim()) return;

        setLoading(true);

        try {
            const result = await aiService.explainConcept(
                concept,
                topicContext,
                level
            );

            setExplanation(result.explanation);
        } catch (err) {
            console.error('Explanation Error:', err);
            setExplanation('Failed to generate explanation. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-explainer">
            <div className="explainer-header">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Ask AI to Explain</h3>
            </div>

            <form onSubmit={handleExplain} className="explainer-form">
                <div className="form-group">
                    <input
                        type="text"
                        value={concept}
                        onChange={(e) => setConcept(e.target.value)}
                        placeholder="Enter a concept to explain (e.g., 'closures in JavaScript')"
                        className="input-primary"
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label className="text-sm text-gray-600">Explanation Level</label>
                    <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className="select-primary"
                        disabled={loading}
                    >
                        <option value="beginner">Beginner (Simple & Clear)</option>
                        <option value="intermediate">Intermediate (Moderate Detail)</option>
                        <option value="advanced">Advanced (Technical)</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading || !concept.trim()}
                    className="btn-primary flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Explaining...
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            Explain
                        </>
                    )}
                </button>
            </form>

            {explanation && (
                <div className="explainer-result">
                    <div className="result-badge">
                        <span className="text-xs font-medium text-blue-600">
                            {level.toUpperCase()} LEVEL
                        </span>
                    </div>
                    <p className="result-text">{explanation}</p>
                </div>
            )}
        </div>
    );
}
