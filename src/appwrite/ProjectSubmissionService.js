import { Query } from "appwrite";
import AppwriteTablesDB from "./AppWriteTableDB";
import { PROJECT_SUBMISSIONS_TABLE_ID } from "../utils/appwrite/constants";

const db = new AppwriteTablesDB();

class ProjectSubmissionService {
    /**
     * Submit a project
     * @param {Object} data - Submission data
     */
    async submitProject(data) {
        const submissionData = {
            ...data,
            status: "pending",
            submittedAt: new Date().toISOString(),
            reviewedAt: null,
            reviewNotes: null
        };
        return await db.createRow(PROJECT_SUBMISSIONS_TABLE_ID, submissionData);
    }

    /**
     * Get user's submission for a domain
     * @param {string} userId 
     * @param {string} domainId 
     */
    async getUserSubmission(userId, domainId) {
        try {
            const res = await db.listRows(PROJECT_SUBMISSIONS_TABLE_ID, [
                Query.equal("userId", userId),
                Query.equal("domainId", domainId),
                Query.orderDesc("submittedAt")
            ]);

            return res.rows && res.rows.length > 0 ? res.rows[0] : null;
        } catch (error) {
            console.error("Error getting user submission:", error);
            return null;
        }
    }

    /**
     * Check if user has approved submission for domain
     * @param {string} userId 
     * @param {string} domainId 
     */
    async hasApprovedSubmission(userId, domainId) {
        try {
            const res = await db.listRows(PROJECT_SUBMISSIONS_TABLE_ID, [
                Query.equal("userId", userId),
                Query.equal("domainId", domainId),
                Query.equal("status", "approved")
            ]);

            return res.rows && res.rows.length > 0;
        } catch (error) {
            console.error("Error checking approved submission:", error);
            return false;
        }
    }

    /**
     * Check if user can submit (no pending or approved submission)
     * @param {string} userId 
     * @param {string} domainId 
     */
    async canSubmit(userId, domainId) {
        try {
            const submission = await this.getUserSubmission(userId, domainId);

            // Can submit if:
            // 1. No submission exists
            // 2. Last submission was rejected
            return !submission || submission.status === "rejected";
        } catch (error) {
            console.error("Error checking can submit:", error);
            return false;
        }
    }

    /**
     * Get all submissions for a project (Admin)
     * @param {string} projectId 
     */
    async getProjectSubmissions(projectId) {
        try {
            const res = await db.listRows(PROJECT_SUBMISSIONS_TABLE_ID, [
                Query.equal("projectId", projectId),
                Query.orderDesc("submittedAt")
            ]);
            return res.rows || [];
        } catch (error) {
            console.error("Error getting project submissions:", error);
            return [];
        }
    }

    /**
     * Get all pending submissions (Admin)
     */
    async getPendingSubmissions() {
        try {
            const res = await db.listRows(PROJECT_SUBMISSIONS_TABLE_ID, [
                Query.equal("status", "pending"),
                Query.orderDesc("submittedAt")
            ]);
            return res.rows || [];
        } catch (error) {
            console.error("Error getting pending submissions:", error);
            return [];
        }
    }

    /**
     * Update submission status (Admin only)
     * @param {string} submissionId 
     * @param {string} status - "approved" or "rejected"
     * @param {string} reviewNotes - Optional feedback
     */
    async updateSubmissionStatus(submissionId, status, reviewNotes = null) {
        try {
            const updateData = {
                status,
                reviewedAt: new Date().toISOString()
            };

            if (reviewNotes) {
                updateData.reviewNotes = reviewNotes;
            }

            return await db.updateRow(PROJECT_SUBMISSIONS_TABLE_ID, submissionId, updateData);
        } catch (error) {
            console.error("Error updating submission status:", error);
            throw error;
        }
    }

    /**
     * Get all user's submissions across all domains
     * @param {string} userId 
     */
    async getAllUserSubmissions(userId) {
        try {
            const res = await db.listRows(PROJECT_SUBMISSIONS_TABLE_ID, [
                Query.equal("userId", userId),
                Query.orderDesc("submittedAt")
            ]);
            return res.rows || [];
        } catch (error) {
            console.error("Error getting all user submissions:", error);
            return [];
        }
    }

