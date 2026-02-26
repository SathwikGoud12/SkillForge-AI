/**
 * AI-Powered Topic Notes Component
 * Integrates with existing Topic Detail page to generate AI notes
 */

import { useState } from 'react';
import { aiService } from '@/services/ai.service';
import { Sparkles, Loader2, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export function AITopicNotes({ topic, domain }) {
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const generateNotes = async () => {
        setLoading(true);
        setError('');

        try {
            const result = await aiService.generateNotes(
                topic.name,
                domain?.name || '',
                'intermediate'
            );

            if (result && result.notes) {
                setNotes(result.notes);
            } else {
                throw new Error('AI generated notes, but the response was empty.');
            }
        } catch (err) {
            setError(err.message || 'Failed to generate notes');
            console.error('AI Notes Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-notes-container">
            {!notes && !loading && (
                <div className="ai-notes-empty">
                    <BookOpen className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">
                        Generate AI-powered study notes for this topic
                    </p>
                    <button
                        onClick={generateNotes}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Sparkles className="w-4 h-4" />
                        Generate AI Notes
                    </button>
                </div>
            )}

            {loading && (
                <div className="ai-notes-loading">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                    <p className="text-gray-600 mt-4">
                        AI is generating comprehensive notes...
                    </p>
                </div>
            )}

            {error && (
                <div className="ai-notes-error">
                    <p className="text-red-600">{error}</p>
                    <button onClick={generateNotes} className="btn-secondary mt-4">
                        Try Again
                    </button>
                </div>
            )}

            {notes && !loading && (
                <div className="ai-notes-content">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-purple-600" />
                            <h3 className="text-lg font-semibold">AI-Generated Notes</h3>
                        </div>
                        <button
                            onClick={generateNotes}
                            className="btn-secondary-sm"
                        >
                            Regenerate
                        </button>
                    </div>

                    <div className="prose prose-purple max-w-none">
                        <ReactMarkdown>{notes}</ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    );
}
