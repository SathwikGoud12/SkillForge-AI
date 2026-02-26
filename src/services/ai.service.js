/**
 * AI Service for Frontend
 * Handles all AI-related API calls to Appwrite Function
 */

import { Client, Functions } from 'appwrite';

class AIServiceFrontend {
    constructor() {
        this.client = new Client()
            .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
            .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

        this.functions = new Functions(this.client);
        this.functionId = import.meta.env.VITE_APPWRITE_AI_FUNCTION_ID; // Add this to .env
    }

    /**
     * Execute AI function with proper error handling
     */
    async executeFunction(action, payload) {
        try {
            // Validate function ID
            if (!this.functionId) {
                console.error('AI Service Error: VITE_APPWRITE_AI_FUNCTION_ID is not set in environment variables');
                throw new Error('AI service is not properly configured. Please contact support.');
            }

            console.log('🤖 AI Service Request:', {
                action,
                payload,
                functionId: this.functionId
            });

            const response = await this.functions.createExecution(
                this.functionId,
                JSON.stringify({ action, payload }),
                false, // async execution
                '/', // path
                'POST' // method
            );

            console.log('📨 AI Function Response Status:', response.status);

            // 1. Check if we have a response body
            if (!response.responseBody) {
                console.error('AI Function Error: Empty response body. Status:', response.status);
                console.error('Full response:', response);
                throw new Error('AI service returned an empty response. Please check if the Appwrite function is deployed and running.');
            }

            // 2. Try to parse JSON
            let result;
            try {
                result = JSON.parse(response.responseBody);
                console.log('✅ AI Function Result:', result);
            } catch (e) {
                console.error('AI Function Error: Invalid JSON response:', response.responseBody);
                throw new Error('AI service returned an invalid response format.');
            }

            // 3. Check for success flag in our custom response format
            if (!result || !result.success) {
                const errorMessage = result?.error?.message || result?.message || 'AI function failed';
                console.error('❌ AI Function Failed:', errorMessage, result);
                throw new Error(errorMessage);
            }

            // 4. Validate data object exists
            if (!result.data) {
                console.warn('AI Function Warning: Success true but no data returned');
                return {};
            }

            return result.data;
        } catch (error) {
            console.error('🚨 AI Service Detailed Error:', {
                message: error.message,
                stack: error.stack,
                error: error
            });
            throw new Error(error.message || 'Failed to connect to AI service');
        }
    }

    /**
     * Generate study notes
     * @param {string} topic - Topic name
     * @param {string} domain - Domain/subject
     * @param {string} difficulty - beginner | intermediate | advanced
     */
    async generateNotes(topic, domain = '', difficulty = 'intermediate') {
        return this.executeFunction('generate_notes', {
            topic,
            domain,
            difficulty
        });
    }

    /**
     * Explain a concept
     * @param {string} concept - Concept to explain
     * @param {string} context - Additional context
     * @param {string} simplificationLevel - beginner | intermediate | advanced
     */
    async explainConcept(concept, context = '', simplificationLevel = 'beginner') {
        return this.executeFunction('explain_concept', {
            concept,
            context,
            simplificationLevel
        });
    }

    /**
     * Generate practice questions
     * @param {string} topic - Topic name
     * @param {number} count - Number of questions (1-20)
     * @param {string} difficulty - easy | medium | hard
     * @param {string} questionType - mcq | true-false | short-answer | mixed
     */
    async generateQuestions(topic, count = 5, difficulty = 'medium', questionType = 'mixed') {
        return this.executeFunction('generate_questions', {
            topic,
            count,
            difficulty,
            questionType
        });
    }

    /**
     * Generate assessment
     * @param {string} topic - Topic name
     * @param {string} domain - Domain/subject
     * @param {number} questionCount - Number of questions (1-30)
     * @param {string} difficulty - easy | medium | hard
     * @param {Array} includeTypes - ['mcq', 'true-false', 'short-answer']
     */
    async generateAssessment(topic, domain = '', questionCount = 10, difficulty = 'medium', includeTypes = ['mcq']) {
        return this.executeFunction('generate_assessment', {
            topic,
            domain,
            questionCount,
            difficulty,
            includeTypes
        });
    }

    /**
     * Get feedback on wrong answer
     * @param {string} question - The question text
     * @param {string} userAnswer - User's answer
     * @param {string} correctAnswer - Correct answer
     * @param {string} topic - Topic context
     */
    async provideFeedback(question, userAnswer, correctAnswer, topic = '') {
        return this.executeFunction('provide_feedback', {
            question,
            userAnswer,
            correctAnswer,
            topic
        });
    }

    /**
     * Create personalized learning roadmap
     * @param {string} domain - Domain/subject
     * @param {string} currentLevel - beginner | intermediate | advanced
     * @param {Array} goals - Array of learning goals
     * @param {string} timeframe - e.g., "3 months", "6 weeks"
     * @param {Array} weakAreas - Array of weak areas
     */
    async createRoadmap(domain, currentLevel = 'beginner', goals = [], timeframe = '3 months', weakAreas = []) {
        return this.executeFunction('create_roadmap', {
            domain,
            currentLevel,
            goals,
            timeframe,
            weakAreas
        });
    }
}

// Export singleton instance
export const aiService = new AIServiceFrontend();
