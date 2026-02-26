/**
 * Test Script for AI Function
 * Run this in your browser console to test all AI features
 */

import { aiService } from './services/ai.service';

export async function testAllAIFeatures() {
    console.log('🧪 Starting AI Feature Tests...\n');

    try {
        // Test 1: Generate Notes
        console.log('1️⃣ Testing: Generate Notes');
        const notes = await aiService.generateNotes(
            'React Hooks',
            'Frontend Development',
            'intermediate'
        );
        console.log('✅ Notes generated:', notes.notes.substring(0, 100) + '...');
        console.log('');

        // Test 2: Explain Concept
        console.log('2️⃣ Testing: Explain Concept');
        const explanation = await aiService.explainConcept(
            'useState Hook',
            'React',
            'beginner'
        );
        console.log('✅ Explanation:', explanation.explanation.substring(0, 100) + '...');
        console.log('');

        // Test 3: Generate Questions
        console.log('3️⃣ Testing: Generate Questions');
        const questions = await aiService.generateQuestions(
            'JavaScript Promises',
            3,
            'medium',
            'mcq'
        );
        console.log('✅ Questions generated:', questions.questions.length, 'questions');
        console.log('Sample question:', questions.questions[0]);
        console.log('');

        // Test 4: Generate Assessment
        console.log('4️⃣ Testing: Generate Assessment');
        const assessment = await aiService.generateAssessment(
            'Node.js Basics',
            'Backend Development',
            5,
            'medium',
            ['mcq', 'true-false']
        );
        console.log('✅ Assessment generated:', assessment.totalQuestions, 'questions');
        console.log('Sample question:', assessment.assessment[0]);
        console.log('');

        // Test 5: Provide Feedback
        console.log('5️⃣ Testing: Provide Feedback');
        const feedback = await aiService.provideFeedback(
            'What is a closure in JavaScript?',
            'A function inside another function',
            'A function that has access to variables from its outer scope',
            'JavaScript Fundamentals'
        );
        console.log('✅ Feedback:', feedback.feedback);
        console.log('');

        // Test 6: Create Roadmap
        console.log('6️⃣ Testing: Create Roadmap');
        const roadmap = await aiService.createRoadmap(
            'Full Stack Development',
            'beginner',
            ['Build a portfolio website', 'Get my first dev job'],
            '3 months',
            ['Backend APIs', 'Databases']
        );
        console.log('✅ Roadmap created with', roadmap.roadmap.phases?.length || 0, 'phases');
        console.log('First phase:', roadmap.roadmap.phases?.[0]);
        console.log('');

        console.log('🎉 All tests passed! AI integration is working perfectly!');
        return true;

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Error details:', error);
        return false;
    }
}

// Auto-run if in browser console
if (typeof window !== 'undefined') {
    console.log('AI Test Script Loaded!');
    console.log('Run: testAllAIFeatures()');
}
