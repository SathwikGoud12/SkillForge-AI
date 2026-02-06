import { Query } from "appwrite";
import AppwriteTablesDB from "./AppWriteTableDB";
import { DOMAIN_PROGRESS_TABLE_ID } from "../utils/appwrite/constants";

const db = new AppwriteTablesDB();

class DomainProgressService {
    /**
     * Get or create domain progress for a user
     * @param {string} userId 
     * @param {string} domainId 
     * @param {number} totalTopics - Total topics in domain
     */
    async getOrCreateProgress(userId, domainId, totalTopics = 0) {
        try {
            // Try to find existing progress
            const res = await db.listRows(DOMAIN_PROGRESS_TABLE_ID, [
                Query.equal("userId", userId),
                Query.equal("domainId", domainId)
            ]);

            if (res.rows && res.rows.length > 0) {
                return res.rows[0];
            }

            // Create new progress if doesn't exist
            return await this.createProgress(userId, domainId, totalTopics);
        } catch (error) {
            console.error("Error getting domain progress:", error);
            throw error;
        }
    }

    /**
     * Create new domain progress
     * @param {string} userId 
     * @param {string} domainId 
     * @param {number} totalTopics 
     */
    async createProgress(userId, domainId, totalTopics) {
        const progressData = {
            userId,
            domainId,
            completedTopicsCount: 0,
            totalTopics,
            isCompleted: false,
            completedAt: null,
            progressPercentage: 0,
            lastUpdatedAt: new Date().toISOString()
        };

        return await db.createRow(DOMAIN_PROGRESS_TABLE_ID, progressData);
    }

    /**
     * Update domain progress
     * @param {string} userId 
     * @param {string} domainId 
     * @param {Object} updates 
     */
    async updateProgress(userId, domainId, updates) {
        try {
            // Get existing progress
            const progress = await this.getOrCreateProgress(userId, domainId);

            // Update with new data
            const updatedData = {
                ...updates,
                lastUpdatedAt: new Date().toISOString()
            };

            return await db.updateRow(
                DOMAIN_PROGRESS_TABLE_ID,
                progress.$id,
                updatedData
            );
        } catch (error) {
            console.error("Error updating domain progress:", error);
            throw error;
        }
    }

    /**
     * Check and update domain completion status
     * This is the MAIN function called when a topic is completed
     * @param {string} userId 
     * @param {string} domainId 
     * @param {number} completedTopicsCount - Current count of completed topics
     * @param {number} totalTopics - Total topics in domain
     */
    async checkAndUpdateDomainCompletion(userId, domainId, completedTopicsCount, totalTopics) {
        try {
            // Calculate progress percentage
            const progressPercentage = totalTopics > 0
                ? Math.round((completedTopicsCount / totalTopics) * 100)
                : 0;

            // Check if domain is completed
            const isCompleted = completedTopicsCount >= totalTopics && totalTopics > 0;

            // Prepare update data
            const updateData = {
                completedTopicsCount,
                totalTopics,
                progressPercentage,
                isCompleted,
                completedAt: isCompleted ? new Date().toISOString() : null
            };

            // Update progress
            const updated = await this.updateProgress(userId, domainId, updateData);

            return {
                ...updated,
                wasJustCompleted: isCompleted && completedTopicsCount === totalTopics
            };
        } catch (error) {
            console.error("Error checking domain completion:", error);
            throw error;
        }
    }

    /**
     * Get domain progress for a user
     * @param {string} userId 
     * @param {string} domainId 
     */
    async getDomainProgress(userId, domainId) {
        try {
            const res = await db.listRows(DOMAIN_PROGRESS_TABLE_ID, [
                Query.equal("userId", userId),
                Query.equal("domainId", domainId)
            ]);

            return res.rows && res.rows.length > 0 ? res.rows[0] : null;
        } catch (error) {
            console.error("Error getting domain progress:", error);
            return null;
        }
    }

    /**
     * Get all domain progress for a user
     * @param {string} userId 
     */
    async getAllUserDomainProgress(userId) {
        try {
            const res = await db.listRows(DOMAIN_PROGRESS_TABLE_ID, [
                Query.equal("userId", userId),
                Query.orderDesc("lastUpdatedAt")
            ]);

            return res.rows || [];
        } catch (error) {
            console.error("Error getting all domain progress:", error);
            return [];
        }
    }

