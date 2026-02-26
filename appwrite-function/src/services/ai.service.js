/**
 * AI Service - Handles communication with Grok AI API
 * Uses Grok's free tier with proper error handling and timeouts
 */

export class AIService {
    constructor(apiKey) {
        if (!apiKey) {
            throw new Error('GROK_API_KEY environment variable is required');
        }
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.x.ai/v1';
        this.model = 'grok-beta'; // Free tier model
        this.timeout = 25000; // 25 seconds (under Appwrite's 30s limit)
    }

    /**
     * Generate AI completion with timeout and error handling
     * @param {string} prompt - The prompt to send to AI
     * @param {Object} options - Generation options
     * @returns {Promise<string>} AI response
     */
    async generateCompletion(prompt, options = {}) {
        const {
            maxTokens = 1000,
            temperature = 0.7,
            systemPrompt = 'You are an expert educational AI assistant for SkillForge, a learning platform. Provide clear, accurate, and helpful responses.'
        } = options;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'system',
                            content: systemPrompt
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: maxTokens,
                    temperature: temperature,
                    stream: false
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    `Grok API error: ${response.status} - ${errorData.error?.message || response.statusText}`
                );
            }

            const data = await response.json();

            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                throw new Error('Invalid response format from Grok API');
            }

            return data.choices[0].message.content.trim();

        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new Error('AI request timeout - please try again with a simpler prompt');
            }

            throw error;
        }
    }

    /**
     * Validate API key (optional health check)
     */
    async validateApiKey() {
        try {
            await this.generateCompletion('test', { maxTokens: 10 });
            return true;
        } catch (error) {
            return false;
        }
    }
}
