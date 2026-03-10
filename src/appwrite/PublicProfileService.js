import { Query } from "appwrite";
import AppwriteTablesDB from "./AppWriteTableDB";
import { USER_PROFILES_TABLE_ID, DOMAIN_PROGRESS_TABLE_ID, CERTIFICATES_TABLE_ID, PROJECT_SUBMISSIONS_TABLE_ID, ASSESSMENT_ATTEMPTS_TABLE_ID } from "../utils/appwrite/constants";
import DomainProgressService from "./DomainProgressService";
import CertificateService from "./CertificateService";
import ProjectSubmissionService from "./ProjectSubmissionService";

const db = new AppwriteTablesDB();

class PublicProfileService {
    /**
     * Get public profile by username
     * @param {string} username 
     */
    async getProfileByUsername(username) {
        try {
            const res = await db.listRows(USER_PROFILES_TABLE_ID, [
                Query.equal("username", username.toLowerCase()),
                Query.equal("isPublic", true)
            ]);

            if (!res.rows || res.rows.length === 0) {
                return null;
            }

            return res.rows[0];
        } catch (error) {
            console.error("Error getting profile by username:", error);
            return null;
        }
    }

    /**
     * Get or create user profile
     * @param {string} userId 
     * @param {Object} userData - Initial profile data
     */
    async getOrCreateProfile(userId, userData = {}) {
        try {
            // Try to find existing profile
            const res = await db.listRows(USER_PROFILES_TABLE_ID, [
                Query.equal("userId", userId)
            ]);

            if (res.rows && res.rows.length > 0) {
                return res.rows[0];
            }

            // Create new profile
            const profileData = {
                userId,
                username: userData.username || `user${Date.now()}`,
                fullName: userData.fullName || "User",
                targetRole: userData.targetRole || "",
                bio: userData.bio || "",
                avatarUrl: userData.avatarUrl || "",
                skills: JSON.stringify(userData.skills || []),
                isVerified: false,
                isPublic: true,
                linkedinUrl: userData.linkedinUrl || "",
                githubUrl: userData.githubUrl || "",
                portfolioUrl: userData.portfolioUrl || "",
            };

            return await db.createRow(USER_PROFILES_TABLE_ID, profileData);
        } catch (error) {
            console.error("Error getting/creating profile:", error);
            throw error;
        }
    }

    /**
     * Update user profile
     * @param {string} userId 
     * @param {Object} updates 
     */
    async updateProfile(userId, updates) {
        try {
            const profile = await this.getOrCreateProfile(userId);

            // If skills is an array, stringify it
            if (updates.skills && Array.isArray(updates.skills)) {
                updates.skills = JSON.stringify(updates.skills);
            }

            const updateData = { ...updates };

            return await db.updateRow(USER_PROFILES_TABLE_ID, profile.$id, updateData);
        } catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    }

    /**
     * Check if username is available
     * @param {string} username 
     * @param {string} currentUserId - Optional, to exclude current user
     */
    async isUsernameAvailable(username) {
        try {
            const res = await db.listRows(USER_PROFILES_TABLE_ID, [
                Query.equal("username", username.toLowerCase())
            ]);

            return !res.rows || res.rows.length === 0;
        } catch (error) {
            console.error("Error checking username:", error);
            return false;
        }
    }

    /**
     * Get complete public profile data (for public view)
     * @param {string} username 
     */
    async getCompletePublicProfile(username) {
        try {
            // Get profile
            const profile = await this.getProfileByUsername(username);

            if (!profile) {
                return null;
            }

            // Get verified domains
            const progressService = new DomainProgressService();
            const allProgress = await progressService.getUserDomainProgress(profile.userId);
            const verifiedDomains = allProgress.filter(p => p.isVerified);

            // Get certificates
            const certificateService = new CertificateService();
            const certificates = await certificateService.getUserCertificates(profile.userId);

            // Get approved projects
            const submissionService = new ProjectSubmissionService();
            const allSubmissions = await submissionService.getUserSubmissions(profile.userId);
            const approvedProjects = allSubmissions.filter(s => s.status === "approved");

            // Get learning stats
            const stats = await this.getLearningStats(profile.userId);

            // Parse skills
            const skills = this.parseSkills(profile.skills);

            return {
                profile: {
                    ...profile,
                    skills
                },
                verifiedDomains,
                certificates,
                projects: approvedProjects,
                stats
            };
        } catch (error) {
            console.error("Error getting complete public profile:", error);
            return null;
        }
    }

    /**
     * Get learning statistics
     * @param {string} userId 
     */
    async getLearningStats(userId) {
        try {
            const progressService = new DomainProgressService();
            const allProgress = await progressService.getUserDomainProgress(userId);

            // Get assessment attempts
            let assessmentsPassed = 0;
            try {
                const attemptsRes = await db.listRows(ASSESSMENT_ATTEMPTS_TABLE_ID, [
                    Query.equal("userId", userId),
                    Query.equal("passed", true)
                ]);
                assessmentsPassed = attemptsRes.total || 0;
            } catch (error) {
                console.error("Error getting assessment stats:", error);
            }

            return {
                totalDomains: allProgress.length,
                completedDomains: allProgress.filter(p => p.isCompleted).length,
                verifiedDomains: allProgress.filter(p => p.isVerified).length,
                assessmentsPassed,
                totalTopicsCompleted: allProgress.reduce((sum, p) => sum + (p.completedTopicsCount || 0), 0)
            };
        } catch (error) {
            console.error("Error getting learning stats:", error);
            return {
                totalDomains: 0,
                completedDomains: 0,
                verifiedDomains: 0,
                assessmentsPassed: 0,
                totalTopicsCompleted: 0
            };
        }
    }

    /**
     * Parse skills from JSON string
     * @param {string} skillsJson 
     */
    parseSkills(skillsJson) {
        try {
            return JSON.parse(skillsJson || "[]");
        } catch (error) {
            return [];
        }
    }

    /**
     * Generate profile URL
     * @param {string} username 
     */
    getProfileUrl(username) {
        return `/u/${username}`;
    }

    /**
     * Generate shareable LinkedIn URL
     * @param {string} username 
     * @param {string} fullName 
     */
    getLinkedInShareUrl(username, fullName) {
        const profileUrl = `${window.location.origin}/u/${username}`;
        const text = `Check out my SkillForge AI profile! I've completed verified domains and earned certificates.`;
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`;
    }

    /**
     * Validate username format
     * @param {string} username 
     */
    validateUsername(username) {
        const regex = /^[a-z0-9_]{3,50}$/;
        return regex.test(username);
    }
}

export default PublicProfileService;
