/**
 * Response Formatter - Standardizes API responses
 */

export function formatResponse(data, metadata = {}) {
    return {
        success: true,
        data,
        metadata: {
            timestamp: new Date().toISOString(),
            ...metadata
        }
    };
}

export function formatError(message, statusCode = 500) {
    return {
        success: false,
        error: {
            message,
            statusCode,
            timestamp: new Date().toISOString()
        }
    };
}
