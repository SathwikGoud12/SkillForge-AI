/**
 * Prompt Builder - Creates optimized prompts for different AI use cases
 * Designed to be cost-efficient and produce structured outputs
 */

export class PromptBuilder {

    /**
     * Generate study notes prompt
     */
    static buildNotesPrompt(topic, domain, difficulty) {
        return `Generate comprehensive study notes for the topic: "${topic}"${domain ? ` in the domain of ${domain}` : ''}.

Difficulty Level: ${difficulty}

Format the notes with:
1. **Key Concepts** - Main ideas and definitions
2. **Detailed Explanation** - Clear, structured explanation
3. **Important Points** - Bullet points of crucial information
4. **Examples** - Real-world examples or use cases
5. **Quick Summary** - 2-3 sentence recap

Keep it concise, educational, and well-structured. Use markdown formatting.`;
    }

    /**
     * Explain concept prompt
     */
    static buildExplanationPrompt(concept, context, simplificationLevel) {
        const levelInstructions = {
            beginner: 'Explain like I\'m 10 years old, using simple analogies and everyday examples.',
            intermediate: 'Explain with moderate technical detail, assuming basic knowledge.',
            advanced: 'Provide in-depth technical explanation with nuances.'
        };

        return `Explain the concept: "${concept}"${context ? `\n\nContext: ${context}` : ''}

Level: ${simplificationLevel}
${levelInstructions[simplificationLevel] || levelInstructions.intermediate}

Structure your explanation:
1. Simple definition
2. Why it matters
3. How it works (with analogy if beginner level)
4. Common misconceptions (if any)
5. Key takeaway

Keep it clear, engaging, and under 300 words.`;
    }

    /**
     * Generate practice questions prompt
     */
    static buildQuestionsPrompt(topic, count, difficulty, questionType) {
        const typeInstructions = {
            mcq: 'multiple choice questions with 4 options',
            'true-false': 'true/false questions',
            'short-answer': 'short answer questions',
            mixed: 'a mix of MCQ, true/false, and short answer questions'
        };

        return `Generate ${count} ${typeInstructions[questionType] || 'practice questions'} about: "${topic}"

Difficulty: ${difficulty}

Return ONLY a JSON array in this exact format:
{
  "questions": [
    {
      "type": "mcq" | "true-false" | "short-answer",
      "question": "Question text here",
      "options": ["A", "B", "C", "D"],  // only for MCQ
      "correctAnswer": "Correct answer",
      "explanation": "Brief explanation of the answer"
    }
  ]
}

Ensure questions are:
- Clear and unambiguous
- Testing understanding, not just memorization
- Progressively challenging
- Relevant to real-world application

Return ONLY valid JSON, no additional text.`;
    }

    /**
     * Generate assessment prompt
     */
    static buildAssessmentPrompt(topic, domain, questionCount, difficulty, includeTypes) {
        return `Create a comprehensive assessment for: "${topic}"${domain ? ` (${domain})` : ''}

Requirements:
- Total questions: ${questionCount}
- Difficulty: ${difficulty}
- Question types: ${includeTypes.join(', ')}
- Balanced coverage of the topic

Return ONLY a JSON object in this format:
{
  "questions": [
    {
      "id": 1,
      "type": "mcq" | "true-false" | "short-answer",
      "question": "Question text",
      "options": ["A", "B", "C", "D"],  // for MCQ only
      "correctAnswer": "Answer",
      "points": 1,
      "explanation": "Why this is correct",
      "topic": "Subtopic name"
    }
  ],
  "totalPoints": ${questionCount},
  "passingScore": ${Math.ceil(questionCount * 0.7)},
  "timeLimit": ${questionCount * 2}
}

Ensure:
- Questions cover different aspects of the topic
- Mix of easy, medium, and hard questions
- Clear, professional language
- Accurate answers

Return ONLY valid JSON.`;
    }

    /**
     * Provide feedback prompt
     */
    static buildFeedbackPrompt(question, userAnswer, correctAnswer, topic) {
        return `A student answered a question incorrectly. Provide constructive feedback.

Question: ${question}
Student's Answer: ${userAnswer}
Correct Answer: ${correctAnswer}
${topic ? `Topic: ${topic}` : ''}

Provide feedback that:
1. Acknowledges what the student got right (if anything)
2. Explains why their answer is incorrect
3. Clearly explains the correct answer
4. Provides a helpful tip or mnemonic to remember
5. Encourages the student

Keep it supportive, educational, and under 150 words.`;
    }

    /**
     * Create learning roadmap prompt
     */
    static buildRoadmapPrompt(domain, currentLevel, goals, timeframe, weakAreas) {
        return `Create a personalized learning roadmap for: ${domain}

Student Profile:
- Current Level: ${currentLevel}
- Timeframe: ${timeframe}
${goals.length > 0 ? `- Goals: ${goals.join(', ')}` : ''}
${weakAreas.length > 0 ? `- Weak Areas: ${weakAreas.join(', ')}` : ''}

Return a JSON object with this structure:
{
  "roadmap": {
    "phases": [
      {
        "phase": 1,
        "title": "Phase name",
        "duration": "2 weeks",
        "topics": ["Topic 1", "Topic 2"],
        "objectives": ["Learn X", "Master Y"],
        "resources": ["Resource type 1", "Resource type 2"]
      }
    ],
    "milestones": [
      {
        "week": 1,
        "goal": "Complete X",
        "assessment": "Quiz on Y"
      }
    ],
    "dailyCommitment": "1-2 hours",
    "tips": ["Tip 1", "Tip 2"]
  }
}

Make it:
- Realistic and achievable
- Progressive (building on previous knowledge)
- Focused on weak areas
- Aligned with stated goals

Return ONLY valid JSON.`;
    }
}
