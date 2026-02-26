/**
 * SkillForge AI Function - Main Entry Point
 * Handles all AI-powered features for the learning platform
 */

import { Client, Databases } from 'node-appwrite';
import { AIService } from './services/ai.service.js';
import { PromptBuilder } from './utils/prompt.builder.js';
import { validateRequest } from './utils/validator.js';
import { formatResponse, formatError } from './utils/response.formatter.js';

// Initialize Appwrite Client (for future DB operations)
const client = new Client()
  .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID || '');

const databases = new Databases(client);

// Initialize AI Service
const aiService = new AIService(process.env.GROK_API_KEY);

/**
 * Main handler function
 * @param {Object} context - Appwrite function context
 * @returns {Object} Response object
 */
export default async ({ req, res, log, error }) => {
  try {
    // Parse request body
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    log(`Received request: ${JSON.stringify(body)}`);

    // Validate request
    const validation = validateRequest(body);
    if (!validation.valid) {
      return res.json(formatError(validation.error, 400), 400);
    }

    const { action, payload } = body;

    // Route to appropriate handler
    let result;
    switch (action) {
      case 'generate_notes':
        result = await handleGenerateNotes(payload, log);
        break;

      case 'explain_concept':
        result = await handleExplainConcept(payload, log);
        break;

      case 'generate_questions':
        result = await handleGenerateQuestions(payload, log);
        break;

      case 'generate_assessment':
        result = await handleGenerateAssessment(payload, log);
        break;

      case 'provide_feedback':
        result = await handleProvideFeedback(payload, log);
        break;

      case 'create_roadmap':
        result = await handleCreateRoadmap(payload, log);
        break;

      default:
        return res.json(formatError(`Unknown action: ${action}`, 400), 400);
    }

    log(`Successfully processed ${action}`);
    return res.json(formatResponse(result));

  } catch (err) {
    error(`Function error: ${err.message}`);
    error(err.stack);
    return res.json(formatError(err.message, 500), 500);
  }
};

/**
 * Generate study notes from topic
 */
async function handleGenerateNotes(payload, log) {
  const { topic, domain, difficulty = 'intermediate' } = payload;

  if (!topic) {
    throw new Error('Topic is required');
  }

  const prompt = PromptBuilder.buildNotesPrompt(topic, domain, difficulty);
  log(`Generating notes for topic: ${topic}`);

  const aiResponse = await aiService.generateCompletion(prompt, {
    maxTokens: 1500,
    temperature: 0.7
  });

  return {
    topic,
    notes: aiResponse,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Explain concept in simple language
 */
async function handleExplainConcept(payload, log) {
  const { concept, context, simplificationLevel = 'beginner' } = payload;

  if (!concept) {
    throw new Error('Concept is required');
  }

  const prompt = PromptBuilder.buildExplanationPrompt(concept, context, simplificationLevel);
  log(`Explaining concept: ${concept}`);

  const aiResponse = await aiService.generateCompletion(prompt, {
    maxTokens: 800,
    temperature: 0.6
  });

  return {
    concept,
    explanation: aiResponse,
    level: simplificationLevel
  };
}

/**
 * Generate practice questions
 */
async function handleGenerateQuestions(payload, log) {
  const { topic, count = 5, difficulty = 'medium', questionType = 'mixed' } = payload;

  if (!topic) {
    throw new Error('Topic is required');
  }

  const prompt = PromptBuilder.buildQuestionsPrompt(topic, count, difficulty, questionType);
  log(`Generating ${count} questions for: ${topic}`);

  const aiResponse = await aiService.generateCompletion(prompt, {
    maxTokens: 2000,
    temperature: 0.8
  });

  // Parse JSON response
  let questions;
  try {
    questions = JSON.parse(aiResponse);
  } catch (e) {
    // If AI doesn't return valid JSON, wrap it
    questions = { questions: [{ question: aiResponse, type: 'text' }] };
  }

  return {
    topic,
    count,
    difficulty,
    questions: questions.questions || questions,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Generate assessment questions
 */
async function handleGenerateAssessment(payload, log) {
  const {
    topic,
    domain,
    questionCount = 10,
    difficulty = 'medium',
    includeTypes = ['mcq', 'true-false', 'short-answer']
  } = payload;

  if (!topic) {
    throw new Error('Topic is required');
  }

  const prompt = PromptBuilder.buildAssessmentPrompt(topic, domain, questionCount, difficulty, includeTypes);
  log(`Generating assessment with ${questionCount} questions for: ${topic}`);

  const aiResponse = await aiService.generateCompletion(prompt, {
    maxTokens: 3000,
    temperature: 0.7
  });

  let assessment;
  try {
    assessment = JSON.parse(aiResponse);
  } catch (e) {
    throw new Error('Failed to parse assessment response');
  }

  return {
    topic,
    domain,
    difficulty,
    totalQuestions: questionCount,
    assessment: assessment.questions || assessment,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Provide feedback on wrong answers
 */
async function handleProvideFeedback(payload, log) {
  const { question, userAnswer, correctAnswer, topic } = payload;

  if (!question || !userAnswer || !correctAnswer) {
    throw new Error('Question, user answer, and correct answer are required');
  }

  const prompt = PromptBuilder.buildFeedbackPrompt(question, userAnswer, correctAnswer, topic);
  log(`Generating feedback for question: ${question.substring(0, 50)}...`);

  const aiResponse = await aiService.generateCompletion(prompt, {
    maxTokens: 500,
    temperature: 0.6
  });

  return {
    question,
    userAnswer,
    correctAnswer,
    feedback: aiResponse,
    isCorrect: false
  };
}

/**
 * Create personalized learning roadmap
 */
async function handleCreateRoadmap(payload, log) {
  const {
    domain,
    currentLevel = 'beginner',
    goals = [],
    timeframe = '3 months',
    weakAreas = []
  } = payload;

  if (!domain) {
    throw new Error('Domain is required');
  }

  const prompt = PromptBuilder.buildRoadmapPrompt(domain, currentLevel, goals, timeframe, weakAreas);
  log(`Creating roadmap for domain: ${domain}`);

  const aiResponse = await aiService.generateCompletion(prompt, {
    maxTokens: 2500,
    temperature: 0.7
  });

  let roadmap;
  try {
    roadmap = JSON.parse(aiResponse);
  } catch (e) {
    // If not JSON, return as text
    roadmap = { roadmap: aiResponse };
  }

  return {
    domain,
    currentLevel,
    timeframe,
    roadmap: roadmap.roadmap || roadmap,
    generatedAt: new Date().toISOString()
  };
}
