import { Query } from "appwrite";
import AppwriteTablesDB from "./AppWriteTableDB";
import { ASSESSMENT_ATTEMPTS_TABLE_ID } from "../utils/appwrite/constants";

const db = new AppwriteTablesDB();

class AssessmentAttemptService {
    /**
     * Create a new assessment attempt
     * @param {Object} data - { userId, assessmentId, topicId, domainId, answers, score, passed, attemptNumber, completedAt }
     */
    async createAttempt(data) {
        return db.createRow(ASSESSMENT_ATTEMPTS_TABLE_ID, data);
    }

    /**
     * Get all attempts for a specific assessment by a user
     * @param {string} userId 
     * @param {string} assessmentId 
     */
    async getUserAttempts(userId, assessmentId) {
        const res = await db.listRows(ASSESSMENT_ATTEMPTS_TABLE_ID, [
            Query.equal("userId", userId),
            Query.equal("assessmentId", assessmentId),
            Query.orderDesc("completedAt")
        ]);
        return res.rows || [];
    }

    /**
     * Get the best attempt (highest score) for a user on an assessment
     * @param {string} userId 
     * @param {string} assessmentId 
     */
    async getBestAttempt(userId, assessmentId) {
        const attempts = await this.getUserAttempts(userId, assessmentId);
        if (!attempts.length) return null;

        return attempts.reduce((best, current) =>
            (current.score > best.score) ? current : best
        );
    }

    /**
     * Get attempt count for a user on an assessment
     * @param {string} userId 
     * @param {string} assessmentId 
     */
    async getAttemptCount(userId, assessmentId) {
        const attempts = await this.getUserAttempts(userId, assessmentId);
        return attempts.length;
    }

    /**
     * Check if user has passed an assessment
     * @param {string} userId 
     * @param {string} assessmentId 
     */
    async hasPassed(userId, assessmentId) {
        const attempts = await this.getUserAttempts(userId, assessmentId);
        return attempts.some(attempt => attempt.passed);
    }

    /**
     * Get all attempts for a user across all assessments in a topic
     * @param {string} userId 
     * @param {string} topicId 
     */
    async getTopicAttempts(userId, topicId) {
        const res = await db.listRows(ASSESSMENT_ATTEMPTS_TABLE_ID, [
            Query.equal("userId", userId),
            Query.equal("topicId", topicId),
            Query.orderDesc("completedAt")
        ]);
        return res.rows || [];
    }

    /**
     * Get attempt by ID
     * @param {string} attemptId 
     */
    async getAttemptById(attemptId) {
        return db.getRow(ASSESSMENT_ATTEMPTS_TABLE_ID, attemptId);
    }
}

export default AssessmentAttemptService;