    /**
     * Get submission by ID
     * @param {string} submissionId 
     */
    async getSubmissionById(submissionId) {
        try {
            return await db.getRow(PROJECT_SUBMISSIONS_TABLE_ID, submissionId);
        } catch (error) {
            console.error("Error getting submission:", error);
            return null;
        }
    }

    /**
     * Delete submission (Admin only)
     * @param {string} submissionId 
     */
    async deleteSubmission(submissionId) {
        try {
            return await db.deleteRow(PROJECT_SUBMISSIONS_TABLE_ID, submissionId);
        } catch (error) {
            console.error("Error deleting submission:", error);
            throw error;
        }
    }

    /**
     * Get submission statistics for a domain (Admin)
     * @param {string} domainId 
     */
    async getDomainSubmissionStats(domainId) {
        try {
            const res = await db.listRows(PROJECT_SUBMISSIONS_TABLE_ID, [
                Query.equal("domainId", domainId)
            ]);

            const submissions = res.rows || [];
            const total = submissions.length;
            const pending = submissions.filter(s => s.status === "pending").length;
            const approved = submissions.filter(s => s.status === "approved").length;
            const rejected = submissions.filter(s => s.status === "rejected").length;

            return { total, pending, approved, rejected };
        } catch (error) {
            console.error("Error getting submission stats:", error);
            return { total: 0, pending: 0, approved: 0, rejected: 0 };
        }
    }

    /**
     * Get all submissions with optional filters (Admin)
     * @param {Object} filters - { status, domainId, limit }
     */
    async getAllSubmissions(filters = {}) {
        try {
            const queries = [];

            if (filters.status) {
                queries.push(Query.equal("status", filters.status));
            }
            if (filters.domainId) {
                queries.push(Query.equal("domainId", filters.domainId));
            }

            queries.push(Query.orderDesc("submittedAt"));

            if (filters.limit) {
                queries.push(Query.limit(filters.limit));
            }

            const res = await db.listRows(PROJECT_SUBMISSIONS_TABLE_ID, queries);
            return res.rows || [];
        } catch (error) {
            console.error("Error getting all submissions:", error);
            return [];
        }
    }

    /**
     * Get submissions by status (Admin)
     * @param {string} status - "pending", "approved", or "rejected"
     */
    async getSubmissionsByStatus(status) {
        try {
            const res = await db.listRows(PROJECT_SUBMISSIONS_TABLE_ID, [
                Query.equal("status", status),
                Query.orderDesc("submittedAt")
            ]);
            return res.rows || [];
        } catch (error) {
            console.error(`Error getting ${status} submissions:`, error);
            return [];
        }
    }

    /**
     * Review a project submission (Admin only)
     * This is the main review method that updates status and feedback
     * @param {string} submissionId 
     * @param {string} status - "approved" or "rejected"
     * @param {string} reviewNotes - Admin feedback (required for rejection)
     */
    async reviewProject(submissionId, status, reviewNotes = "") {
        try {
            // Validate inputs
            if (!["approved", "rejected"].includes(status)) {
                throw new Error("Invalid status. Must be 'approved' or 'rejected'");
            }

            if (status === "rejected" && !reviewNotes.trim()) {
                throw new Error("Review notes are required when rejecting a project");
            }

            const updateData = {
                status,
                reviewedAt: new Date().toISOString(),
                reviewNotes: reviewNotes.trim() || null
            };

            const updated = await db.updateRow(PROJECT_SUBMISSIONS_TABLE_ID, submissionId, updateData);

            return {
                success: true,
                submission: updated,
                message: status === "approved"
                    ? "Project approved successfully!"
                    : "Project rejected. User can resubmit."
            };
        } catch (error) {
            console.error("Error reviewing project:", error);
            throw error;
        }
    }
}

export default ProjectSubmissionService;
