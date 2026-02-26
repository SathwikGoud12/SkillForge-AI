/**
 * Request Validator - Validates incoming requests
 */

const VALID_ACTIONS = [
    'generate_notes',
    'explain_concept',
    'generate_questions',
    'generate_assessment',
    'provide_feedback',
    'create_roadmap'
];

const MAX_PROMPT_LENGTH = 2000; // Prevent excessive token usage

export function validateRequest(body) {
    // Check if body exists
    if (!body || typeof body !== 'object') {
        return {
            valid: false,
            error: 'Request body must be a valid JSON object'
        };
    }

    // Check action
    const { action, payload } = body;

    if (!action) {
        return {
            valid: false,
            error: 'Missing required field: action'
        };
    }

    if (!VALID_ACTIONS.includes(action)) {
        return {
            valid: false,
            error: `Invalid action. Must be one of: ${VALID_ACTIONS.join(', ')}`
        };
    }

    if (!payload || typeof payload !== 'object') {
        return {
            valid: false,
            error: 'Missing or invalid payload object'
        };
    }

    // Action-specific validation
    const actionValidation = validateActionPayload(action, payload);
    if (!actionValidation.valid) {
        return actionValidation;
    }

    return { valid: true };
}

function validateActionPayload(action, payload) {
    switch (action) {
        case 'generate_notes':
            if (!payload.topic || typeof payload.topic !== 'string') {
                return { valid: false, error: 'generate_notes requires a topic (string)' };
            }
            if (payload.topic.length > MAX_PROMPT_LENGTH) {
                return { valid: false, error: `Topic exceeds maximum length of ${MAX_PROMPT_LENGTH} characters` };
            }
            break;

        case 'explain_concept':
            if (!payload.concept || typeof payload.concept !== 'string') {
                return { valid: false, error: 'explain_concept requires a concept (string)' };
            }
            if (payload.concept.length > MAX_PROMPT_LENGTH) {
                return { valid: false, error: `Concept exceeds maximum length of ${MAX_PROMPT_LENGTH} characters` };
            }
            break;

        case 'generate_questions':
            if (!payload.topic || typeof payload.topic !== 'string') {
                return { valid: false, error: 'generate_questions requires a topic (string)' };
            }
            if (payload.count && (typeof payload.count !== 'number' || payload.count < 1 || payload.count > 20)) {
                return { valid: false, error: 'count must be a number between 1 and 20' };
            }
            break;

        case 'generate_assessment':
            if (!payload.topic || typeof payload.topic !== 'string') {
                return { valid: false, error: 'generate_assessment requires a topic (string)' };
            }
            if (payload.questionCount && (typeof payload.questionCount !== 'number' || payload.questionCount < 1 || payload.questionCount > 30)) {
                return { valid: false, error: 'questionCount must be a number between 1 and 30' };
            }
            break;

        case 'provide_feedback':
            if (!payload.question || !payload.userAnswer || !payload.correctAnswer) {
                return { valid: false, error: 'provide_feedback requires question, userAnswer, and correctAnswer' };
            }
            break;

        case 'create_roadmap':
            if (!payload.domain || typeof payload.domain !== 'string') {
                return { valid: false, error: 'create_roadmap requires a domain (string)' };
            }
            break;
    }

    return { valid: true };
}
