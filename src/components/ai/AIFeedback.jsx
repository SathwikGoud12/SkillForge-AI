/**
 * AI Feedback Component
 * Provides intelligent feedback on wrong answers
 */

import { useState, useEffect } from 'react';
import { aiService } from '@/services/ai.service';
import { MessageSquare, Loader2, Lightbulb } from 'lucide-react';

export function AIFeedback({ question, userAnswer, correctAnswer, topic, autoLoad = false }) {
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (autoLoad && userAnswer !== correctAnswer) {
            loadFeedback();
        }
    }, [autoLoad, userAnswer, correctAnswer]);

    const loadFeedback = async () => {
        setLoading(true);
        setVisible(true);

        try {
            const result = await aiService.provideFeedback(
                question,
                userAnswer,
                correctAnswer,
                topic || ''
            );

            setFeedback(result.feedback);
        } catch (err) {
            console.error('Feedback Error:', err);
            setFeedback('Unable to generate feedback at this time.');
        } finally {
            setLoading(false);
        }
    };

    if (!visible && !autoLoad) {
        return (
            <button
                onClick={loadFeedback}
                className="btn-secondary-sm flex items-center gap-2"
            >
                <Lightbulb className="w-4 h-4" />
                Get AI Feedback
            </button>
        );
    }

    return (
        <div className="ai-feedback">
            <div className="feedback-header">
                <MessageSquare className="w-5 h-5 text-orange-600" />
                <h4 className="font-semibold">AI Feedback</h4>
            </div>

            {loading ? (
                <div className="feedback-loading">
                    <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
                    <p className="text-sm text-gray-600">Analyzing your answer...</p>
                </div>
            ) : (
                <div className="feedback-content">
                    <div className="feedback-comparison">
                        <div className="comparison-item wrong">
                            <span className="label">Your Answer:</span>
                            <p className="answer">{userAnswer}</p>
                        </div>
                        <div className="comparison-item correct">
                            <span className="label">Correct Answer:</span>
                            <p className="answer">{correctAnswer}</p>
                        </div>
                    </div>

                    <div className="feedback-text">
                        <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                        <p>{feedback}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