    /**
     * Get completed domains for a user
     * @param {string} userId 
     */
    async getCompletedDomains(userId) {
        try {
            const res = await db.listRows(DOMAIN_PROGRESS_TABLE_ID, [
                Query.equal("userId", userId),
                Query.equal("isCompleted", true),
                Query.orderDesc("completedAt")
            ]);

            return res.rows || [];
        } catch (error) {
            console.error("Error getting completed domains:", error);
            return [];
        }
    }

    /**
     * Revert domain completion (for edge case: topic un-completed)
     * @param {string} userId 
     * @param {string} domainId 
     * @param {number} newCompletedCount 
     * @param {number} totalTopics 
     */
    async revertDomainCompletion(userId, domainId, newCompletedCount, totalTopics) {
        try {
            const progressPercentage = totalTopics > 0
                ? Math.round((newCompletedCount / totalTopics) * 100)
                : 0;

            const updateData = {
                completedTopicsCount: newCompletedCount,
                totalTopics,
                progressPercentage,
                isCompleted: false,
                completedAt: null
            };

            return await this.updateProgress(userId, domainId, updateData);
        } catch (error) {
            console.error("Error reverting domain completion:", error);
            throw error;
        }
    }

    /**
     * Verify a domain (called when final project is approved)
     * @param {string} userId 
     * @param {string} domainId 
     */
    async verifyDomain(userId, domainId) {
        try {
            const progress = await this.getDomainProgress(userId, domainId);

            if (!progress) {
                throw new Error("Domain progress not found");
            }

            if (!progress.isCompleted) {
                throw new Error("Domain must be completed before verification");
            }

            const updateData = {
                isVerified: true,
                verifiedAt: new Date().toISOString()
            };

            const updated = await db.updateRow(
                DOMAIN_PROGRESS_TABLE_ID,
                progress.$id,
                updateData
            );

            return {
                success: true,
                progress: updated,
                message: "Domain verified successfully!"
            };
        } catch (error) {
            console.error("Error verifying domain:", error);
            throw error;
        }
    }

    /**
     * Check if domain is verified
     * @param {string} userId 
     * @param {string} domainId 
     */
    async isDomainVerified(userId, domainId) {
        try {
            const progress = await this.getDomainProgress(userId, domainId);
            return progress?.isVerified === true;
        } catch (error) {
            console.error("Error checking domain verification:", error);
            return false;
        }
    }

    /**
     * Get verification status with details
     * @param {string} userId 
     * @param {string} domainId 
     */
    async getVerificationStatus(userId, domainId) {
        try {
            const progress = await this.getDomainProgress(userId, domainId);

            if (!progress) {
                return {
                    isCompleted: false,
                    isVerified: false,
                    verifiedAt: null,
                    canVerify: false
                };
            }

            return {
                isCompleted: progress.isCompleted || false,
                isVerified: progress.isVerified || false,
                verifiedAt: progress.verifiedAt || null,
                canVerify: progress.isCompleted && !progress.isVerified
            };
        } catch (error) {
            console.error("Error getting verification status:", error);
            return {
                isCompleted: false,
                isVerified: false,
                verifiedAt: null,
                canVerify: false
            };
        }
    }

    /**
     * Revert domain verification (admin only - for edge cases)
     * @param {string} userId 
     * @param {string} domainId 
     */
    async revertVerification(userId, domainId) {
        try {
            const updateData = {
                isVerified: false,
                verifiedAt: null
            };

            return await this.updateProgress(userId, domainId, updateData);
        } catch (error) {
            console.error("Error reverting verification:", error);
            throw error;
        }
    }

    /**
     * Get all verified domains for a user
     * @param {string} userId 
     */
    async getVerifiedDomains(userId) {
        try {
            const res = await db.listRows(DOMAIN_PROGRESS_TABLE_ID, [
                Query.equal("userId", userId),
                Query.equal("isVerified", true),
                Query.orderDesc("verifiedAt")
            ]);

            return res.rows || [];
        } catch (error) {
            console.error("Error getting verified domains:", error);
            return [];
        }
    }

    /**
     * Delete domain progress (admin only)
     * @param {string} progressId 
     */
    async deleteProgress(progressId) {
        return await db.deleteRow(DOMAIN_PROGRESS_TABLE_ID, progressId);
    }
}

export default DomainProgressService;
